import assets from "./assets.js";

const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Content-Security-Policy": "default-src 'self'; script-src 'self' https://unpkg.com https://www.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: blob: https://firebasestorage.googleapis.com https://*.googleapis.com; connect-src 'self' https://*.googleapis.com https://*.firebaseio.com wss://*.firebaseio.com https://securetoken.googleapis.com https://identitytoolkit.googleapis.com https://firebasestorage.googleapis.com; frame-src 'self' https://*.firebaseapp.com; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests"
};

const schemaStatements = [
  "CREATE TABLE IF NOT EXISTS profiles (id TEXT PRIMARY KEY, user_id TEXT NOT NULL UNIQUE, email TEXT NOT NULL, first_name TEXT NOT NULL, last_name TEXT NOT NULL, role TEXT NOT NULL CHECK(role IN ('student','parent','teacher','admin')), created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)",
  "CREATE TABLE IF NOT EXISTS students (id TEXT PRIMARY KEY, first_name TEXT NOT NULL, last_name TEXT NOT NULL, full_name_normalized TEXT NOT NULL, email TEXT, birth_date TEXT, course TEXT, guardian_name TEXT, created_by TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)",
  "CREATE TABLE IF NOT EXISTS contents (id TEXT PRIMARY KEY, title TEXT NOT NULL, description TEXT NOT NULL, instructions TEXT, resource_url TEXT, content_type TEXT NOT NULL, age_group TEXT, estimated_minutes INTEGER NOT NULL DEFAULT 30, teacher_id TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'draft', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)",
  "CREATE TABLE IF NOT EXISTS assignments (id TEXT PRIMARY KEY, content_id TEXT NOT NULL, student_id TEXT NOT NULL, assigned_by TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'assigned', assigned_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, UNIQUE(content_id, student_id), FOREIGN KEY(content_id) REFERENCES contents(id), FOREIGN KEY(student_id) REFERENCES students(id))",
  "CREATE INDEX IF NOT EXISTS idx_students_full_name_normalized ON students(full_name_normalized)",
  "CREATE INDEX IF NOT EXISTS idx_students_created_by ON students(created_by)",
  "CREATE INDEX IF NOT EXISTS idx_contents_teacher_id ON contents(teacher_id)",
  "CREATE INDEX IF NOT EXISTS idx_assignments_student_id ON assignments(student_id)"
];

let schemaReady = false;

function json(value, status = 200) {
  return new Response(JSON.stringify(value), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "Pragma": "no-cache",
      ...securityHeaders
    }
  });
}

