import { platformService } from "./services/platformService.js";
import {
  renderLanding,
  renderLogin,
  renderSignup,
  renderShell,
  renderSkeleton,
  studentCreativePrompts,
  projectDetail,
  pdfViewer,
  notificationsDrawer,
  lessonDetail,
  calendarEventDetail,
  paymentModal,
  assignProjectModal,
  classPanel,
  finishClassModal,
  genericFormModal,
  commandPalette,
  profileMenu,
  onboarding,
  studentFormModal,
  teacherFormModal,
  teacherCredentialsModal,
  profileFormModal,
  contentFormModal,
  deleteRecordModal,
  assignContentModal,
  studentSearchResults,
  studentDetailDrawer,
  assignedContentModal,
  guardianAccountsModal,
  lessonFormModal,
  pedagogicalFormModal,
  academicItemModal,
  attendanceFormModal,
  roleRoots,
  roleLabels,
  pageTitles,
  projects
} from "./views.js";

const app = document.querySelector("#app");
const overlayRoot = document.querySelector("#overlay-root");
const toastStack = document.querySelector("#toast-stack");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (new URLSearchParams(window.location.search).get("continue") === "login") {
  window.history.replaceState(null, "", window.location.pathname + "#/login");
}

const pageSlugs = {
  home: "",
  trail: "trilha",
  projects: "projetos",
  classes: "aulas",
  calendar: "calendario",
  activities: "atividades",
  pedagogical: "pedagogico",
  achievements: "conquistas",
  profile: "perfil",
  children: "filhos",
  progress: "progresso",
  finance: "financeiro",
  reports: "relatorios",
  students: "alunos",
  attendance: "chamada",
  teachers: "professores",
  courses: "cursos",
  settings: "configuracoes"
};

const slugPages = Object.fromEntries(Object.entries(pageSlugs).map((entry) => [entry[1], entry[0]]));

const state = {
  screen: "landing",
  role: "student",
  page: "home",
  collapsed: localStorage.getItem("newcode-sidebar") === "collapsed",
  theme: localStorage.getItem("newcode-theme") || "light",
  childId: "lucas",
  projectFilter: "all",
  search: "",
  onboardingStep: 0,
  pdfPage: 0,
  pdfZoom: 1,
  activeProjectId: "jogo-plataforma",
  studentVibe: localStorage.getItem("newcode-student-vibe") || "curioso",
  creativePromptIndex: Number(sessionStorage.getItem("newcode-creative-prompt") || 0),
  profile: null,
  data: { students: [], contents: [], assignments: [], teachers: [], assigned_contents: [], children: [], lessons: [], pedagogical_records: [], academic_structure: [] },
  studentSearch: ""
};

let revealObserver;
let searchTimer;

