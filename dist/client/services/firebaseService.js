import { deleteApp, initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  deleteUser,
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import {
  addDoc,
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
  where
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyAn1p8Ku_NTZnScNIRXm8VP6rXIQrsaLMg",
  authDomain: "newcodemlkote.firebaseapp.com",
  projectId: "newcodemlkote",
  storageBucket: "newcodemlkote.firebasestorage.app",
  messagingSenderId: "830365471209",
  appId: "1:830365471209:web:d3f4870e1b7e827b4ebb78",
  measurementId: "G-ZXSGS764LQ"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

setPersistence(auth, browserLocalPersistence).catch(() => {});

const authReady = new Promise((resolve) => {
  let unsubscribe = () => {};
  unsubscribe = onAuthStateChanged(auth, (user) => {
    unsubscribe();
    resolve(user);
  }, () => resolve(null));
});

const normalizeEmail = (value) => String(value || "").trim().toLowerCase();

function normalizeName(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function temporaryPassword() {
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  const values = new Uint32Array(12);
  crypto.getRandomValues(values);
  return "Nc!" + Array.from(values, (value) => characters[value % characters.length]).join("");
}

function plainValue(value) {
  if (value?.toDate instanceof Function) return value.toDate().toISOString();
  if (Array.isArray(value)) return value.map(plainValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, plainValue(item)]));
  }
  return value;
}

function snapshotData(snapshot) {
  return { id: snapshot.id, ...plainValue(snapshot.data()) };
}

function assignmentContent(content) {
  return {
    title: String(content.title || ""),
    description: String(content.description || ""),
    instructions: content.instructions || null,
    resource_url: content.resource_url || null,
    content_type: String(content.content_type || "Conteúdo"),
    age_group: content.age_group || null,
    estimated_minutes: Number(content.estimated_minutes || 30)
  };
}

function guardianEntries(payload) {
  return [
    {
      name: String(payload.guardian_name || "").trim(),
      email: normalizeEmail(payload.guardian_email),
      relationship: String(payload.guardian_relationship || "guardian")
    },
    {
      name: String(payload.guardian_two_name || "").trim(),
      email: normalizeEmail(payload.guardian_two_email),
      relationship: String(payload.guardian_two_relationship || "guardian")
    }
  ].filter((guardian) => guardian.name || guardian.email);
}

function splitFullName(value) {
  const parts = String(value || "").trim().split(/\s+/).filter(Boolean);
  return {
    first_name: parts.shift() || "Responsável",
    last_name: parts.join(" ") || "do aluno"
  };
}

function assignedContentFromAssignment(assignment) {
  if (!assignment.content) return null;
  return {
    id: assignment.content_id,
    ...assignment.content,
    assignment_id: assignment.id,
    assignment_status: assignment.status,
    assigned_at: assignment.assigned_at,
    assignment_instructions: assignment.assignment_instructions || null,
    due_at: assignment.due_at || null,
    pdf_url: assignment.pdf_url || null,
    pdf_name: assignment.pdf_name || null,
    student_id: assignment.student_id,
    student_name: assignment.student_name || null
  };
}