function normalizeName(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function requestIdentity(request, fallbackEmail = "") {
  const forwardedId = request.headers.get("oai-authenticated-user-id");
  const forwardedEmail = request.headers.get("oai-authenticated-user-email");
  const url = new URL(request.url);
  if (forwardedId) return { userId: forwardedId, email: forwardedEmail || "", emailVerified: Boolean(forwardedEmail) };
  if (url.hostname === "localhost" || url.hostname === "127.0.0.1") {
    const email = fallbackEmail || "preview@newcode.local";
    return { userId: "preview:" + email.toLowerCase(), email, emailVerified: true };
  }
  return null;
}

async function ensureSchema(db) {
  if (schemaReady) return;
  await db.batch(schemaStatements.map((statement) => db.prepare(statement)));
  await db.prepare("PRAGMA optimize").run();
  schemaReady = true;
}

async function bodyJson(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

async function getProfile(db, userId) {
  return db.prepare("SELECT id, user_id, email, first_name, last_name, role FROM profiles WHERE user_id = ? LIMIT 1").bind(userId).first();
}

async function resolveProfile(db, identity, env, createCoordination = false) {
  let profile = await getProfile(db, identity.userId);
  if (profile) return profile;

  const verifiedEmail = identity.emailVerified ? String(identity.email || "").trim().toLowerCase() : "";
  if (verifiedEmail) {
    profile = await db.prepare(
      "SELECT id, user_id, email, first_name, last_name, role FROM profiles WHERE LOWER(email) = LOWER(?) ORDER BY created_at ASC LIMIT 1"
    ).bind(verifiedEmail).first();
    if (profile) {
      await db.prepare("UPDATE profiles SET user_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(identity.userId, profile.id).run();
      return getProfile(db, identity.userId);
    }
  }

  if (createCoordination && isCoordinationIdentity(identity, env)) {
    const id = crypto.randomUUID();
    await db.prepare(
      "INSERT INTO profiles (id, user_id, email, first_name, last_name, role) VALUES (?, ?, ?, ?, ?, ?)"
    ).bind(id, identity.userId, verifiedEmail, "Coordenação", "New Code", "admin").run();
    return getProfile(db, identity.userId);
  }
  return null;
}

function coordinationEmail(env) {
  return String(env.COORDINATION_EMAIL || "").trim().toLowerCase();
}

function isCoordinationIdentity(identity, env) {
  const allowedEmail = coordinationEmail(env);
  return Boolean(identity?.emailVerified && allowedEmail && String(identity.email || "").trim().toLowerCase() === allowedEmail);
}

async function authorizedProfile(db, profile, identity, env) {
  if (!profile) return null;
  const allowedEmail = coordinationEmail(env);
  const coordinationRecord = allowedEmail
    ? await db.prepare("SELECT id FROM profiles WHERE LOWER(email) = LOWER(?) ORDER BY created_at ASC LIMIT 1").bind(allowedEmail).first()
    : null;
  if (isCoordinationIdentity(identity, env) || coordinationRecord?.id === profile.id) return { ...profile, role: "admin" };
  if (profile.role === "admin") return { ...profile, role: "teacher" };
  return profile;
}

function profilePhotoKey(profile) {
  return "profile-photos/" + profile.id;
}

async function attachProfilePhoto(profile, env) {
  if (!profile || !env.PROFILE_PHOTOS) return profile;
  const object = await env.PROFILE_PHOTOS.head(profilePhotoKey(profile));
  if (!object) return profile;
  return { ...profile, photo_url: "/api/profile/photo?v=" + encodeURIComponent(object.etag || object.uploaded?.getTime?.() || "1") };
}

function requireRole(profile, roles) {
  return profile && roles.includes(profile.role);
}

async function apiSession(request, env) {
  const identity = requestIdentity(request);
  if (!identity) return json({ error: "Acesso não autenticado." }, 401);
  const profile = await authorizedProfile(env.DB, await resolveProfile(env.DB, identity, env, true), identity, env);
  return json({ profile: await attachProfilePhoto(profile, env), authenticated_email: identity.email || null });
}

async function apiRegister(request, env) {
  const payload = await bodyJson(request);
  const identity = requestIdentity(request, payload.email);
  if (!identity) return json({ error: "Acesso não autenticado." }, 401);

  const firstName = String(payload.first_name || "").trim();
  const lastName = String(payload.last_name || "").trim();
  const email = String(identity.email || payload.email || "").trim().toLowerCase();
  const requestedRole = String(payload.role || "");
  const role = isCoordinationIdentity(identity, env) ? "admin" : requestedRole;
  if (!firstName || !lastName || !email.includes("@") || !["student", "parent"].includes(requestedRole)) {
    return json({ error: "O cadastro público é exclusivo para alunos e responsáveis." }, 400);
  }

  const existing = await resolveProfile(env.DB, identity, env);
  const id = existing?.id || crypto.randomUUID();
  await env.DB.prepare(
    "INSERT INTO profiles (id, user_id, email, first_name, last_name, role) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET email = excluded.email, first_name = excluded.first_name, last_name = excluded.last_name, role = excluded.role, updated_at = CURRENT_TIMESTAMP"
  ).bind(id, identity.userId, email, firstName, lastName, role).run();

  const profile = await authorizedProfile(env.DB, await getProfile(env.DB, identity.userId), identity, env);
  return json({ profile: await attachProfilePhoto(profile, env) }, existing ? 200 : 201);
}

async function apiProfilePhoto(request, env) {
  const { profile } = await currentProfile(request, env);
  if (!profile) return json({ error: "Crie seu perfil antes de adicionar uma foto." }, 401);
  if (!env.PROFILE_PHOTOS) return json({ error: "Armazenamento de fotos indisponível." }, 503);

  const key = profilePhotoKey(profile);
  if (request.method === "GET") {
    const object = await env.PROFILE_PHOTOS.get(key);
    if (!object) return json({ error: "Foto ainda não cadastrada." }, 404);
    const headers = new Headers({
      "Content-Type": object.httpMetadata?.contentType || "image/jpeg",
      "Cache-Control": "private, max-age=3600",
      "Content-Disposition": "inline",
      ...securityHeaders
    });
    if (object.httpEtag) headers.set("ETag", object.httpEtag);
    return new Response(object.body, { headers });
  }

  if (request.method === "DELETE") {
    await env.PROFILE_PHOTOS.delete(key);
    return json({ ok: true });
  }

  const contentType = String(request.headers.get("content-type") || "").split(";")[0].toLowerCase();
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(contentType)) return json({ error: "Envie uma imagem JPG, PNG ou WebP." }, 415);

  const announcedSize = Number(request.headers.get("content-length") || 0);
  if (announcedSize > 3 * 1024 * 1024) return json({ error: "A foto deve ter no máximo 3 MB." }, 413);
  const bytes = await request.arrayBuffer();
  if (!bytes.byteLength || bytes.byteLength > 3 * 1024 * 1024) return json({ error: "A foto deve ter no máximo 3 MB." }, 413);

  await env.PROFILE_PHOTOS.put(key, bytes, {
    httpMetadata: { contentType, cacheControl: "private, max-age=3600" },
    customMetadata: { profileId: profile.id }
  });
  return json({ ok: true, photo_url: "/api/profile/photo?v=" + Date.now() });
}

async function currentProfile(request, env, payloadEmail = "") {
  const identity = requestIdentity(request, payloadEmail);
  if (!identity) return { identity: null, profile: null };
  return { identity, profile: await authorizedProfile(env.DB, await resolveProfile(env.DB, identity, env, true), identity, env) };
}

async function apiData(request, env) {
  const { profile } = await currentProfile(request, env);
  if (!profile) return json({ error: "Crie seu perfil antes de acessar o portal." }, 401);

  if (profile.role === "teacher" || profile.role === "admin") {
    const ownerFilter = profile.role === "teacher" ? " WHERE created_by = ?" : "";
    const contentFilter = profile.role === "teacher" ? " WHERE teacher_id = ?" : "";
    const studentsQuery = env.DB.prepare("SELECT * FROM students" + ownerFilter + " ORDER BY created_at DESC");
    const contentsQuery = env.DB.prepare("SELECT * FROM contents" + contentFilter + " ORDER BY created_at DESC");
    const students = profile.role === "teacher" ? await studentsQuery.bind(profile.id).all() : await studentsQuery.all();
    const contents = profile.role === "teacher" ? await contentsQuery.bind(profile.id).all() : await contentsQuery.all();
    const assignments = profile.role === "teacher"
      ? await env.DB.prepare("SELECT a.* FROM assignments a JOIN contents c ON c.id = a.content_id WHERE c.teacher_id = ? ORDER BY a.assigned_at DESC").bind(profile.id).all()
      : await env.DB.prepare("SELECT * FROM assignments ORDER BY assigned_at DESC").all();
    const teachers = profile.role === "admin"
      ? await env.DB.prepare("SELECT id, email, first_name, last_name, role, created_at FROM profiles WHERE role = 'teacher' ORDER BY created_at DESC").all()
      : { results: [] };
    return json({ students: students.results || [], contents: contents.results || [], assignments: assignments.results || [], teachers: teachers.results || [], children: [], assigned_contents: [] });
  }

  if (profile.role === "student") {
    const assigned = await env.DB.prepare(
      "SELECT c.*, a.status AS assignment_status, a.assigned_at FROM contents c JOIN assignments a ON a.content_id = c.id JOIN students s ON s.id = a.student_id WHERE LOWER(s.email) = LOWER(?) ORDER BY a.assigned_at DESC"
    ).bind(profile.email).all();
    return json({ students: [], contents: [], assignments: [], teachers: [], children: [], assigned_contents: assigned.results || [] });
  }

  return json({ students: [], contents: [], assignments: [], teachers: [], children: [], assigned_contents: [] });
}

async function apiStudents(request, env, studentId = "") {
  const payload = ["POST", "PATCH"].includes(request.method) ? await bodyJson(request) : {};
  const { profile } = await currentProfile(request, env, payload.email);
  if (!requireRole(profile, ["teacher", "admin"])) return json({ error: "Somente professores e coordenação podem acessar alunos." }, 403);

  if (!studentId && request.method === "GET") {
    const query = normalizeName(new URL(request.url).searchParams.get("q") || "");
    const ownerClause = profile.role === "teacher" ? " AND created_by = ?" : "";
    const statement = env.DB.prepare(
      "SELECT * FROM students WHERE full_name_normalized LIKE ?" + ownerClause + " ORDER BY first_name, last_name LIMIT 50"
    );
    const result = profile.role === "teacher"
      ? await statement.bind("%" + query + "%", profile.id).all()
      : await statement.bind("%" + query + "%").all();
    return json({ students: result.results || [] });
  }

  if (studentId) {
    const current = await env.DB.prepare("SELECT * FROM students WHERE id = ? LIMIT 1").bind(studentId).first();
    if (!current) return json({ error: "Aluno não encontrado." }, 404);
    if (profile.role === "teacher" && current.created_by !== profile.id) {
      return json({ error: "Você não tem permissão para alterar este aluno." }, 403);
    }
    if (request.method === "DELETE") {
      await env.DB.batch([
        env.DB.prepare("DELETE FROM assignments WHERE student_id = ?").bind(studentId),
        env.DB.prepare("DELETE FROM students WHERE id = ?").bind(studentId)
      ]);
      return json({ ok: true });
    }
    if (request.method !== "PATCH") return json({ error: "Método não permitido." }, 405);
    const firstName = String(payload.first_name || "").trim();
    const lastName = String(payload.last_name || "").trim();
    if (!firstName || !lastName) return json({ error: "Nome e sobrenome são obrigatórios." }, 400);
    await env.DB.prepare(
      "UPDATE students SET first_name = ?, last_name = ?, full_name_normalized = ?, email = ?, birth_date = ?, course = ?, guardian_name = ? WHERE id = ?"
    ).bind(
      firstName,
      lastName,
      normalizeName(firstName + " " + lastName),
      String(payload.email || "").trim().toLowerCase() || null,
      String(payload.birth_date || "") || null,
      String(payload.course || "").trim() || null,
      String(payload.guardian_name || "").trim() || null,
      studentId
    ).run();
    return json({ student: await env.DB.prepare("SELECT * FROM students WHERE id = ?").bind(studentId).first() });
  }

  if (request.method !== "POST") return json({ error: "Método não permitido." }, 405);

  const firstName = String(payload.first_name || "").trim();
  const lastName = String(payload.last_name || "").trim();
  if (!firstName || !lastName) return json({ error: "Nome e sobrenome são obrigatórios." }, 400);
  const id = crypto.randomUUID();
  await env.DB.prepare(
    "INSERT INTO students (id, first_name, last_name, full_name_normalized, email, birth_date, course, guardian_name, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
  ).bind(
    id,
    firstName,
    lastName,
    normalizeName(firstName + " " + lastName),
    String(payload.email || "").trim().toLowerCase() || null,
    String(payload.birth_date || "") || null,
    String(payload.course || "").trim() || null,
    String(payload.guardian_name || "").trim() || null,
    profile.id
  ).run();
  const student = await env.DB.prepare("SELECT * FROM students WHERE id = ?").bind(id).first();
  return json({ student }, 201);
}

async function apiContents(request, env, contentId = "") {
  const payload = ["POST", "PATCH"].includes(request.method) ? await bodyJson(request) : {};
  const { profile } = await currentProfile(request, env);
  if (!requireRole(profile, ["teacher", "admin"])) return json({ error: "Somente professores e coordenação podem alterar conteúdos." }, 403);

  if (contentId) {
    const current = await env.DB.prepare("SELECT * FROM contents WHERE id = ? LIMIT 1").bind(contentId).first();
    if (!current) return json({ error: "Conteúdo não encontrado." }, 404);
    if (profile.role === "teacher" && current.teacher_id !== profile.id) {
      return json({ error: "Você não tem permissão para alterar este conteúdo." }, 403);
    }
    if (request.method === "DELETE") {
      await env.DB.batch([
        env.DB.prepare("DELETE FROM assignments WHERE content_id = ?").bind(contentId),
        env.DB.prepare("DELETE FROM contents WHERE id = ?").bind(contentId)
      ]);
      return json({ ok: true });
    }
    if (request.method !== "PATCH") return json({ error: "Método não permitido." }, 405);
  } else if (request.method !== "POST") {
    return json({ error: "Método não permitido." }, 405);
  }

  const title = String(payload.title || "").trim();
  const description = String(payload.description || "").trim();
  const contentType = String(payload.content_type || "").trim();
  if (!title || !description || !contentType) return json({ error: "Título, tipo e descrição são obrigatórios." }, 400);
  const resourceUrl = String(payload.resource_url || "").trim();
  if (resourceUrl) {
    try {
      const parsed = new URL(resourceUrl);
      if (!["http:", "https:"].includes(parsed.protocol)) throw new Error("invalid");
    } catch {
      return json({ error: "Informe um link de material válido, começando com http ou https." }, 400);
    }
  }
  if (contentId) {
    await env.DB.prepare(
      "UPDATE contents SET title = ?, description = ?, instructions = ?, resource_url = ?, content_type = ?, age_group = ?, estimated_minutes = ? WHERE id = ?"
    ).bind(title, description, String(payload.instructions || "").trim() || null, resourceUrl || null, contentType, String(payload.age_group || "").trim() || null, Number(payload.estimated_minutes || 30), contentId).run();
    return json({ content: await env.DB.prepare("SELECT * FROM contents WHERE id = ?").bind(contentId).first() });
  }

  const id = crypto.randomUUID();
  await env.DB.prepare(
    "INSERT INTO contents (id, title, description, instructions, resource_url, content_type, age_group, estimated_minutes, teacher_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
  ).bind(id, title, description, String(payload.instructions || "").trim() || null, resourceUrl || null, contentType, String(payload.age_group || "").trim() || null, Number(payload.estimated_minutes || 30), profile.id).run();
  const content = await env.DB.prepare("SELECT * FROM contents WHERE id = ?").bind(id).first();
  return json({ content }, 201);
}

async function apiAssignments(request, env) {
  const payload = await bodyJson(request);
  const { profile } = await currentProfile(request, env);
  if (!requireRole(profile, ["teacher", "admin"])) return json({ error: "Somente professores e coordenação podem atribuir conteúdos." }, 403);
  if (!payload.content_id || !payload.student_id) return json({ error: "Selecione conteúdo e aluno." }, 400);

  const student = await env.DB.prepare("SELECT id, created_by FROM students WHERE id = ?").bind(payload.student_id).first();
  const content = await env.DB.prepare("SELECT id, teacher_id FROM contents WHERE id = ?").bind(payload.content_id).first();
  if (!student || !content) return json({ error: "Aluno ou conteúdo não encontrado." }, 404);
  if (profile.role === "teacher" && (student.created_by !== profile.id || content.teacher_id !== profile.id)) {
    return json({ error: "Você não tem permissão para usar este aluno ou conteúdo." }, 403);
  }

  const id = crypto.randomUUID();
  await env.DB.prepare(
    "INSERT INTO assignments (id, content_id, student_id, assigned_by) VALUES (?, ?, ?, ?) ON CONFLICT(content_id, student_id) DO UPDATE SET assigned_by = excluded.assigned_by, assigned_at = CURRENT_TIMESTAMP"
  ).bind(id, payload.content_id, payload.student_id, profile.id).run();
  return json({ ok: true }, 201);
}

async function handleApi(request, env) {
  if (!env.DB) return json({ error: "Banco de dados indisponível." }, 503);
  await ensureSchema(env.DB);
  const path = new URL(request.url).pathname;
  if (path === "/api/session" && request.method === "GET") return apiSession(request, env);
  if (path === "/api/register" && request.method === "POST") return apiRegister(request, env);
  if (path === "/api/profile/photo" && ["GET", "PUT", "DELETE"].includes(request.method)) return apiProfilePhoto(request, env);
  if (path === "/api/data" && request.method === "GET") return apiData(request, env);
  if (path === "/api/students" && ["GET", "POST"].includes(request.method)) return apiStudents(request, env);
  const studentMatch = path.match(/^\/api\/students\/([^/]+)$/);
  if (studentMatch && ["PATCH", "DELETE"].includes(request.method)) return apiStudents(request, env, decodeURIComponent(studentMatch[1]));
  if (path === "/api/contents" && request.method === "POST") return apiContents(request, env);
  const contentMatch = path.match(/^\/api\/contents\/([^/]+)$/);
  if (contentMatch && ["PATCH", "DELETE"].includes(request.method)) return apiContents(request, env, decodeURIComponent(contentMatch[1]));
  if (path === "/api/assignments" && request.method === "POST") return apiAssignments(request, env);
  if (path === "/api/attendance" && request.method === "POST") return json({ ok: true });
  if (path === "/api/reports" && request.method === "POST") return json({ ok: true });
  return json({ error: "Endpoint não encontrado." }, 404);
}

function localAsset(pathname) {
  const asset = assets[pathname];
  if (!asset) return null;
  const body = asset.base64
    ? Uint8Array.from(atob(asset.base64), (character) => character.charCodeAt(0))
    : asset.body;
  const headers = new Headers({
    "Content-Type": asset.mime,
    "Cache-Control": pathname === "/index.html" ? "no-cache" : "public, max-age=3600"
  });
  if (pathname === "/index.html") {
    Object.entries(securityHeaders).forEach(([key, value]) => headers.set(key, value));
  }
  return new Response(body, { status: 200, headers });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) return handleApi(request, env);

    let pathname = decodeURIComponent(url.pathname);
    if (pathname === "/") pathname = "/index.html";
    if (env?.ASSETS) {
      const assetResponse = await env.ASSETS.fetch(new Request(new URL(pathname, request.url), request));
      if (assetResponse.status !== 404) return assetResponse;
    }
    const response = localAsset(pathname);
    if (response) return response;
    if ((request.headers.get("accept") || "").includes("text/html")) return localAsset("/index.html");
    return new Response("Not found", { status: 404 });
  }
};