function parseRoute() {
  const hash = window.location.hash || "#/";
  const clean = hash.replace(/^#\/?/, "");
  const parts = clean.split("/").filter(Boolean);

  if (!parts.length) return { screen: "landing" };
  if (parts[0] === "login") return { screen: "login" };
  if (parts[0] === "cadastro") return { screen: "signup" };

  const roleEntry = Object.entries(roleRoots).find((entry) => entry[1] === parts[0]);
  if (!roleEntry) return { screen: "landing" };
  return {
    screen: "portal",
    role: roleEntry[0],
    page: slugPages[parts[1] || ""] || "home"
  };
}

async function syncRoute() {
  const route = parseRoute();
  state.screen = route.screen;
  if (route.role) state.role = route.role;
  if (route.page) state.page = route.page;
  if (state.screen === "portal") {
    const ready = await loadPortalContext();
    if (!ready) return;
  }
  render();
}

async function loadPortalContext() {
  try {
    const session = await platformService.session();
    if (!session.profile) {
      window.location.hash = session.authenticated_email ? "#/cadastro" : "#/login";
      return false;
    }
    state.profile = session.profile;
    state.role = session.profile.role;
    const expectedRoot = roleRoots[state.role];
    const currentRoot = (window.location.hash.replace(/^#\/?/, "").split("/")[0] || "");
    if (currentRoot !== expectedRoot) {
      window.location.hash = "#/" + expectedRoot;
      return false;
    }
    state.data = await platformService.data();
    return true;
  } catch (error) {
    state.data = { students: [], contents: [], assignments: [], teachers: [], assigned_contents: [], children: [], lessons: [], pedagogical_records: [], academic_structure: [] };
    toast("Não foi possível carregar os dados.", error.message);
    return true;
  }
}

function navigateToPage(page) {
  state.page = page;
  state.projectFilter = "all";
  state.search = "";
  const root = roleRoots[state.role];
  const slug = pageSlugs[page] || "";
  window.location.hash = "#/" + root + (slug ? "/" + slug : "");
}

function render() {
  closeOverlay(true);
  document.documentElement.dataset.theme = state.theme;
  document.documentElement.style.colorScheme = state.theme;

  if (state.screen === "landing") app.innerHTML = renderLanding();
  else if (state.screen === "login") app.innerHTML = renderLogin();
  else if (state.screen === "signup") app.innerHTML = renderSignup();
  else app.innerHTML = renderShell(state);

  hydrate();
}

function renderPortalContent() {
  if (state.screen !== "portal") return;
  app.innerHTML = renderShell(state);
  hydrate();
}

function hydrate() {
  window.requestAnimationFrame(() => {
    createIcons();
    setupReveal();
    setupParallax();
  });
}

function createIcons(root = document) {
  if (!window.lucide) return;
  try {
    window.lucide.createIcons({
      root,
      attrs: {
        "stroke-width": 1.9
      }
    });
  } catch (error) {
    console.warn("Ícones serão exibidos após o carregamento.", error);
  }
}

function setupReveal() {
  if (revealObserver) revealObserver.disconnect();
  const elements = [...document.querySelectorAll(".reveal")];
  if (!elements.length) return;

  if (reducedMotion.matches || !("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -36px" });

  elements.forEach((element) => revealObserver.observe(element));
}

function setupParallax() {
  const stage = document.querySelector("#hero-stage");
  if (!stage || reducedMotion.matches || !window.matchMedia("(pointer:fine)").matches) return;

  stage.addEventListener("pointermove", (event) => {
    const rect = stage.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    stage.querySelectorAll(".hero-chip").forEach((chip, index) => {
      const force = (index + 1) * 5;
      chip.style.transform = "translate(" + (x * force) + "px," + (y * force) + "px)";
    });
    const robot = stage.querySelector(".robot");
    if (robot) robot.style.marginLeft = (x * 8) + "px";
  });

  stage.addEventListener("pointerleave", () => {
    stage.querySelectorAll(".hero-chip").forEach((chip) => chip.style.transform = "");
    const robot = stage.querySelector(".robot");
    if (robot) robot.style.marginLeft = "";
  });
}

function showPortalSkeleton() {
  const content = document.querySelector(".app-content");
  if (!content) return;
  content.innerHTML = renderSkeleton();
}

function openOverlay(content, type = "modal") {
  closeOverlay(true);
  const backdropClass = type === "drawer" ? "drawer-backdrop" : "modal-backdrop";
  overlayRoot.innerHTML = '<div class="' + backdropClass + '" data-overlay-backdrop>' + content + '</div>';
  document.body.classList.add("overlay-open");
  const backdrop = overlayRoot.firstElementChild;
  window.requestAnimationFrame(() => {
    backdrop.classList.add("is-open");
    createIcons(backdrop);
    const focusable = backdrop.querySelector("input, select, textarea, button, [tabindex]:not([tabindex='-1'])");
    if (focusable) focusable.focus({ preventScroll: true });
  });
}

function closeOverlay(immediate = false) {
  const backdrop = overlayRoot.firstElementChild;
  if (!backdrop) return;
  if (immediate || reducedMotion.matches) {
    overlayRoot.innerHTML = "";
    document.body.classList.remove("overlay-open");
    return;
  }
  backdrop.classList.remove("is-open");
  window.setTimeout(() => {
    if (overlayRoot.firstElementChild === backdrop) overlayRoot.innerHTML = "";
    document.body.classList.remove("overlay-open");
  }, 260);
}

function replaceOverlay(content, type = "modal") {
  const className = type === "drawer" ? "drawer-backdrop is-open" : "modal-backdrop is-open";
  overlayRoot.innerHTML = '<div class="' + className + '" data-overlay-backdrop>' + content + '</div>';
  document.body.classList.add("overlay-open");
  createIcons(overlayRoot);
}

function toast(title, message = "") {
  const element = document.createElement("div");
  element.className = "toast";
  element.innerHTML = '<i data-lucide="circle-check-big" aria-hidden="true"></i><div><strong>' + title + '</strong>' + (message ? '<span>' + message + '</span>' : '') + '</div>';
  toastStack.appendChild(element);
  createIcons(element);
  window.setTimeout(() => {
    element.style.opacity = "0";
    element.style.transform = "translateY(8px)";
    window.setTimeout(() => element.remove(), 220);
  }, 3600);
}

function setButtonLoading(button, label = "Salvando…") {
  if (!button) return () => {};
  const original = button.innerHTML;
  button.disabled = true;
  button.innerHTML = '<span class="boot-dots"><span></span><span></span><span></span></span> ' + label;
  return () => {
    button.disabled = false;
    button.innerHTML = original;
    createIcons(button);
  };
}

async function handleLogin(form) {
  const errorBox = document.querySelector("#login-error");
  const submit = document.querySelector("#login-submit");
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  const formData = new FormData(form);
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  if (errorBox) errorBox.textContent = "";
  const restore = setButtonLoading(submit, "Entrando…");

  try {
    const session = await platformService.signIn(email, password);
    sessionStorage.setItem("newcode-session", JSON.stringify(session));
    state.profile = session.profile || null;
    state.role = session.role;
    state.page = "home";
    if (session.needsProfile) {
      window.location.hash = "#/cadastro";
      toast("Login confirmado.", "Complete os dados do seu perfil para entrar no portal.");
      return;
    }
    const loginPage = document.querySelector(".login-page");
    if (loginPage) loginPage.classList.add("is-leaving");
    window.setTimeout(() => {
      window.location.hash = "#/" + roleRoots[session.role];
      if (session.role === "student" && !localStorage.getItem("newcode-onboarding-seen")) {
        window.setTimeout(() => openOverlay(onboarding(0)), 520);
      }
    }, reducedMotion.matches ? 20 : 430);
  } catch (error) {
    restore();
    if (errorBox) errorBox.textContent = error.message || "Não foi possível entrar. Tente novamente.";
    const firstInvalid = form.querySelector(":invalid");
    if (firstInvalid) firstInvalid.focus();
  }
}

async function handleAccountLogin(buttonElement) {
  const restore = setButtonLoading(buttonElement, "Abrindo…");
  try {
    const session = await platformService.session();
    if (!session.profile) {
      window.location.hash = "#/cadastro";
      return;
    }
    state.profile = session.profile;
    state.role = session.profile.role;
    state.page = "home";
    state.data = await platformService.data();
    window.location.hash = "#/" + roleRoots[state.role];
  } catch (error) {
    toast("Não foi possível entrar.", error.message);
  } finally {
    restore();
  }
}

async function handleSignup(form) {
  const errorBox = document.querySelector("#signup-error");
  const submit = document.querySelector("#signup-submit");
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  const restore = setButtonLoading(submit, "Criando…");
  if (errorBox) errorBox.textContent = "";
  const payload = Object.fromEntries(new FormData(form).entries());
  if (payload.password !== payload.confirm_password) {
    restore();
    if (errorBox) errorBox.textContent = "As senhas não coincidem.";
    return;
  }

  try {
    const result = await platformService.register(payload);
    state.profile = result.profile;
    state.role = result.profile.role;
    state.page = "home";
    state.data = await platformService.data();
    toast("Conta criada com sucesso.", "Seu espaço começa vazio e pronto para crescer.");
    window.location.hash = "#/" + roleRoots[state.role];
  } catch (error) {
    if (errorBox) errorBox.textContent = error.message;
  } finally {
    restore();
  }
}

async function refreshPortalData() {
  state.data = await platformService.data();
  renderPortalContent();
}

async function recoverPassword() {
  const email = String(document.querySelector("#email")?.value || "").trim();
  try {
    await platformService.resetPassword(email);
    toast("E-mail enviado!", "Confira sua caixa de entrada para criar uma nova senha.");
  } catch (error) {
    const errorBox = document.querySelector("#login-error");
    if (errorBox) errorBox.textContent = error.message;
    else toast("Não foi possível recuperar a senha.", error.message);
  }
}

async function logoutAccount() {
  try {
    await platformService.signOut();
  } catch {}
  sessionStorage.removeItem("newcode-session");
  state.profile = null;
  state.data = { students: [], contents: [], assignments: [], teachers: [], assigned_contents: [], children: [], lessons: [], pedagogical_records: [], academic_structure: [] };
  closeOverlay(true);
  window.location.hash = "#/login";
  toast("Sessão encerrada.");
}

async function uploadProfilePhoto(input) {
  const file = input.files?.[0];
  if (!file) return;
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    toast("Formato não aceito.", "Escolha uma imagem JPG, PNG ou WebP.");
    input.value = "";
    return;
  }
  if (file.size > 3 * 1024 * 1024) {
    toast("Imagem muito grande.", "Escolha uma foto de até 3 MB.");
    input.value = "";
    return;
  }

  const previousPhoto = state.profile?.photo_url;
  const previewUrl = URL.createObjectURL(file);
  state.profile = { ...state.profile, photo_url: previewUrl };
  render();
  toast("Enviando sua foto…", "A prévia já está aparecendo no seu perfil.");
  try {
    const result = await platformService.uploadProfilePhoto(file);
    state.profile = { ...state.profile, photo_url: result.photo_url };
    URL.revokeObjectURL(previewUrl);
    render();
    toast("Foto atualizada!", "Seu perfil ficou ainda mais pessoal.");
  } catch (error) {
    URL.revokeObjectURL(previewUrl);
    state.profile = { ...state.profile, photo_url: previousPhoto };
    if (!previousPhoto) delete state.profile.photo_url;
    render();
    toast("Não foi possível salvar a foto.", error.message);
  }
}

async function removeProfilePhoto(buttonElement) {
  const restore = setButtonLoading(buttonElement, "Removendo…");
  try {
    await platformService.removeProfilePhoto();
    if (state.profile) delete state.profile.photo_url;
    render();
    toast("Foto removida.", "As suas iniciais voltaram a aparecer no perfil.");
  } catch (error) {
    restore();
    toast("Não foi possível remover a foto.", error.message);
  }
}

async function saveFreshStudent(buttonElement) {
  const form = document.querySelector("#student-form");
  const errorBox = document.querySelector("#student-form-error");
  if (!form || !form.checkValidity()) {
    if (form) form.reportValidity();
    return;
  }
  const restore = setButtonLoading(buttonElement, "Salvando…");
  if (errorBox) errorBox.textContent = "";
  try {
    const payload = Object.fromEntries(new FormData(form).entries());
    const recordId = String(payload.record_id || "");
    delete payload.record_id;
    const result = recordId
      ? await platformService.updateStudent(recordId, payload)
      : await platformService.createStudent(payload);
    closeOverlay();
    await refreshPortalData();
    if (result?.guardian_accounts?.length) {
      openOverlay(guardianAccountsModal(result));
    }
    toast(recordId ? "Aluno e vínculos atualizados." : "Aluno cadastrado.", result?.guardian_accounts?.length ? "As contas dos responsáveis também foram verificadas." : (recordId ? "As correções já estão salvas." : "Agora ele pode ser encontrado pelo nome e sobrenome."));
  } catch (error) {
    if (errorBox) errorBox.textContent = error.message;
  } finally {
    restore();
  }
}

async function saveFreshContent(buttonElement) {
  const form = document.querySelector("#content-form");
  const errorBox = document.querySelector("#content-form-error");
  if (!form || !form.checkValidity()) {
    if (form) form.reportValidity();
    return;
  }
  const restore = setButtonLoading(buttonElement, "Salvando…");
  if (errorBox) errorBox.textContent = "";
  try {
    const payload = Object.fromEntries(new FormData(form).entries());
    const recordId = String(payload.record_id || "");
    delete payload.record_id;
    if (recordId) await platformService.updateContent(recordId, payload);
    else await platformService.createContent(payload);
    closeOverlay();
    await refreshPortalData();
    toast(recordId ? "Conteúdo atualizado." : "Conteúdo criado.", recordId ? "As correções já estão salvas." : "Use a busca de alunos para fazer a primeira atribuição.");
  } catch (error) {
    if (errorBox) errorBox.textContent = error.message;
  } finally {
    restore();
  }
}

async function saveFreshTeacher(buttonElement) {
  if (state.role !== "admin") {
    toast("Ação não permitida.", "Somente a coordenação pode cadastrar professores.");
    return;
  }
  const form = document.querySelector("#teacher-form");
  const errorBox = document.querySelector("#teacher-form-error");
  if (!form || !form.checkValidity()) {
    if (form) form.reportValidity();
    return;
  }
  const payload = Object.fromEntries(new FormData(form).entries());
  const recordId = String(payload.record_id || "");
  const restore = setButtonLoading(buttonElement, recordId ? "Salvando…" : "Criando conta…");
  if (errorBox) errorBox.textContent = "";
  try {
    delete payload.record_id;
    const result = recordId
      ? await platformService.updateTeacher(recordId, payload)
      : await platformService.createTeacher(payload);
    try {
      await refreshPortalData();
    } catch {
      state.data.teachers = recordId
        ? (state.data.teachers || []).map((teacher) => teacher.id === recordId ? result.teacher : teacher)
        : [result.teacher, ...(state.data.teachers || [])];
      renderPortalContent();
    }
    if (recordId) {
      closeOverlay();
      toast("Professor atualizado.", "O nome exibido foi corrigido.");
    } else {
      openOverlay(teacherCredentialsModal(result));
      toast("Professor cadastrado.", "A conta já pode acessar a plataforma.");
    }
  } catch (error) {
    restore();
    if (errorBox) errorBox.textContent = error.message;
  }
}

async function saveProfile(buttonElement) {
  const form = document.querySelector("#profile-form");
  const errorBox = document.querySelector("#profile-form-error");
  if (!form || !form.checkValidity()) {
    if (form) form.reportValidity();
    return;
  }
  const restore = setButtonLoading(buttonElement, "Salvando…");
  if (errorBox) errorBox.textContent = "";
  try {
    const result = await platformService.updateProfile(Object.fromEntries(new FormData(form).entries()));
    state.profile = result.profile;
    closeOverlay();
    renderPortalContent();
    toast("Perfil atualizado.", "Seu nome já aparece em toda a plataforma.");
  } catch (error) {
    restore();
    if (errorBox) errorBox.textContent = error.message;
  }
}

async function requestPasswordChange(buttonElement) {
  const email = String(state.profile?.email || "").trim();
  if (!email) {
    toast("E-mail não encontrado.", "Cadastre um e-mail válido antes de alterar a senha.");
    return;
  }
  const restore = setButtonLoading(buttonElement, "Enviando…");
  try {
    await platformService.resetPassword(email);
    toast("Link enviado!", "Confira " + email + " para escolher uma nova senha.");
  } catch (error) {
    toast("Não foi possível enviar o link.", error.message);
  } finally {
    restore();
  }
}

async function copyTeacherPassword(buttonElement) {
  const password = String(buttonElement?.dataset.password || "");
  if (!password) return;
  try {
    await navigator.clipboard.writeText(password);
  } catch {
    const input = document.createElement("textarea");
    input.value = password;
    input.style.position = "fixed";
    input.style.opacity = "0";
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    input.remove();
  }
  toast("Senha copiada.", "Envie-a somente ao professor cadastrado.");
}

function setStudentVibe(vibe, sourceElement) {
  if (state.role !== "student" || !["curioso", "focado", "ideias"].includes(vibe)) return;
  const labels = { curioso: "CURIOSO", focado: "FOCADO", ideias: "IDEIAS A MIL" };
  const messages = {
    curioso: "Hoje vale testar tudo e seguir a curiosidade.",
    focado: "Foco ligado. Uma ideia de cada vez, no seu ritmo.",
    ideias: "Ideias a mil? Joga todas na tela e vê o que acontece."
  };
  state.studentVibe = vibe;
  localStorage.setItem("newcode-student-vibe", vibe);
  document.querySelector(".fresh-student-space")?.setAttribute("data-vibe", vibe);
  document.querySelectorAll(".fresh-vibe-button").forEach((button) => {
    const active = button.dataset.vibe === vibe;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  const copy = document.querySelector("#student-vibe-copy");
  if (copy) copy.textContent = messages[vibe];
  const topLabel = document.querySelector(".student-top-vibe__label");
  if (topLabel) topLabel.textContent = "VIBE: " + labels[vibe];
  createStudentSparkBurst(sourceElement);
}

function cycleStudentVibe(sourceElement) {
  const vibes = ["curioso", "focado", "ideias"];
  const currentIndex = Math.max(0, vibes.indexOf(state.studentVibe));
  setStudentVibe(vibes[(currentIndex + 1) % vibes.length], sourceElement);
}

function shuffleCreativePrompt(sourceElement) {
  if (state.role !== "student") return;
  state.creativePromptIndex = (Number(state.creativePromptIndex || 0) + 1) % studentCreativePrompts.length;
  sessionStorage.setItem("newcode-creative-prompt", String(state.creativePromptIndex));
  const prompt = document.querySelector("#student-creative-prompt");
  if (prompt) {
    prompt.classList.remove("is-revealing");
    void prompt.offsetWidth;
    prompt.textContent = studentCreativePrompts[state.creativePromptIndex];
    prompt.classList.add("is-revealing");
  }
  sourceElement?.classList.add("is-popping");
  window.setTimeout(() => sourceElement?.classList.remove("is-popping"), 420);
  createStudentSparkBurst(sourceElement);
  if (sourceElement?.classList.contains("fresh-portal-core")) {
    document.querySelector(".fresh-creative-lab")?.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "center" });
  }
}

function createStudentSparkBurst(sourceElement) {
  if (!sourceElement || reducedMotion.matches) return;
  const rect = sourceElement.getBoundingClientRect();
  const burst = document.createElement("span");
  burst.className = "fresh-student-spark-burst";
  burst.style.left = rect.left + rect.width / 2 + "px";
  burst.style.top = rect.top + rect.height / 2 + "px";
  burst.innerHTML = Array.from({ length: 10 }, (_, index) => '<i style="--spark-angle:' + (index * 36) + 'deg"></i>').join("");
  document.body.appendChild(burst);
  window.setTimeout(() => burst.remove(), 800);
}

function canManageRecords() {
  if (["teacher", "admin"].includes(state.role)) return true;
  toast("Ação não permitida.", "Somente professores e a coordenação podem editar ou excluir cadastros.");
  return false;
}

async function confirmDeleteStudent(buttonElement) {
  if (!canManageRecords()) return;
  const recordId = String(buttonElement?.dataset.recordId || "");
  if (!recordId) return;
  const restore = setButtonLoading(buttonElement, "Excluindo…");
  try {
    await platformService.deleteStudent(recordId);
    closeOverlay();
    await refreshPortalData();
    toast("Aluno excluído.", "O cadastro e suas atribuições foram removidos.");
  } catch (error) {
    restore();
    toast("Não foi possível excluir o aluno.", error.message);
  }
}

async function confirmDeleteContent(buttonElement) {
  if (!canManageRecords()) return;
  const recordId = String(buttonElement?.dataset.recordId || "");
  if (!recordId) return;
  const restore = setButtonLoading(buttonElement, "Excluindo…");
  try {
    await platformService.deleteContent(recordId);
    closeOverlay();
    await refreshPortalData();
    toast("Conteúdo excluído.", "O material e suas atribuições foram removidos.");
  } catch (error) {
    restore();
    toast("Não foi possível excluir o conteúdo.", error.message);
  }
}

async function confirmDeleteTeacher(buttonElement) {
  if (state.role !== "admin") {
    toast("Ação não permitida.", "Somente a coordenação pode remover professores.");
    return;
  }
  const recordId = String(buttonElement?.dataset.recordId || "");
  if (!recordId) return;
  const restore = setButtonLoading(buttonElement, "Removendo…");
  try {
    await platformService.deleteTeacher(recordId);
    closeOverlay();
    await refreshPortalData();
    toast("Acesso de professor removido.", "O perfil não pode mais administrar a plataforma.");
  } catch (error) {
    restore();
    toast("Não foi possível remover o professor.", error.message);
  }
}

async function confirmFreshAssignment(buttonElement) {
  const form = document.querySelector("#assign-form");
  const errorBox = document.querySelector("#assign-form-error");
  const formData = form ? new FormData(form) : new FormData();
  const payload = Object.fromEntries(formData.entries());
  if (!payload.content_id || !payload.student_id) {
    if (errorBox) errorBox.textContent = "Selecione um conteúdo e um aluno.";
    return;
  }
  const restore = setButtonLoading(buttonElement, "Atribuindo…");
  try {
    await platformService.assignContent(payload);
    closeOverlay();
    await refreshPortalData();
    toast("Atividade atribuída.", payload.pdf_url ? "Instruções e link do PDF já estão disponíveis para o aluno e os responsáveis." : "As instruções já estão disponíveis para o aluno e os responsáveis.");
  } catch (error) {
    if (errorBox) errorBox.textContent = error.message;
  } finally {
    restore();
  }
}

async function searchAssignmentStudents(query) {
  const results = document.querySelector("#assign-student-results");
  if (!results) return;
  if (query.trim().length < 2) {
    results.innerHTML = "<p>Digite pelo menos 2 letras para pesquisar.</p>";
    return;
  }
  try {
    const response = await platformService.searchStudents(query.trim());
    results.innerHTML = studentSearchResults(response.students || []);
    createIcons(results);
  } catch (error) {
    results.innerHTML = "<p>" + error.message + "</p>";
  }
}

async function saveLesson(buttonElement) {
  const form = document.querySelector("#lesson-form");
  const errorBox = document.querySelector("#lesson-form-error");
  if (!form || !form.checkValidity()) {
    form?.reportValidity();
    return;
  }
  const restore = setButtonLoading(buttonElement, "Agendando…");
  try {
    const payload = Object.fromEntries(new FormData(form).entries());
    payload.start_at = payload.date + "T" + payload.time + ":00";
    delete payload.date;
    delete payload.time;
    await platformService.createLesson(payload);
    closeOverlay();
    await refreshPortalData();
    toast("Aula agendada.", "Aluno e responsáveis já podem vê-la na agenda.");
  } catch (error) {
    if (errorBox) errorBox.textContent = error.message;
  } finally {
    restore();
  }
}

async function savePedagogicalRecord(buttonElement) {
  const form = document.querySelector("#pedagogical-form");
  const errorBox = document.querySelector("#pedagogical-form-error");
  if (!form || !form.checkValidity()) {
    form?.reportValidity();
    return;
  }
  const restore = setButtonLoading(buttonElement, "Publicando…");
  try {
    await platformService.createPedagogicalRecord(Object.fromEntries(new FormData(form).entries()));
    closeOverlay();
    await refreshPortalData();
    toast("Registro publicado.", "O acompanhamento já está visível para o aluno e os responsáveis.");
  } catch (error) {
    if (errorBox) errorBox.textContent = error.message;
  } finally {
    restore();
  }
}

async function saveAcademicItem(buttonElement) {
  const form = document.querySelector("#academic-form");
  const errorBox = document.querySelector("#academic-form-error");
  if (!form || !form.checkValidity()) {
    form?.reportValidity();
    return;
  }
  const restore = setButtonLoading(buttonElement, "Salvando…");
  try {
    await platformService.createAcademicItem(Object.fromEntries(new FormData(form).entries()));
    closeOverlay();
    await refreshPortalData();
    toast("Cadastro salvo.", "A estrutura de escolas, cursos e turmas foi atualizada.");
  } catch (error) {
    if (errorBox) errorBox.textContent = error.message;
  } finally {
    restore();
  }
}

async function saveAttendance(buttonElement) {
  const form = document.querySelector("#attendance-form");
  const errorBox = document.querySelector("#attendance-form-error");
  if (!form || !form.checkValidity()) {
    form?.reportValidity();
    return;
  }
  const restore = setButtonLoading(buttonElement);
  const attendance = [...document.querySelectorAll("[data-attendance-id]")].map((row) => ({
    student_id: row.dataset.attendanceId,
    status: row.querySelector(".attendance-option.is-active")?.dataset.value || "present"
  }));
  try {
    const fields = Object.fromEntries(new FormData(form).entries());
    const group = (state.data.academic_structure || []).find((item) => item.id === fields.group_id);
    await platformService.saveAttendance({ group_id: fields.group_id, group_name: group?.name || "Turma", modality: group?.modality || "online", date: fields.date, attendance });
    closeOverlay();
    toast("Chamada salva com sucesso.", "A presença de " + attendance.length + " aluno" + (attendance.length === 1 ? "" : "s") + " foi registrada.");
  } catch (error) {
    if (errorBox) errorBox.textContent = error.message;
  } finally {
    restore();
  }
}

async function saveReport(buttonElement) {
  const form = document.querySelector("#report-form");
  if (!form) return;
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  const restore = setButtonLoading(buttonElement);
  const payload = Object.fromEntries(new FormData(form).entries());
  try {
    await platformService.saveReport(payload);
    toast("Relatório salvo.", "A família será notificada quando ele for publicado.");
    form.reset();
  } finally {
    restore();
  }
}

async function confirmAssignment(buttonElement) {
  const form = document.querySelector("#assign-form");
  if (!form || !form.checkValidity()) {
    if (form) form.reportValidity();
    return;
  }
  const restore = setButtonLoading(buttonElement);
  try {
    await platformService.assignProject(Object.fromEntries(new FormData(form).entries()));
    closeOverlay();
    toast("Projeto atribuído.", "Ele já aparece na trilha do aluno.");
  } finally {
    restore();
  }
}

async function startPayment(method, buttonElement) {
  const restore = setButtonLoading(buttonElement, "Preparando…");
  try {
    await platformService.startPayment(method);
    closeOverlay();
    toast("Pagamento preparado.", "Integração simulada para " + method.toUpperCase() + ".");
  } finally {
    restore();
  }
}

function showProject(projectId) {
  state.activeProjectId = projectId;
  state.pdfPage = 0;
  state.pdfZoom = 1;
  openOverlay(projectDetail(projectId, state.role === "teacher" || state.role === "admin"));
}

function updatePdf(action) {
  const viewer = document.querySelector(".pdf-viewer");
  if (!viewer) return;
  const project = projects.find((item) => item.id === viewer.dataset.projectId) || projects[0];
  let page = Number(viewer.dataset.pdfPage);
  let zoom = Number(viewer.dataset.zoom);
  if (action === "pdf-prev") page = Math.max(0, page - 1);
  if (action === "pdf-next") page = Math.min(project.materialPages.length - 1, page + 1);
  if (action === "pdf-zoom-in") zoom = Math.min(1.35, zoom + 0.1);
  if (action === "pdf-zoom-out") zoom = Math.max(0.75, zoom - 0.1);
  state.pdfPage = page;
  state.pdfZoom = Number(zoom.toFixed(2));
  replaceOverlay(pdfViewer(project.id, state.pdfPage, state.pdfZoom));
}

function showGeneric(title, kind) {
  openOverlay(genericFormModal(title, kind));
}

function handleAction(action, target) {
  switch (action) {
    case "account-login":
      handleAccountLogin(target);
      break;
    case "switch-account": {
      const signInPath = "/signin-with-chatgpt?return_to=" + encodeURIComponent("/?continue=login");
      window.location.assign("/signout-with-chatgpt?return_to=" + encodeURIComponent(signInPath));
      break;
    }
    case "toggle-public-menu": {
      const menu = document.querySelector("#public-links");
      if (menu) menu.classList.toggle("is-open");
      break;
    }
    case "scroll-section": {
      document.querySelector(target.dataset.target)?.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth" });
      document.querySelector("#public-links")?.classList.remove("is-open");
      break;
    }
    case "toggle-password": {
      const input = document.querySelector("#password");
      if (!input) break;
      input.type = input.type === "password" ? "text" : "password";
      target.setAttribute("aria-label", input.type === "password" ? "Mostrar senha" : "Ocultar senha");
      break;
    }
    case "demo-login": {
      const email = document.querySelector("#email");
      const password = document.querySelector("#password");
      if (email) email.value = target.dataset.email || "";
      if (password) password.value = target.dataset.password || "";
      document.querySelector("#login-form")?.requestSubmit();
      break;
    }
    case "forgot-password":
      recoverPassword();
      break;
    case "student-vibe":
      setStudentVibe(target.dataset.vibe || "curioso", target);
      break;
    case "student-vibe-cycle":
      cycleStudentVibe(target);
      break;
    case "shuffle-creative-prompt":
      shuffleCreativePrompt(target);
      break;
    case "toggle-sidebar": {
      state.collapsed = !state.collapsed;
      localStorage.setItem("newcode-sidebar", state.collapsed ? "collapsed" : "expanded");
      document.querySelector(".app-shell")?.classList.toggle("is-collapsed", state.collapsed);
      break;
    }
    case "toggle-mobile-menu":
      document.querySelector(".app-shell")?.classList.toggle("is-mobile-menu-open");
      break;
    case "close-mobile-menu":
      document.querySelector(".app-shell")?.classList.remove("is-mobile-menu-open");
      break;
    case "toggle-theme":
      state.theme = state.theme === "dark" ? "light" : "dark";
      localStorage.setItem("newcode-theme", state.theme);
      document.documentElement.dataset.theme = state.theme;
      renderPortalContent();
      closeOverlay(true);
      break;
    case "notifications":
      openOverlay(notificationsDrawer(), "drawer");
      break;
    case "profile-menu":
      openOverlay(profileMenu());
      break;
    case "command-palette":
      openOverlay(commandPalette(state.role));
      window.setTimeout(() => document.querySelector("#command-search")?.focus(), 60);
      break;
    case "close-overlay":
      closeOverlay();
      break;
    case "open-project":
      showProject(target.dataset.projectId || "jogo-plataforma");
      break;
    case "locked-project":
      toast("Projeto bloqueado.", "Conclua a missão atual para liberar este desafio.");
      break;
    case "open-pdf":
      state.activeProjectId = target.dataset.projectId || state.activeProjectId;
      replaceOverlay(pdfViewer(state.activeProjectId, 0, 1));
      break;
    case "pdf-prev":
    case "pdf-next":
    case "pdf-zoom-in":
    case "pdf-zoom-out":
      updatePdf(action);
      break;
    case "pdf-fullscreen": {
      const viewer = document.querySelector(".pdf-viewer");
      if (viewer?.requestFullscreen) viewer.requestFullscreen();
      break;
    }
    case "start-project":
      closeOverlay();
      toast("Projeto aberto.", "Seu progresso foi salvo automaticamente.");
      break;
    case "lesson-detail":
      openOverlay(lessonDetail());
      break;
    case "calendar-event":
      openOverlay(calendarEventDetail(target.dataset.eventId));
      break;
    case "calendar-prev":
    case "calendar-next":
      toast("Calendário de agosto", "A navegação mensal está pronta para receber eventos reais.");
      break;
    case "payment":
      openOverlay(paymentModal());
      break;
    case "payment-method":
      startPayment(target.dataset.method, target);
      break;
    case "assign-project":
      replaceOverlay(assignProjectModal(target.dataset.projectId));
      break;
    case "confirm-assign":
      confirmAssignment(target);
      break;
    case "open-class":
      openOverlay(classPanel(), "drawer");
      break;
    case "finish-class":
      replaceOverlay(finishClassModal());
      break;
    case "confirm-finish-class":
      closeOverlay();
      toast("Aula finalizada.", "Progresso e observações foram registrados.");
      break;
    case "attendance-mark": {
      const group = target.closest(".attendance-options");
      group?.querySelectorAll(".attendance-option").forEach((button) => button.classList.toggle("is-active", button === target));
      break;
    }
    case "save-attendance":
      saveAttendance(target);
      break;
    case "rating": {
      const value = Number(target.dataset.rating);
      target.closest(".rating-group")?.querySelectorAll("button").forEach((item) => item.classList.toggle("is-active", Number(item.dataset.rating) <= value));
      break;
    }
    case "save-report":
      saveReport(target);
      break;
    case "switch-child":
      break;
    case "select-child":
      state.childId = target.dataset.childId || "lucas";
      navigateToPage("progress");
      break;
    case "download-report":
      toast("Relatório preparado.", "O PDF estará disponível quando o backend de arquivos for conectado.");
      break;
    case "mark-read":
      closeOverlay();
      toast("Notificações atualizadas.", "Tudo foi marcado como lido.");
      break;
    case "new-project":
    case "new-content":
      openOverlay(contentFormModal());
      break;
    case "new-event":
      showGeneric("Novo evento", "evento");
      break;
    case "new-class":
      showGeneric("Nova aula", "aula");
      break;
    case "new-lesson":
      if ((state.data.students || []).length) openOverlay(lessonFormModal(state.data.students || []));
      else toast("Cadastre um aluno primeiro.", "Depois você poderá agendar a aula.");
      break;
    case "save-lesson":
      saveLesson(target);
      break;
    case "new-pedagogical-record":
      if ((state.data.students || []).length) openOverlay(pedagogicalFormModal(state.data.students || []));
      else toast("Cadastre um aluno primeiro.", "Depois você poderá criar o acompanhamento pedagógico.");
      break;
    case "save-pedagogical-record":
      savePedagogicalRecord(target);
      break;
    case "new-academic-item":
      openOverlay(academicItemModal(target.dataset.kind || "school", state.data.academic_structure || []));
      break;
    case "save-academic-item":
      saveAcademicItem(target);
      break;
    case "take-attendance": {
      const group = (state.data.academic_structure || []).find((item) => item.id === target.dataset.groupId);
      if (group) openOverlay(attendanceFormModal(group, state.data.students || []));
      break;
    }
    case "new-student":
      openOverlay(studentFormModal(null, state.data.academic_structure || []));
      break;
    case "edit-student-record": {
      if (!canManageRecords()) break;
      const student = (state.data.students || []).find((item) => item.id === target.dataset.studentId);
      if (student) openOverlay(studentFormModal(student, state.data.academic_structure || []));
      break;
    }
    case "delete-student": {
      if (!canManageRecords()) break;
      const student = (state.data.students || []).find((item) => item.id === target.dataset.studentId);
      if (student) openOverlay(deleteRecordModal("student", student));
      break;
    }
    case "confirm-delete-student":
      confirmDeleteStudent(target);
      break;
    case "save-student":
      saveFreshStudent(target);
      break;
    case "save-content":
      saveFreshContent(target);
      break;
    case "edit-content-record": {
      if (!canManageRecords()) break;
      const content = (state.data.contents || []).find((item) => item.id === target.dataset.contentId);
      if (content) openOverlay(contentFormModal(content));
      break;
    }
    case "delete-content": {
      if (!canManageRecords()) break;
      const content = (state.data.contents || []).find((item) => item.id === target.dataset.contentId);
      if (content) openOverlay(deleteRecordModal("content", content));
      break;
    }
    case "confirm-delete-content":
      confirmDeleteContent(target);
      break;
    case "assign-content":
      if (!(state.data.contents || []).length) {
        toast("Crie um conteúdo primeiro.", "Depois você poderá atribuí-lo ao aluno.");
        openOverlay(contentFormModal());
      } else {
        openOverlay(assignContentModal(state.data.contents || [], target.dataset.contentId || "", target.dataset.studentId || ""));
      }
      break;
    case "choose-assignment-student": {
      const hidden = document.querySelector("#assign-student-id");
      const results = document.querySelector("#assign-student-results");
      const search = document.querySelector("#assign-student-search");
      if (hidden) hidden.value = target.dataset.studentId || "";
      if (search) search.value = target.dataset.studentName || "";
      if (results) results.innerHTML = '<div class="fresh-selected-student">' + target.innerHTML + '<span class="badge badge--success">Selecionado</span></div>';
      break;
    }
    case "confirm-fresh-assignment":
      confirmFreshAssignment(target);
      break;
    case "view-student": {
      const student = (state.data.students || []).find((item) => item.id === target.dataset.studentId);
      const assignments = (state.data.assignments || []).filter((item) => item.student_id === target.dataset.studentId);
      openOverlay(studentDetailDrawer(student, assignments), "drawer");
      break;
    }
    case "open-assigned-content": {
      const content = (state.data.assigned_contents || []).find((item) => target.dataset.assignmentId ? item.assignment_id === target.dataset.assignmentId : item.id === target.dataset.contentId);
      openOverlay(assignedContentModal(content));
      break;
    }
    case "new-teacher":
      if (state.role === "admin") openOverlay(teacherFormModal());
      else toast("Ação não permitida.", "Somente a coordenação pode cadastrar professores.");
      break;
    case "edit-teacher-record": {
      if (state.role !== "admin") break;
      const teacher = (state.data.teachers || []).find((item) => item.id === target.dataset.teacherId);
      if (teacher) openOverlay(teacherFormModal(teacher));
      break;
    }
    case "delete-teacher": {
      if (state.role !== "admin") break;
      const teacher = (state.data.teachers || []).find((item) => item.id === target.dataset.teacherId);
      if (teacher) openOverlay(deleteRecordModal("teacher", teacher));
      break;
    }
    case "confirm-delete-teacher":
      confirmDeleteTeacher(target);
      break;
    case "save-teacher":
      saveFreshTeacher(target);
      break;
    case "copy-teacher-password":
      copyTeacherPassword(target);
      break;
    case "new-course":
      showGeneric("Criar curso", "curso");
      break;
    case "new-admin-report":
      showGeneric("Gerar relatório", "relatorio");
      break;
    case "edit-profile":
      openOverlay(profileFormModal(state.profile));
      break;
    case "save-profile":
      saveProfile(target);
      break;
    case "choose-profile-photo":
      document.querySelector("#profile-photo-input")?.click();
      break;
    case "remove-profile-photo":
      removeProfilePhoto(target);
      break;
    case "request-password-change":
      requestPasswordChange(target);
      break;
    case "edit-student":
      showGeneric("Editar " + (target.dataset.student || "aluno"), "aluno");
      break;
    case "edit-course":
      showGeneric("Gerenciar curso", "curso");
      break;
    case "student-detail":
      showGeneric("Perfil de " + (target.dataset.student || "aluno"), "progresso");
      break;
    case "save-generic":
      closeOverlay();
      toast("Informações recebidas.", "Esta área está pronta para ser conectada ao próximo módulo do banco.");
      break;
    case "clear-filters":
      state.projectFilter = "all";
      state.search = "";
      renderPortalContent();
      break;
    case "project-filter":
      break;
    case "export-summary":
      toast("Resumo preparado.", "A exportação será conectada ao serviço de relatórios.");
      break;
    case "next-onboarding":
      state.onboardingStep = Math.min(2, Number(target.dataset.step) + 1);
      replaceOverlay(onboarding(state.onboardingStep));
      break;
    case "finish-onboarding":
      localStorage.setItem("newcode-onboarding-seen", "true");
      closeOverlay();
      toast("Sua jornada começou!", "Abra o projeto atual para continuar.");
      break;
    case "logout":
      logoutAccount();
      break;
    default:
      if (action) toast("Ação disponível.", "Este fluxo está pronto para integração com a API.");
  }
}

document.addEventListener("click", (event) => {
  const pageTarget = event.target.closest("[data-page]");
  const actionTarget = event.target.closest("[data-action]");

  if (pageTarget) {
    const page = pageTarget.dataset.page;
    if (page) {
      const action = pageTarget.dataset.action;
      if (action === "close-overlay") closeOverlay(true);
      else if (action && action !== "close-overlay") handleAction(action, pageTarget);
      showPortalSkeleton();
      window.setTimeout(() => navigateToPage(page), reducedMotion.matches ? 0 : 120);
      return;
    }
  }

  if (actionTarget) {
    event.preventDefault();
    handleAction(actionTarget.dataset.action, actionTarget);
    return;
  }

  if (event.target.matches("[data-overlay-backdrop]")) closeOverlay();
});

document.addEventListener("submit", (event) => {
  if (event.target.id === "login-form") {
    event.preventDefault();
    handleLogin(event.target);
  }
  if (event.target.id === "signup-form") {
    event.preventDefault();
    handleSignup(event.target);
  }
});

document.addEventListener("change", (event) => {
  const target = event.target;
  if (target.id === "profile-photo-input") {
    uploadProfilePhoto(target);
    return;
  }
  if (target.matches('[data-action="switch-child"]')) {
    state.childId = target.value;
    const content = document.querySelector(".app-content");
    if (content) {
      content.style.opacity = "0";
      content.style.transform = "translateY(8px)";
    }
    window.setTimeout(renderPortalContent, reducedMotion.matches ? 0 : 180);
  }
});

document.addEventListener("input", (event) => {
  const target = event.target;

  if (target.matches('[data-action="assignment-student-search"]')) {
    window.clearTimeout(searchTimer);
    searchTimer = window.setTimeout(() => searchAssignmentStudents(target.value), 220);
  }

  if (target.matches('[data-action="student-search"]')) {
    state.studentSearch = target.value;
    window.clearTimeout(searchTimer);
    searchTimer = window.setTimeout(async () => {
      try {
        const response = await platformService.searchStudents(target.value);
        state.data.students = response.students || [];
        renderPortalContent();
        window.setTimeout(() => {
          const input = document.querySelector('[data-action="student-search"]');
          if (input) {
            input.focus();
            input.setSelectionRange(input.value.length, input.value.length);
          }
        }, 0);
      } catch (error) {
        toast("Busca indisponível.", error.message);
      }
    }, 240);
  }

  if (target.matches('[data-action="project-search"]')) {
    window.clearTimeout(searchTimer);
    searchTimer = window.setTimeout(() => {
      state.search = target.value;
      renderPortalContent();
      window.setTimeout(() => {
        const input = document.querySelector('[data-action="project-search"]');
        if (input) {
          input.focus();
          input.setSelectionRange(input.value.length, input.value.length);
        }
      }, 0);
    }, 220);
  }

  if (target.id === "command-search") {
    const value = target.value;
    window.clearTimeout(searchTimer);
    searchTimer = window.setTimeout(() => {
      replaceOverlay(commandPalette(state.role, value));
      const input = document.querySelector("#command-search");
      if (input) {
        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
      }
    }, 90);
  }

  if (target.matches('[data-action="admin-search"]')) {
    const value = target.value.toLowerCase();
    document.querySelectorAll(".data-table tbody tr").forEach((row) => {
      row.hidden = !row.textContent.toLowerCase().includes(value);
    });
  }
});

document.addEventListener("click", (event) => {
  const filter = event.target.closest('[data-action="project-filter"]');
  if (!filter) return;
  state.projectFilter = filter.dataset.filter || "all";
  renderPortalContent();
});

document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k" && state.screen === "portal") {
    event.preventDefault();
    openOverlay(commandPalette(state.role));
    return;
  }

  if (event.key === "Escape") {
    closeOverlay();
    document.querySelector(".app-shell")?.classList.remove("is-mobile-menu-open");
  }

  if ((event.key === "Enter" || event.key === " ") && event.target.matches(".project-card")) {
    event.preventDefault();
    handleAction(event.target.dataset.action, event.target);
  }
});

window.addEventListener("scroll", () => {
  const nav = document.querySelector("#public-nav");
  if (nav) nav.classList.toggle("is-scrolled", window.scrollY > 14);
}, { passive: true });

window.addEventListener("hashchange", syncRoute);
window.addEventListener("load", () => createIcons());

syncRoute();