function friendlyError(error) {
  const messages = {
    "auth/email-already-in-use": "Este e-mail já possui uma conta. Use a opção de entrar.",
    "auth/invalid-credential": "E-mail ou senha incorretos.",
    "auth/invalid-email": "Informe um e-mail válido.",
    "auth/missing-password": "Digite sua senha.",
    "auth/weak-password": "Use uma senha com pelo menos 6 caracteres.",
    "auth/too-many-requests": "Muitas tentativas. Aguarde um pouco antes de tentar novamente.",
    "auth/unauthorized-domain": "Este endereço ainda precisa ser autorizado no Firebase Authentication.",
    "auth/operation-not-allowed": "Ative o acesso por e-mail e senha no Firebase Authentication.",
    "auth/configuration-not-found": "Ative o Firebase Authentication e o acesso por e-mail e senha.",
    "auth/network-request-failed": "Não foi possível falar com o Firebase. Verifique sua conexão e tente novamente.",
    "permission-denied": "O Firebase bloqueou esta operação. Publique as regras de segurança incluídas no projeto.",
    "storage/unauthorized": "O Firebase Storage bloqueou esta foto. Publique as regras de armazenamento incluídas no projeto.",
    "storage/object-not-found": "A foto não foi encontrada."
  };
  const code = String(error?.code || "").replace(/^firestore\//, "");
  return new Error(messages[error?.code] || messages[code] || error?.message || "Não foi possível concluir esta ação no Firebase.");
}

async function currentUser(required = true) {
  await authReady;
  const user = auth.currentUser;
  if (!user && required) throw new Error("Entre com seu e-mail e senha para continuar.");
  return user;
}

async function loadProfile(user) {
  if (!user) return null;
  const reference = doc(db, "profiles", user.uid);
  let snapshot;
  try {
    snapshot = await getDoc(reference);
  } catch (error) {
    throw friendlyError(error);
  }

  if (!snapshot.exists()) return null;
  return snapshotData(snapshot);
}

async function listCollection(name, ...constraints) {
  try {
    const source = constraints.length ? query(collection(db, name), ...constraints) : collection(db, name);
    const snapshot = await getDocs(source);
    return snapshot.docs.map(snapshotData);
  } catch (error) {
    throw friendlyError(error);
  }
}

async function requireProfile(roles = []) {
  const user = await currentUser();
  const profile = await loadProfile(user);
  if (!profile) throw new Error("Complete seu perfil antes de continuar.");
  if (roles.length && !roles.includes(profile.role)) throw new Error("Seu perfil não possui permissão para esta ação.");
  return { user, profile };
}

async function provisionGuardianAccount(guardian) {
  if (!guardian.name || !guardian.email || !guardian.email.includes("@")) {
    throw new Error("Preencha nome e e-mail válidos para cada responsável informado.");
  }
  const password = temporaryPassword();
  const guardianApp = initializeApp(firebaseConfig, "guardian-provisioning-" + crypto.randomUUID());
  const guardianAuth = getAuth(guardianApp);
  let guardianUser = null;
  try {
    guardianUser = (await createUserWithEmailAndPassword(guardianAuth, guardian.email, password)).user;
    const names = splitFullName(guardian.name);
    const guardianDb = getFirestore(guardianApp);
    await setDoc(doc(guardianDb, "profiles", guardianUser.uid), {
      user_id: guardianUser.uid,
      email: guardian.email,
      first_name: names.first_name,
      last_name: names.last_name,
      role: "parent",
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    });
    let resetEmailSent = true;
    try {
      await sendPasswordResetEmail(guardianAuth, guardian.email);
    } catch {
      resetEmailSent = false;
    }
    return {
      ...guardian,
      created: true,
      temporary_password: resetEmailSent ? null : password,
      reset_email_sent: resetEmailSent
    };
  } catch (error) {
    if (error?.code === "auth/email-already-in-use") {
      return { ...guardian, created: false, temporary_password: null, reset_email_sent: false };
    }
    if (guardianUser) {
      try { await deleteUser(guardianUser); } catch {}
    }
    throw friendlyError(error);
  } finally {
    try { await signOut(guardianAuth); } catch {}
    try { await deleteApp(guardianApp); } catch {}
  }
}

async function provisionGuardianAccounts(payload) {
  const guardians = guardianEntries(payload);
  if (!guardians.length) return [];
  const unique = [...new Map(guardians.map((guardian) => [guardian.email, guardian])).values()];
  return Promise.all(unique.map(provisionGuardianAccount));
}

class FirebasePlatformService {
  async session() {
    const user = await currentUser(false);
    if (!user) return { profile: null, authenticated_email: null };
    return { profile: await loadProfile(user), authenticated_email: normalizeEmail(user.email) };
  }

  async signIn(email, password) {
    try {
      const credential = await signInWithEmailAndPassword(auth, normalizeEmail(email), String(password || ""));
      const profile = await loadProfile(credential.user);
      return { profile, role: profile?.role || "student", needsProfile: !profile };
    } catch (error) {
      throw friendlyError(error);
    }
  }

  async register(payload) {
    const email = normalizeEmail(payload.email);
    const password = String(payload.password || "");
    const confirmation = String(payload.confirm_password || "");
    const requestedRole = String(payload.role || "");
    if (password.length < 6) throw new Error("Use uma senha com pelo menos 6 caracteres.");
    if (password !== confirmation) throw new Error("As senhas não coincidem.");
    if (!["student", "parent"].includes(requestedRole)) {
      throw new Error("O cadastro público é exclusivo para alunos e responsáveis. Professores são cadastrados pela coordenação.");
    }

    try {
      let user = auth.currentUser;
      if (!user || normalizeEmail(user.email) !== email) {
        if (user) await signOut(auth);
        user = (await createUserWithEmailAndPassword(auth, email, password)).user;
      }
      const profile = {
        user_id: user.uid,
        email,
        first_name: String(payload.first_name || "").trim(),
        last_name: String(payload.last_name || "").trim(),
        role: requestedRole,
        updated_at: serverTimestamp()
      };
      await setDoc(doc(db, "profiles", user.uid), { ...profile, created_at: serverTimestamp() }, { merge: true });
      return { profile: await loadProfile(user) };
    } catch (error) {
      throw friendlyError(error);
    }
  }

  async signOut() {
    await signOut(auth);
    return { ok: true };
  }

  async resetPassword(email) {
    const normalized = normalizeEmail(email);
    if (!normalized) throw new Error("Digite seu e-mail para receber o link de recuperação.");
    try {
      await sendPasswordResetEmail(auth, normalized);
      return { ok: true };
    } catch (error) {
      throw friendlyError(error);
    }
  }

  async updateProfile(payload) {
    const { user, profile } = await requireProfile();
    const firstName = String(payload.first_name || "").trim();
    const lastName = String(payload.last_name || "").trim();
    if (!firstName || !lastName) throw new Error("Nome e sobrenome são obrigatórios.");
    try {
      await updateDoc(doc(db, "profiles", user.uid), {
        first_name: firstName,
        last_name: lastName,
        role: profile.role,
        email: profile.email,
        updated_at: serverTimestamp()
      });
      return { profile: await loadProfile(user) };
    } catch (error) {
      if (error instanceof Error && !error.code) throw error;
      throw friendlyError(error);
    }
  }

  async data() {
    const { profile } = await requireProfile();
    if (["teacher", "admin"].includes(profile.role)) {
      const teacherConstraints = profile.role === "teacher";
      const [students, contents, assignments, profiles, lessons, pedagogicalRecords, academicStructure] = await Promise.all([
        listCollection("students", ...(teacherConstraints ? [where("created_by", "==", profile.id)] : [])),
        listCollection("contents", ...(teacherConstraints ? [where("teacher_id", "==", profile.id)] : [])),
        listCollection("assignments", ...(teacherConstraints ? [where("assigned_by", "==", profile.id)] : [])),
        profile.role === "admin" ? listCollection("profiles") : Promise.resolve([]),
        listCollection("lessons", ...(teacherConstraints ? [where("teacher_id", "==", profile.id)] : [])),
        listCollection("pedagogical_records", ...(teacherConstraints ? [where("created_by", "==", profile.id)] : [])),
        listCollection("academic_structure", ...(teacherConstraints ? [where("created_by", "==", profile.id)] : []))
      ]);
      const newestFirst = (items, key) => items.sort((a, b) => String(b[key] || "").localeCompare(String(a[key] || "")));
      const contentById = new Map(contents.map((content) => [content.id, content]));
      const assignmentsWithoutSnapshot = assignments.filter((assignment) => !assignment.content && contentById.has(assignment.content_id));
      if (profile.role === "admin" && assignmentsWithoutSnapshot.length && assignmentsWithoutSnapshot.length <= 450) {
        const batch = writeBatch(db);
        assignmentsWithoutSnapshot.forEach((assignment) => {
          const content = assignmentContent(contentById.get(assignment.content_id));
          assignment.content = content;
          batch.update(doc(db, "assignments", assignment.id), { content });
        });
        await batch.commit();
      }
      return {
        students: newestFirst(students, "created_at"),
        contents: newestFirst(contents, "created_at"),
        assignments: newestFirst(assignments, "assigned_at"),
        teachers: newestFirst(profiles.filter((item) => item.role === "teacher"), "created_at"),
        children: [],
        assigned_contents: [],
        lessons: newestFirst(lessons, "start_at"),
        pedagogical_records: newestFirst(pedagogicalRecords, "created_at"),
        academic_structure: newestFirst(academicStructure, "created_at")
      };
    }

    if (profile.role === "student") {
      try {
        const email = normalizeEmail(profile.email);
        const [assignmentSnapshot, lessonSnapshot, pedagogicalSnapshot] = await Promise.all([
          getDocs(query(collection(db, "assignments"), where("student_email", "==", email))),
          getDocs(query(collection(db, "lessons"), where("student_email", "==", email))),
          getDocs(query(collection(db, "pedagogical_records"), where("student_email", "==", email)))
        ]);
        const assignments = assignmentSnapshot.docs.map(snapshotData);
        return {
          students: [], contents: [], assignments: [], teachers: [], children: [], academic_structure: [],
          assigned_contents: assignments.map(assignedContentFromAssignment).filter(Boolean),
          lessons: lessonSnapshot.docs.map(snapshotData),
          pedagogical_records: pedagogicalSnapshot.docs.map(snapshotData).filter((record) => record.published === true)
        };
      } catch (error) {
        throw friendlyError(error);
      }
    }

    if (profile.role === "parent") {
      try {
        const email = normalizeEmail(profile.email);
        const [childrenSnapshot, assignmentSnapshot, lessonSnapshot, pedagogicalSnapshot] = await Promise.all([
          getDocs(query(collection(db, "students"), where("guardian_emails", "array-contains", email))),
          getDocs(query(collection(db, "assignments"), where("guardian_emails", "array-contains", email))),
          getDocs(query(collection(db, "lessons"), where("guardian_emails", "array-contains", email))),
          getDocs(query(collection(db, "pedagogical_records"), where("guardian_emails", "array-contains", email)))
        ]);
        const assignments = assignmentSnapshot.docs.map(snapshotData);
        return {
          students: [], contents: [], assignments: [], teachers: [], academic_structure: [],
          children: childrenSnapshot.docs.map(snapshotData),
          assigned_contents: assignments.map(assignedContentFromAssignment).filter(Boolean),
          lessons: lessonSnapshot.docs.map(snapshotData),
          pedagogical_records: pedagogicalSnapshot.docs.map(snapshotData).filter((record) => record.published === true)
        };
      } catch (error) {
        throw friendlyError(error);
      }
    }

    return { students: [], contents: [], assignments: [], teachers: [], children: [], assigned_contents: [], lessons: [], pedagogical_records: [], academic_structure: [] };
  }

  async createTeacher(payload) {
    const { profile } = await requireProfile(["admin"]);
    const email = normalizeEmail(payload.email);
    const firstName = String(payload.first_name || "").trim();
    const lastName = String(payload.last_name || "").trim();
    if (!firstName || !lastName || !email.includes("@")) {
      throw new Error("Preencha nome, sobrenome e e-mail do professor.");
    }

    const password = temporaryPassword();
    const provisioningApp = initializeApp(firebaseConfig, "teacher-provisioning-" + crypto.randomUUID());
    const provisioningAuth = getAuth(provisioningApp);
    let teacherUser = null;
    try {
      teacherUser = (await createUserWithEmailAndPassword(provisioningAuth, email, password)).user;
      const teacherProfile = {
        user_id: teacherUser.uid,
        email,
        first_name: firstName,
        last_name: lastName,
        role: "teacher",
        created_by: profile.id,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      };

      try {
        await setDoc(doc(db, "profiles", teacherUser.uid), teacherProfile);
      } catch (error) {
        const provisioningDb = getFirestore(provisioningApp);
        await setDoc(doc(provisioningDb, "profiles", teacherUser.uid), teacherProfile);
      }

      let resetEmailSent = true;
      try {
        await sendPasswordResetEmail(provisioningAuth, email);
      } catch {
        resetEmailSent = false;
      }
      return {
        teacher: { id: teacherUser.uid, ...teacherProfile, created_at: new Date().toISOString() },
        temporary_password: password,
        reset_email_sent: resetEmailSent
      };
    } catch (error) {
      if (teacherUser) {
        try { await deleteUser(teacherUser); } catch {}
      }
      throw friendlyError(error);
    } finally {
      try { await signOut(provisioningAuth); } catch {}
      try { await deleteApp(provisioningApp); } catch {}
    }
  }

  async updateTeacher(teacherId, payload) {
    await requireProfile(["admin"]);
    const reference = doc(db, "profiles", String(teacherId || ""));
    const firstName = String(payload.first_name || "").trim();
    const lastName = String(payload.last_name || "").trim();
    if (!firstName || !lastName) throw new Error("Nome e sobrenome são obrigatórios.");
    try {
      const snapshot = await getDoc(reference);
      if (!snapshot.exists() || snapshot.data().role !== "teacher") throw new Error("Professor não encontrado.");
      const current = snapshotData(snapshot);
      if (normalizeEmail(payload.email) !== normalizeEmail(current.email)) {
        throw new Error("O e-mail de acesso deve ser alterado pelo Firebase Authentication.");
      }
      await updateDoc(reference, {
        first_name: firstName,
        last_name: lastName,
        updated_at: serverTimestamp()
      });
      return { teacher: { ...current, first_name: firstName, last_name: lastName } };
    } catch (error) {
      if (error instanceof Error && !error.code) throw error;
      throw friendlyError(error);
    }
  }

  async deleteTeacher(teacherId) {
    await requireProfile(["admin"]);
    const reference = doc(db, "profiles", String(teacherId || ""));
    try {
      const snapshot = await getDoc(reference);
      if (!snapshot.exists() || snapshot.data().role !== "teacher") throw new Error("Professor não encontrado.");
      const [students, contents] = await Promise.all([
        listCollection("students", where("created_by", "==", teacherId)),
        listCollection("contents", where("teacher_id", "==", teacherId))
      ]);
      if (students.length || contents.length) {
        throw new Error("Este professor ainda possui alunos ou conteúdos vinculados. Organize esses registros antes de remover o acesso.");
      }
      await deleteDoc(reference);
      return { ok: true };
    } catch (error) {
      if (error instanceof Error && !error.code) throw error;
      throw friendlyError(error);
    }
  }

  async createStudent(payload) {
    const { profile } = await requireProfile(["teacher", "admin"]);
    const firstName = String(payload.first_name || "").trim();
    const lastName = String(payload.last_name || "").trim();
    const studentEmail = normalizeEmail(payload.email);
    if (!firstName || !lastName || !studentEmail.includes("@")) throw new Error("Nome, sobrenome e e-mail do aluno são obrigatórios.");
    const guardianAccounts = await provisionGuardianAccounts(payload);
    const guardians = guardianEntries(payload);
    const student = {
      first_name: firstName,
      last_name: lastName,
      full_name_normalized: normalizeName(firstName + " " + lastName),
      email: studentEmail,
      birth_date: String(payload.birth_date || "") || null,
      course: String(payload.course || "").trim() || null,
      guardian_name: String(payload.guardian_name || "").trim() || null,
      guardian_email: normalizeEmail(payload.guardian_email) || null,
      guardian_relationship: String(payload.guardian_relationship || "guardian"),
      guardian_two_name: String(payload.guardian_two_name || "").trim() || null,
      guardian_two_email: normalizeEmail(payload.guardian_two_email) || null,
      guardian_two_relationship: String(payload.guardian_two_relationship || "guardian"),
      guardian_emails: [...new Set(guardians.map((guardian) => guardian.email).filter(Boolean))],
      class_group_id: String(payload.class_group_id || "").trim() || null,
      created_by: profile.id,
      created_at: serverTimestamp()
    };
    try {
      const reference = await addDoc(collection(db, "students"), student);
      return { student: { id: reference.id, ...student, created_at: new Date().toISOString() }, guardian_accounts: guardianAccounts };
    } catch (error) {
      throw friendlyError(error);
    }
  }

  async updateStudent(studentId, payload) {
    const { profile } = await requireProfile(["teacher", "admin"]);
    const reference = doc(db, "students", String(studentId || ""));
    const firstName = String(payload.first_name || "").trim();
    const lastName = String(payload.last_name || "").trim();
    const studentEmail = normalizeEmail(payload.email);
    if (!firstName || !lastName || !studentEmail.includes("@")) throw new Error("Nome, sobrenome e e-mail do aluno são obrigatórios.");
    try {
      const snapshot = await getDoc(reference);
      if (!snapshot.exists()) throw new Error("Aluno não encontrado.");
      const current = snapshotData(snapshot);
      if (profile.role === "teacher" && current.created_by !== profile.id) {
        throw new Error("Você não tem permissão para editar este aluno.");
      }
      const guardianAccounts = await provisionGuardianAccounts(payload);
      const guardians = guardianEntries(payload);
      await updateDoc(reference, {
        first_name: firstName,
        last_name: lastName,
        full_name_normalized: normalizeName(firstName + " " + lastName),
        email: studentEmail,
        birth_date: String(payload.birth_date || "") || null,
        course: String(payload.course || "").trim() || null,
        guardian_name: String(payload.guardian_name || "").trim() || null,
        guardian_email: normalizeEmail(payload.guardian_email) || null,
        guardian_relationship: String(payload.guardian_relationship || "guardian"),
        guardian_two_name: String(payload.guardian_two_name || "").trim() || null,
        guardian_two_email: normalizeEmail(payload.guardian_two_email) || null,
        guardian_two_relationship: String(payload.guardian_two_relationship || "guardian"),
        guardian_emails: [...new Set(guardians.map((guardian) => guardian.email).filter(Boolean))],
        class_group_id: String(payload.class_group_id || "").trim() || null,
        updated_at: serverTimestamp()
      });
      return { student: { ...current, ...payload, first_name: firstName, last_name: lastName }, guardian_accounts: guardianAccounts };
    } catch (error) {
      if (error instanceof Error && !error.code) throw error;
      throw friendlyError(error);
    }
  }

  async deleteStudent(studentId) {
    const { profile } = await requireProfile(["teacher", "admin"]);
    const reference = doc(db, "students", String(studentId || ""));
    try {
      const snapshot = await getDoc(reference);
      if (!snapshot.exists()) throw new Error("Aluno não encontrado.");
      const student = snapshotData(snapshot);
      if (profile.role === "teacher" && student.created_by !== profile.id) {
        throw new Error("Você não tem permissão para excluir este aluno.");
      }
      const [linkedAssignments, linkedLessons, linkedRecords] = await Promise.all([
        listCollection("assignments", where("student_id", "==", studentId)),
        listCollection("lessons", where("student_id", "==", studentId)),
        listCollection("pedagogical_records", where("student_id", "==", studentId))
      ]);
      const deletionLimit = profile.role === "teacher" ? 15 : 450;
      if (linkedAssignments.length + linkedLessons.length + linkedRecords.length > deletionLimit) throw new Error("Este aluno possui muitos registros vinculados. Procure a coordenação para concluir a exclusão.");
      if (profile.role === "teacher" && linkedAssignments.some((item) => item.assigned_by !== profile.id)) {
        throw new Error("Este aluno possui atribuições da coordenação. Peça à coordenação para concluir a exclusão.");
      }
      const batch = writeBatch(db);
      linkedAssignments.forEach((item) => batch.delete(doc(db, "assignments", item.id)));
      linkedLessons.forEach((item) => batch.delete(doc(db, "lessons", item.id)));
      linkedRecords.forEach((item) => batch.delete(doc(db, "pedagogical_records", item.id)));
      batch.delete(reference);
      await batch.commit();
      return { ok: true, removed_assignments: linkedAssignments.length, removed_lessons: linkedLessons.length, removed_records: linkedRecords.length };
    } catch (error) {
      if (error instanceof Error && !error.code) throw error;
      throw friendlyError(error);
    }
  }

  async searchStudents(search) {
    const { profile } = await requireProfile(["teacher", "admin"]);
    const normalized = normalizeName(search);
    const students = await listCollection("students", ...(profile.role === "teacher" ? [where("created_by", "==", profile.id)] : []));
    return {
      students: students
        .filter((item) => String(item.full_name_normalized || "").includes(normalized))
        .sort((a, b) => (a.first_name + a.last_name).localeCompare(b.first_name + b.last_name))
        .slice(0, 50)
    };
  }

  async createContent(payload) {
    const { profile } = await requireProfile(["teacher", "admin"]);
    const title = String(payload.title || "").trim();
    const description = String(payload.description || "").trim();
    const contentType = String(payload.content_type || "").trim();
    if (!title || !description || !contentType) throw new Error("Título, tipo e descrição são obrigatórios.");
    const resourceUrl = String(payload.resource_url || "").trim();
    if (resourceUrl) {
      try {
        const parsed = new URL(resourceUrl);
        if (!["http:", "https:"].includes(parsed.protocol)) throw new Error("invalid");
      } catch {
        throw new Error("Informe um link válido, começando com http ou https.");
      }
    }
    const content = {
      title,
      description,
      instructions: String(payload.instructions || "").trim() || null,
      resource_url: resourceUrl || null,
      content_type: contentType,
      age_group: String(payload.age_group || "").trim() || null,
      estimated_minutes: Number(payload.estimated_minutes || 30),
      teacher_id: profile.id,
      status: "draft",
      created_at: serverTimestamp()
    };
    try {
      const reference = await addDoc(collection(db, "contents"), content);
      return { content: { id: reference.id, ...content, created_at: new Date().toISOString() } };
    } catch (error) {
      throw friendlyError(error);
    }
  }

  async updateContent(contentId, payload) {
    const { profile } = await requireProfile(["teacher", "admin"]);
    const reference = doc(db, "contents", String(contentId || ""));
    const title = String(payload.title || "").trim();
    const description = String(payload.description || "").trim();
    const contentType = String(payload.content_type || "").trim();
    if (!title || !description || !contentType) throw new Error("Título, tipo e descrição são obrigatórios.");
    const resourceUrl = String(payload.resource_url || "").trim();
    if (resourceUrl) {
      try {
        const parsed = new URL(resourceUrl);
        if (!["http:", "https:"].includes(parsed.protocol)) throw new Error("invalid");
      } catch {
        throw new Error("Informe um link válido, começando com http ou https.");
      }
    }
    try {
      const snapshot = await getDoc(reference);
      if (!snapshot.exists()) throw new Error("Conteúdo não encontrado.");
      const current = snapshotData(snapshot);
      if (profile.role === "teacher" && current.teacher_id !== profile.id) {
        throw new Error("Você não tem permissão para editar este conteúdo.");
      }
      const updatedFields = {
        title,
        description,
        instructions: String(payload.instructions || "").trim() || null,
        resource_url: resourceUrl || null,
        content_type: contentType,
        age_group: String(payload.age_group || "").trim() || null,
        estimated_minutes: Number(payload.estimated_minutes || 30),
        updated_at: serverTimestamp()
      };
      const linkedAssignments = await listCollection("assignments", where("content_id", "==", contentId));
      if (linkedAssignments.length > 450) {
        throw new Error("Este conteúdo possui muitas atribuições. Procure a coordenação para concluir a atualização.");
      }
      const assignmentContentSnapshot = assignmentContent({ ...current, ...updatedFields });
      const batch = writeBatch(db);
      batch.update(reference, updatedFields);
      linkedAssignments.forEach((assignment) => {
        batch.update(doc(db, "assignments", assignment.id), { content: assignmentContentSnapshot });
      });
      await batch.commit();
      return { content: { ...current, ...payload, title, description, content_type: contentType } };
    } catch (error) {
      if (error instanceof Error && !error.code) throw error;
      throw friendlyError(error);
    }
  }

  async deleteContent(contentId) {
    const { profile } = await requireProfile(["teacher", "admin"]);
    const reference = doc(db, "contents", String(contentId || ""));
    try {
      const snapshot = await getDoc(reference);
      if (!snapshot.exists()) throw new Error("Conteúdo não encontrado.");
      const content = snapshotData(snapshot);
      if (profile.role === "teacher" && content.teacher_id !== profile.id) {
        throw new Error("Você não tem permissão para excluir este conteúdo.");
      }
      const linkedAssignments = await listCollection("assignments", where("content_id", "==", contentId));
      const deletionLimit = profile.role === "teacher" ? 15 : 450;
      if (linkedAssignments.length > deletionLimit) throw new Error("Este conteúdo possui muitas atribuições. Procure a coordenação para concluir a exclusão.");
      if (profile.role === "teacher" && linkedAssignments.some((item) => item.assigned_by !== profile.id)) {
        throw new Error("Este conteúdo possui atribuições da coordenação. Peça à coordenação para concluir a exclusão.");
      }
      const batch = writeBatch(db);
      linkedAssignments.forEach((item) => batch.delete(doc(db, "assignments", item.id)));
      batch.delete(reference);
      await batch.commit();
      return { ok: true, removed_assignments: linkedAssignments.length };
    } catch (error) {
      if (error instanceof Error && !error.code) throw error;
      throw friendlyError(error);
    }
  }

  async assignContent(payload) {
    const { profile } = await requireProfile(["teacher", "admin"]);
    if (!payload.content_id || !payload.student_id) throw new Error("Selecione conteúdo e aluno.");
    const pdfUrl = String(payload.pdf_url || "").trim();
    if (pdfUrl) {
      try {
        const parsed = new URL(pdfUrl);
        if (!["http:", "https:"].includes(parsed.protocol)) throw new Error("invalid");
      } catch {
        throw new Error("Informe um link válido para o PDF, começando com http ou https.");
      }
    }
    try {
      const [studentSnapshot, contentSnapshot] = await Promise.all([
        getDoc(doc(db, "students", payload.student_id)),
        getDoc(doc(db, "contents", payload.content_id))
      ]);
      if (!studentSnapshot.exists() || !contentSnapshot.exists()) throw new Error("Aluno ou conteúdo não encontrado.");
      const student = snapshotData(studentSnapshot);
      const content = snapshotData(contentSnapshot);
      if (profile.role === "teacher" && (student.created_by !== profile.id || content.teacher_id !== profile.id)) {
        throw new Error("Você não tem permissão para usar este aluno ou conteúdo.");
      }
      const assignmentId = payload.content_id + "_" + payload.student_id;
      await setDoc(doc(db, "assignments", assignmentId), {
        content_id: payload.content_id,
        student_id: payload.student_id,
        student_email: normalizeEmail(student.email) || null,
        student_name: (student.first_name + " " + student.last_name).trim(),
        guardian_emails: Array.isArray(student.guardian_emails) ? student.guardian_emails : [student.guardian_email].filter(Boolean),
        assigned_by: profile.id,
        content: assignmentContent(content),
        assignment_instructions: String(payload.assignment_instructions || "").trim() || content.instructions || null,
        due_at: String(payload.due_at || "") || null,
        pdf_url: pdfUrl || null,
        pdf_name: String(payload.pdf_name || "").trim() || (pdfUrl ? "Atividade em PDF" : null),
        status: "assigned",
        assigned_at: serverTimestamp()
      }, { merge: true });
      return { ok: true, assignment_id: assignmentId };
    } catch (error) {
      if (error instanceof Error && !error.code) throw error;
      throw friendlyError(error);
    }
  }

  async uploadAssignmentPdf(assignmentId, file) {
    const { profile } = await requireProfile(["teacher", "admin"]);
    if (!file || file.type !== "application/pdf" || file.size > 10 * 1024 * 1024) {
      throw new Error("Escolha um arquivo PDF de até 10 MB.");
    }
    const assignmentReference = doc(db, "assignments", String(assignmentId || ""));
    try {
      const snapshot = await getDoc(assignmentReference);
      if (!snapshot.exists()) throw new Error("Atribuição não encontrada.");
      const assignment = snapshotData(snapshot);
      if (profile.role === "teacher" && assignment.assigned_by !== profile.id) {
        throw new Error("Você não tem permissão para alterar esta atribuição.");
      }
      const pdfReference = ref(storage, "assignment-pdfs/" + assignmentId + "/activity.pdf");
      await uploadBytes(pdfReference, file, { contentType: "application/pdf", customMetadata: { originalName: file.name } });
      const pdfUrl = await getDownloadURL(pdfReference);
      await updateDoc(assignmentReference, {
        pdf_url: pdfUrl,
        pdf_name: String(file.name || "atividade.pdf"),
        pdf_size: Number(file.size || 0),
        updated_at: serverTimestamp()
      });
      return { ok: true, pdf_url: pdfUrl };
    } catch (error) {
      if (error instanceof Error && !error.code) throw error;
      throw friendlyError(error);
    }
  }

  async createLesson(payload) {
    const { profile } = await requireProfile(["teacher", "admin"]);
    const studentReference = doc(db, "students", String(payload.student_id || ""));
    const studentSnapshot = await getDoc(studentReference);
    if (!studentSnapshot.exists()) throw new Error("Selecione um aluno válido.");
    const student = snapshotData(studentSnapshot);
    if (profile.role === "teacher" && student.created_by !== profile.id) throw new Error("Você não tem permissão para agendar uma aula para este aluno.");
    const startAt = String(payload.start_at || "");
    if (!String(payload.title || "").trim() || Number.isNaN(new Date(startAt).getTime())) throw new Error("Informe título, data e horário da aula.");
    const meetingUrl = String(payload.meeting_url || "").trim();
    if (meetingUrl) {
      try {
        const parsed = new URL(meetingUrl);
        if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error("invalid");
      } catch {
        throw new Error("Informe um link de aula válido, começando com http ou https.");
      }
    }
    const lesson = {
      title: String(payload.title).trim(),
      student_id: student.id,
      student_name: (student.first_name + " " + student.last_name).trim(),
      student_email: normalizeEmail(student.email) || null,
      guardian_emails: Array.isArray(student.guardian_emails) ? student.guardian_emails : [student.guardian_email].filter(Boolean),
      teacher_id: profile.id,
      teacher_name: ((profile.first_name || "") + " " + (profile.last_name || "")).trim(),
      start_at: startAt,
      duration_minutes: Number(payload.duration_minutes || 60),
      format: payload.format === "presential" ? "presential" : "online",
      meeting_url: meetingUrl || null,
      location: String(payload.location || "").trim() || null,
      notes: String(payload.notes || "").trim() || null,
      status: "scheduled",
      created_at: serverTimestamp()
    };
    const reference = await addDoc(collection(db, "lessons"), lesson);
    return { lesson: { id: reference.id, ...lesson, created_at: new Date().toISOString() } };
  }

  async createPedagogicalRecord(payload) {
    const { profile } = await requireProfile(["teacher", "admin"]);
    const studentSnapshot = await getDoc(doc(db, "students", String(payload.student_id || "")));
    if (!studentSnapshot.exists()) throw new Error("Selecione um aluno válido.");
    const student = snapshotData(studentSnapshot);
    if (profile.role === "teacher" && student.created_by !== profile.id) throw new Error("Você não tem permissão para registrar este aluno.");
    const record = {
      student_id: student.id,
      student_name: (student.first_name + " " + student.last_name).trim(),
      student_email: normalizeEmail(student.email) || null,
      guardian_emails: Array.isArray(student.guardian_emails) ? student.guardian_emails : [student.guardian_email].filter(Boolean),
      period: String(payload.period || "").trim(),
      summary: String(payload.summary || "").trim(),
      skills: String(payload.skills || "").trim() || null,
      next_steps: String(payload.next_steps || "").trim(),
      created_by: profile.id,
      teacher_name: ((profile.first_name || "") + " " + (profile.last_name || "")).trim(),
      published: true,
      created_at: serverTimestamp()
    };
    if (!record.period || !record.summary || !record.next_steps) throw new Error("Preencha período, evolução e próximos passos.");
    const reference = await addDoc(collection(db, "pedagogical_records"), record);
    return { record: { id: reference.id, ...record, created_at: new Date().toISOString() } };
  }

  async createAcademicItem(payload) {
    const { profile } = await requireProfile(["teacher", "admin"]);
    const kind = String(payload.kind || "");
    const name = String(payload.name || "").trim();
    if (!['school', 'course', 'class_group'].includes(kind) || !name) throw new Error("Informe o tipo e o nome do cadastro.");
    const meetingUrl = String(payload.meeting_url || "").trim();
    if (meetingUrl) {
      try {
        const parsed = new URL(meetingUrl);
        if (!["http:", "https:"].includes(parsed.protocol)) throw new Error("invalid");
      } catch {
        throw new Error("Informe um link válido para a sala online.");
      }
    }
    const item = {
      kind,
      name,
      school_id: String(payload.school_id || "").trim() || null,
      course_id: String(payload.course_id || "").trim() || null,
      modality: kind === "class_group" ? (payload.modality === "presential" ? "presential" : "online") : null,
      schedule: String(payload.schedule || "").trim() || null,
      meeting_url: meetingUrl || null,
      address: String(payload.address || "").trim() || null,
      description: String(payload.description || "").trim() || null,
      created_by: profile.id,
      created_at: serverTimestamp()
    };
    const reference = await addDoc(collection(db, "academic_structure"), item);
    return { item: { id: reference.id, ...item, created_at: new Date().toISOString() } };
  }

  async uploadProfilePhoto(file) {
    const { user } = await requireProfile();
    const photoReference = ref(storage, "profile-photos/" + user.uid + "/avatar");
    try {
      await uploadBytes(photoReference, file, { contentType: file.type });
      const photoUrl = await getDownloadURL(photoReference);
      await updateDoc(doc(db, "profiles", user.uid), { photo_url: photoUrl, updated_at: serverTimestamp() });
      return { ok: true, photo_url: photoUrl };
    } catch (error) {
      throw friendlyError(error);
    }
  }

  async removeProfilePhoto() {
    const { user } = await requireProfile();
    const photoReference = ref(storage, "profile-photos/" + user.uid + "/avatar");
    try {
      await deleteObject(photoReference);
    } catch (error) {
      if (error?.code !== "storage/object-not-found") throw friendlyError(error);
    }
    await updateDoc(doc(db, "profiles", user.uid), { photo_url: deleteField(), updated_at: serverTimestamp() });
    return { ok: true };
  }

  async saveAttendance(payload) {
    const { profile } = await requireProfile(["teacher", "admin"]);
    await addDoc(collection(db, "attendance"), { ...payload, created_by: profile.id, created_at: serverTimestamp() });
    return { ok: true };
  }

  async saveReport(payload) {
    const { profile } = await requireProfile(["teacher", "admin"]);
    await addDoc(collection(db, "reports"), { ...payload, created_by: profile.id, created_at: serverTimestamp() });
    return { ok: true };
  }
}

export const firebaseService = new FirebasePlatformService();
