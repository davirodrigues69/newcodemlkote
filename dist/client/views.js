const profiles = {
  student: { name: "Aluno New Code", avatar: "AN" },
  parent: { name: "Responsável New Code", avatar: "RN" },
  teacher: { name: "Professor New Code", avatar: "PN" },
  admin: { name: "Coordenação New Code", avatar: "CN" }
};
const projects = [];
const achievements = [];
const lessons = [];
const calendarEvents = [];
const children = [];
const payments = [];
const notifications = [];
const adminStudents = [];
const demoAccounts = [];
const roleNavigation = {
  student: [
    ["home", "Início", "house"], ["trail", "Minha Trilha", "map"], ["projects", "Conteúdos", "library-big"],
    ["classes", "Aulas", "monitor-play"], ["calendar", "Calendário", "calendar-days"],
    ["pedagogical", "Pedagógico", "notebook-tabs"], ["achievements", "Conquistas", "trophy"], ["profile", "Meu Perfil", "user-round"]
  ],
  parent: [
    ["home", "Início", "house"], ["children", "Meus Filhos", "users-round"], ["activities", "Atividades", "clipboard-list"],
    ["classes", "Aulas", "monitor-play"], ["calendar", "Calendário", "calendar-days"],
    ["pedagogical", "Pedagógico", "notebook-tabs"], ["profile", "Perfil", "user-round"]
  ],
  teacher: [
    ["home", "Início", "house"], ["classes", "Minhas Aulas", "monitor-play"], ["students", "Alunos", "users-round"],
    ["attendance", "Chamada", "list-checks"], ["calendar", "Calendário", "calendar-days"],
    ["projects", "Atividades", "library-big"], ["pedagogical", "Pedagógico", "clipboard-pen-line"], ["profile", "Perfil", "user-round"]
  ],
  admin: [
    ["home", "Dashboard", "layout-dashboard"], ["students", "Alunos", "users-round"], ["teachers", "Professores", "graduation-cap"],
    ["classes", "Aulas", "monitor-play"], ["projects", "Atividades", "folder-kanban"], ["attendance", "Estrutura e chamada", "list-checks"],
    ["calendar", "Calendário", "calendar-days"], ["finance", "Financeiro", "wallet-cards"],
    ["pedagogical", "Pedagógico", "notebook-tabs"], ["settings", "Configurações", "settings-2"]
  ]
};
import {
  renderFreshLanding,
  renderFreshLogin,
  renderFreshSignup,
  renderFreshPage,
  studentCreativePrompts,
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
  attendanceFormModal
} from "./freshViews.js";

const roleLabels = {
  student: "Aluno",
  parent: "Responsável",
  teacher: "Professor",
  admin: "Administração"
};

const roleRoots = {
  student: "aluno",
  parent: "pais",
  teacher: "professor",
  admin: "admin"
};

const pageTitles = {
  home: "Início",
  trail: "Minha Trilha",
  projects: "Conteúdos",
  classes: "Aulas",
  calendar: "Calendário",
  activities: "Atividades",
  pedagogical: "Pedagógico",
  achievements: "Conquistas",
  profile: "Perfil",
  children: "Meus Filhos",
  progress: "Progresso",
  finance: "Financeiro",
  reports: "Relatórios",
  students: "Alunos",
  attendance: "Chamada",
  teachers: "Professores",
  courses: "Cursos",
  settings: "Configurações"
};

export const icon = (name) => '<i data-lucide="' + name + '" aria-hidden="true"></i>';

export function brand(showTagline = true) {
  return '<span class="brand">' +
    '<span class="brand-mark" aria-hidden="true"><span class="brand-logo"></span></span>' +
    '<span class="brand-copy"><strong>NEW CODE</strong>' +
    (showTagline ? '<small>Aprenda. Crie. Evolua.</small>' : '') +
    '</span></span>';
}

function button(label, iconName, variant = "primary", attrs = "") {
  let classes = "button button--" + variant;
  const classMatch = attrs.match(/class="([^"]*)"/);
  if (classMatch) {
    classes = classMatch[1];
    attrs = attrs.replace(classMatch[0], "");
  }
  return '<button class="' + classes + '" type="button" ' + attrs + '>' +
    label + (iconName ? icon(iconName) : '') + '</button>';
}

function statusBadge(status) {
  const map = {
    current: ["Em andamento", "info"],
    completed: ["Concluído", "success"],
    available: ["Disponível", "warning"],
    locked: ["Bloqueado", "neutral"],
    finished: ["Finalizada", "success"],
    next: ["Próxima", "info"],
    scheduled: ["Agendada", "neutral"],
    cancelled: ["Cancelada", "danger"],
    paid: ["Pago", "success"],
    pending: ["Pendente", "warning"],
    overdue: ["Vencido", "danger"],
    processing: ["Processando", "info"],
    active: ["Ativo", "success"]
  };
  const item = map[status] || [status, "neutral"];
  return '<span class="badge badge--' + item[1] + '">' + item[0] + '</span>';
}

function initials(name) {
  return name.split(" ").slice(0, 2).map((part) => part[0]).join("");
}

function pageHeading(title, subtitle, actionHtml = "") {
  return '<header class="page-heading">' +
    '<div><h1>' + title + '</h1><p>' + subtitle + '</p></div>' +
    (actionHtml ? '<div class="page-actions">' + actionHtml + '</div>' : '') +
    '</header>';
}

function statCard(label, value, iconName, trend = "", extraClass = "") {
  return '<article class="card stat-card ' + extraClass + '">' +
    '<div class="stat-card__top"><span class="stat-card__icon">' + icon(iconName) + '</span>' +
    (trend ? '<span class="stat-card__trend">' + trend + '</span>' : '') + '</div>' +
    '<strong>' + value + '</strong><p>' + label + '</p></article>';
}

function emptyState(title, body, action = "Explorar projetos") {
  return '<section class="card empty-state"><span class="empty-state__icon">' + icon("package-open") + '</span>' +
    '<h2>' + title + '</h2><p>' + body + '</p>' +
    button(action, "arrow-right", "primary", 'data-page="projects"') + '</section>';
}

function projectCard(project, teacherMode = false) {
  const action = project.status === "locked" ? "locked-project" : "open-project";
  return '<article class="card card--interactive project-card ' + (project.status === "locked" ? "is-locked" : "") + '" ' +
    'data-color="' + project.color + '" data-action="' + action + '" data-project-id="' + project.id + '" tabindex="' + (project.status === "locked" ? "-1" : "0") + '">' +
    '<div class="project-card__visual">' + icon(project.status === "locked" ? "lock-keyhole" : project.icon) + '</div>' +
    '<div class="project-card__body"><div class="project-card__top">' + statusBadge(project.status) +
    '<span class="badge">+' + project.xp + ' XP</span></div>' +
    '<h3>' + project.title + '</h3><p>' + project.description + '</p>' +
    '<div class="project-meta"><span>' + icon("cpu") + project.technology + '</span><span>' + icon("clock-3") + project.duration + '</span></div>' +
    (project.progress > 0 ? '<div class="progress-line"><span style="width:' + project.progress + '%"></span></div>' : '') +
    '<div class="project-card__footer"><span>' + project.difficulty + '</span><span>' + (teacherMode ? "Ver e atribuir" : project.progress > 0 && project.progress < 100 ? project.progress + "% concluído" : "Ver projeto") + '</span></div>' +
    '</div></article>';
}

function studentMission() {
  return '<article class="card mission-card span-8">' +
    '<div class="mission-card__content"><p class="eyebrow">Continue sua jornada</p>' +
    '<h2>Jogo de Plataforma</h2><p>Seu mundo está ganhando vida. Agora é hora de programar os inimigos e testar a fase.</p>' +
    '<div class="mission-card__meta"><span>Construct 3</span><span>+300 XP</span><span>45 min</span></div>' +
    '<div class="progress-line"><span style="width:65%"></span></div>' +
    '<p><strong>65%</strong> concluído</p>' +
    button("Continuar projeto", "arrow-right", "dark", 'data-action="open-project" data-project-id="jogo-plataforma"') +
    '</div><div class="mission-art" aria-hidden="true"><div class="mission-art__planet">' + icon("gamepad-2") + '</div></div></article>';
}

function renderLegacyLanding() {
  return '<div class="public-page">' +
    '<header class="public-nav" id="public-nav"><div class="public-nav__inner">' +
    '<a href="#/" aria-label="New Code, início">' + brand(true) + '</a>' +
    '<nav class="public-links" id="public-links" aria-label="Navegação principal">' +
    '<a href="#como-funciona">Como funciona</a><a href="#cursos">Cursos</a><a href="#metodologia">Metodologia</a><a href="#para-pais">Para pais</a></nav>' +
    '<div class="public-actions">' +
    '<a class="button button--ghost" href="#/login">Área do aluno</a>' +
    '<a class="button button--primary" href="#cursos">Conheça os cursos ' + icon("arrow-down") + '</a>' +
    '<button class="icon-button mobile-menu-button" type="button" data-action="toggle-public-menu" aria-label="Abrir menu">' + icon("menu") + '</button>' +
    '</div></div></header>' +
    '<main id="app-main">' +
    '<section class="marketing-hero"><div class="marketing-shell marketing-hero__grid">' +
    '<div class="marketing-hero__copy reveal"><p class="eyebrow">Tecnologia para a próxima geração</p>' +
    '<h1>Programação para quem vai criar o <span>futuro.</span></h1>' +
    '<p>Aprenda programação criando jogos, projetos e experiências digitais com professores que transformam curiosidade em habilidade.</p>' +
    '<div class="hero-buttons"><a class="button button--primary" href="#cursos">Conheça nossos cursos ' + icon("arrow-right") + '</a>' +
    '<a class="button button--ghost" href="#/login">Entrar na plataforma ' + icon("log-in") + '</a></div>' +
    '<div class="hero-proof"><span class="avatar-pile"><span>LM</span><span>MA</span><span>JP</span><span>+</span></span>' +
    '<span>Projetos reais para alunos de 5 a 17 anos</span></div></div>' +
    '<div class="hero-stage reveal" id="hero-stage" aria-label="Robô da New Code explorando um mundo de programação">' +
    '<div class="hero-orbit"></div><div class="hero-platform"></div>' +
    '<div class="robot"><span class="robot__antenna"></span><div class="robot__head"><div class="robot__face"><span class="robot__eye"></span><span class="robot__eye"></span></div></div><div class="robot__body"></div></div>' +
    '<div class="hero-chip hero-chip--one">' + icon("code-2") + '<span>Lógica + criatividade</span></div>' +
    '<div class="hero-chip hero-chip--two">' + icon("gamepad-2") + '<span>Projetos jogáveis</span></div>' +
    '<div class="hero-chip hero-chip--three">' + icon("trophy") + '<span>Aprenda no seu ritmo</span></div>' +
    '</div></div></section>' +
    '<section class="marketing-section" id="como-funciona"><div class="marketing-shell">' +
    '<div class="marketing-heading reveal"><p class="eyebrow">Como funciona</p><h2>Menos teoria solta. Mais ideias virando realidade.</h2><p>Cada aula termina com algo novo criado pelo aluno e um próximo desafio claro.</p></div>' +
    '<div class="feature-row">' +
    marketingCard("mouse-pointer-2", "Aprenda fazendo", "Conceitos de tecnologia aparecem dentro de missões práticas e divertidas.") +
    marketingCard("blocks", "Crie do seu jeito", "Jogos, robôs e experiências digitais que ganham a personalidade de cada aluno.") +
    marketingCard("chart-no-axes-combined", "Evolua sempre", "Trilhas, feedbacks e conquistas mostram de forma clara o que já foi aprendido.") +
    '</div></div></section>' +
    '<section class="marketing-section marketing-section--tint" id="cursos"><div class="marketing-shell">' +
    '<div class="marketing-heading marketing-heading--center reveal"><p class="eyebrow">Cursos</p><h2>Uma trilha para cada fase da jornada.</h2><p>Experiências que crescem junto com o aluno, do primeiro bloco ao primeiro código.</p></div>' +
    '<div class="course-row">' +
    courseMarketingCard("&lt;•&gt;", "Primeiros Criadores", "5 a 8 anos", "Scratch Jr, lógica, histórias e robótica criativa.") +
    courseMarketingCard("{ }", "Inventores de Jogos", "9 a 13 anos", "Scratch, Construct 3, Minecraft e projetos interativos.") +
    courseMarketingCard("Py", "Tech Builders", "14 a 17 anos", "Python, Unity, desenvolvimento web e projetos de portfólio.") +
    '</div></div></section>' +
    '<section class="marketing-section" id="metodologia"><div class="marketing-shell">' +
    '<div class="marketing-heading reveal"><p class="eyebrow">Metodologia New Code</p><h2>Aprender → criar → concluir → evoluir.</h2></div>' +
    '<div class="journey-line reveal">' +
    journeyStep("01", "Aprender", "Descubra um conceito novo em uma experiência guiada.") +
    journeyStep("02", "Criar", "Use a ideia para construir algo que realmente funciona.") +
    journeyStep("03", "Concluir", "Teste, melhore e compartilhe o resultado do projeto.") +
    journeyStep("04", "Evoluir", "Ganhe confiança e desbloqueie desafios mais avançados.") +
    '</div></div></section>' +
    '<section class="marketing-section marketing-section--tint" id="para-pais"><div class="marketing-shell">' +
    '<div class="parent-cta reveal"><div><p class="eyebrow">Para famílias</p><h2>A evolução do seu filho, sem ficar no escuro.</h2>' +
    '<p>Acompanhe frequência, projetos, relatórios pedagógicos, calendário e pagamentos em um só lugar.</p>' +
    '<a class="button button--dark" href="#/login">Conhecer o portal dos pais ' + icon("arrow-right") + '</a></div>' +
    '<div class="parent-stats"><div><strong>92%</strong><span>frequência</span></div><div><strong>18</strong><span>projetos concluídos</span></div><div><strong>4.8</strong><span>criatividade</span></div><div><strong>76%</strong><span>trilha completa</span></div></div>' +
    '</div></div></section>' +
    '</main>' +
    '<footer class="public-footer"><div class="marketing-shell"><div class="public-footer__grid"><div>' + brand(true) +
    '<p>Programação, criatividade e tecnologia para quem vai construir o próximo mundo.</p></div>' +
    '<div><h3>Explorar</h3><a href="#como-funciona">Como funciona</a><a href="#cursos">Cursos</a><a href="#metodologia">Metodologia</a></div>' +
    '<div><h3>Plataforma</h3><a href="#/login">Área do aluno</a><a href="#/login">Portal dos pais</a><a href="#/login">Portal do professor</a></div></div>' +
    '<div class="footer-bottom">© 2026 New Code. Feito para aprender, criar e evoluir.</div></div></footer></div>';
}

function marketingCard(iconName, title, text) {
  return '<article class="marketing-card reveal"><span class="marketing-card__icon">' + icon(iconName) + '</span><h3>' + title + '</h3><p>' + text + '</p></article>';
}

function courseMarketingCard(code, title, age, text) {
  return '<article class="marketing-card course-card reveal"><span class="course-card__code">' + code + '</span><span class="age-pill">' + age + '</span><h3>' + title + '</h3><p>' + text + '</p></article>';
}

function journeyStep(number, title, text) {
  return '<article class="journey-step"><span>' + number + '</span><h3>' + title + '</h3><p>' + text + '</p></article>';
}

function renderLegacyLogin() {
  const accountButtons = demoAccounts.map((account) =>
    '<button class="demo-account" type="button" data-action="demo-login" data-email="' + account.email + '" data-password="' + account.password + '">' +
    icon(account.icon) + account.label + '</button>'
  ).join("");

  return '<main class="login-page" id="app-main"><section class="login-panel"><div class="login-box">' +
    '<a href="#/" aria-label="Voltar para a página inicial">' + brand(true) + '</a>' +
    '<h1>Que bom ter você aqui.</h1><p>Entre para continuar sua jornada na New Code.</p>' +
    '<form id="login-form" novalidate><div class="field"><label for="email">E-mail</label><input id="email" name="email" type="email" autocomplete="email" placeholder="voce@newcode.com" required></div>' +
    '<div class="field field-password"><label for="password">Senha</label><input id="password" name="password" type="password" autocomplete="current-password" placeholder="••••••••" minlength="6" required>' +
    '<button type="button" data-action="toggle-password" aria-label="Mostrar senha">' + icon("eye") + '</button></div>' +
    '<div class="login-error" id="login-error" role="alert"></div>' +
    button("Entrar", "arrow-right", "primary", 'class="button button--primary button--wide" id="login-submit"') +
    '<button class="login-secondary" type="button" data-action="forgot-password">Esqueci minha senha</button></form>' +
    '<div class="demo-title">Acesso rápido de demonstração</div><div class="demo-accounts">' + accountButtons + '</div></div></section>' +
    '<section class="login-visual" aria-hidden="true"><div class="login-visual__content"><p class="eyebrow">Sua próxima criação começa aqui</p>' +
    '<h2>Aprenda. Crie. Evolua.</h2><p>Uma plataforma feita para transformar curiosidade em projetos que você pode jogar, mostrar e se orgulhar.</p>' +
    '<div class="login-map"><span class="map-node">' + icon("code-2") + '</span><span class="map-node">' + icon("gamepad-2") + '</span><span class="map-node">' + icon("trophy") + '</span></div>' +
    '</div></section></main>';
}

export function renderShell(state) {
  const baseProfile = profiles[state.role];
  const accountProfile = state.profile || {};
  const profile = {
    ...baseProfile,
    ...accountProfile,
    name: ((accountProfile.first_name || "") + " " + (accountProfile.last_name || "")).trim() || baseProfile.name,
    avatar: accountProfile.first_name ? initials(((accountProfile.first_name || "") + " " + (accountProfile.last_name || "")).trim()) : baseProfile.avatar
  };
  const avatarMarkup = '<span class="avatar avatar--purple">' + profile.avatar + (profile.photo_url ? '<img src="' + escapeHtml(profile.photo_url) + '" alt="">' : "") + '</span>';
  const nav = roleNavigation[state.role];
  const navHtml = nav.map((item) =>
    '<button class="sidebar-link ' + (state.page === item[0] ? "is-active" : "") + '" type="button" data-page="' + item[0] + '" title="' + item[1] + '">' +
    icon(item[2]) + '<span>' + item[1] + '</span></button>'
  ).join("");
  const mobileItems = nav.slice(0, 5).map((item) =>
    '<button class="' + (state.page === item[0] ? "is-active" : "") + '" type="button" data-page="' + item[0] + '">' +
    icon(item[2]) + '<span>' + item[1].replace("Minha ", "").replace("Meus ", "") + '</span></button>'
  ).join("");
  const studentVibeLabel = { curioso: "CURIOSO", focado: "FOCADO", ideias: "IDEIAS A MIL" }[state.studentVibe] || "CURIOSO";
  const studentVibeButton = state.role === "student"
    ? '<button class="student-top-vibe" type="button" data-action="student-vibe-cycle" aria-label="Trocar vibe criativa">' + icon("sparkles") + '<span class="student-top-vibe__label">VIBE: ' + studentVibeLabel + '</span></button>'
    : "";

  return '<div class="app-shell ' + (state.collapsed ? "is-collapsed" : "") + '" data-role="' + state.role + '">' +
    '<div class="mobile-sidebar-scrim" data-action="close-mobile-menu"></div>' +
    '<aside class="sidebar"><div class="sidebar__brand"><a href="#/" aria-label="New Code">' + brand(true) + '</a>' +
    '<button class="sidebar-toggle" type="button" data-action="toggle-sidebar" aria-label="Recolher menu">' + icon("panel-left-close") + '</button></div>' +
    '<nav class="sidebar-nav" aria-label="Menu ' + roleLabels[state.role] + '">' + navHtml + '</nav><div class="sidebar-spacer"></div>' +
    '<div class="sidebar__profile">' + avatarMarkup + '<span class="sidebar__profile-copy"><strong>' + profile.name + '</strong><small>' + roleLabels[state.role] + '</small></span></div></aside>' +
    '<div class="app-area"><header class="topbar"><button class="icon-button mobile-menu" type="button" data-action="toggle-mobile-menu" aria-label="Abrir menu">' + icon("menu") + '</button>' +
    '<div class="breadcrumb">New Code <span> / </span> <strong>' + pageTitles[state.page] + '</strong></div>' +
    '<div class="topbar-actions">' + studentVibeButton + '<button class="global-search" type="button" data-action="command-palette">' + icon("search") + '<span>Buscar ' + searchLabel(state.role) + '</span><kbd>Ctrl K</kbd></button>' +
    '<button class="icon-button theme-button" type="button" data-action="toggle-theme" aria-label="Alternar tema">' + icon(state.theme === "dark" ? "sun" : "moon") + '</button>' +
    '<button class="icon-button notification-button" type="button" data-action="notifications" aria-label="Abrir notificações">' + icon("bell") + '</button>' +
    '<button class="icon-button avatar-button" type="button" data-action="profile-menu" aria-label="Abrir menu do perfil">' + avatarMarkup + icon("chevron-down") + '</button></div></header>' +
    '<main class="app-content page-enter" id="app-main">' + renderRolePage(state) + '</main></div>' +
    '<nav class="bottom-nav" aria-label="Navegação mobile">' + mobileItems + '</nav></div>';
}

function searchLabel(role) {
  if (role === "teacher") return "uma área";
  if (role === "admin") return "uma área";
  if (role === "parent") return "aulas ou relatórios";
  return "projetos";
}

export function renderSkeleton() {
  return '<div class="skeleton-grid"><div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div></div>';
}

function renderRolePage(state) {
  return renderFreshPage(state);
}

function studentPage(state) {
  const pages = {
    home: studentHome,
    trail: trailPage,
    projects: () => projectsPage(false, state.projectFilter, state.search),
    classes: () => studentClasses(),
    calendar: () => calendarPage("student"),
    achievements: achievementsPage,
    profile: () => profilePage(profiles.student, "Aluno • Construct 3")
  };
  return (pages[state.page] || studentHome)();
}

function studentHome() {
  return pageHeading("Olá, Lucas! 👋", "Pronto para transformar mais uma ideia em código?") +
    '<section class="dashboard-grid">' + studentMission() +
    '<article class="card card--pad span-4"><div class="card-label"><h3>Próxima aula</h3><button class="text-button" data-page="classes">Ver agenda</button></div>' +
    '<div class="next-class"><div class="next-class__date"><span class="date-box"><strong>13</strong><small>AGO</small></span><div><h4>Construct 3</h4><p>Quinta-feira • 18:10</p></div></div>' +
    '<p>Com Rafael Costa • Inimigos inteligentes</p>' + button("Ver aula", "arrow-right", "soft", 'data-action="lesson-detail"') + '</div></article>' +
    '<article class="card card--pad span-4"><div class="card-label"><h3>Seu progresso</h3><button class="text-button" data-page="trail">Ver trilha</button></div>' +
    '<div class="progress-card__body"><div class="ring" style="--value:65"><strong>65%</strong></div><div class="progress-card__copy"><strong>12 de 36</strong><span>projetos concluídos</span></div></div></article>' +
    '<article class="card card--pad xp-card span-4"><div class="card-label"><h3>Nível 7</h3><button class="text-button" data-page="achievements">Conquistas</button></div>' +
    '<div class="xp-row"><div><strong>1.450</strong><p>de 2.000 XP</p></div><span class="xp-orb">' + icon("sparkles") + '</span></div></article>' +
    '<article class="card card--pad span-4"><div class="card-label"><h3>Conquistas recentes</h3><button class="text-button" data-page="achievements">Ver todas</button></div>' +
    '<div class="achievement-row"><span class="achievement-mini" title="Primeiro Código">' + icon("code-2") + '</span><span class="achievement-mini" title="Primeiro Jogo">' + icon("gamepad-2") + '</span><span class="achievement-mini" title="Sequência de 4 aulas">' + icon("flame") + '</span></div></article>' +
    '</section>';
}

function trailPage() {
  const islands = [
    { world: "Ilha 1", title: "Fundamentos", text: "Eventos, movimentos e as primeiras regras.", icon: "code-2", status: "completed", xp: 180 },
    { world: "Ilha 2", title: "Lógica em Ação", text: "Decisões que dão vida ao seu projeto.", icon: "brain-circuit", status: "completed", xp: 220 },
    { world: "Ilha 3", title: "Criação de Jogos", text: "Construa fases, desafios e recompensas.", icon: "gamepad-2", status: "current", xp: 300 },
    { world: "Ilha 4", title: "Sistemas de Pontos", text: "Moedas, placares e feedback para o jogador.", icon: "coins", status: "available", xp: 240 },
    { world: "Ilha 5", title: "Desafios Finais", text: "Inimigos, vidas e publicação do seu jogo.", icon: "rocket", status: "locked", xp: 420 }
  ];
  const nodes = islands.map((item) =>
    '<article class="trail-island reveal"><div class="trail-island__label"><small>' + item.world + '</small><h3>' + item.title + '</h3><p>' + item.text + '</p></div>' +
    '<button class="trail-node is-' + item.status + '" type="button" data-action="' + (item.status === "locked" ? "locked-project" : "open-project") + '" data-project-id="' + (item.status === "current" ? "jogo-plataforma" : "movimento-personagem") + '" aria-label="Abrir ' + item.title + '">' +
    icon(item.status === "completed" ? "check" : item.status === "locked" ? "lock-keyhole" : item.icon) + '<span class="trail-node__xp">+' + item.xp + ' XP</span></button></article>'
  ).join("");
  return pageHeading("Sua trilha de aprendizagem", "Cada projeto concluído desbloqueia uma nova parte do seu mapa.", button("Ver projetos", "folder-kanban", "ghost", 'data-page="projects"')) +
    '<section class="trail-world"><div class="trail-track">' + nodes + '</div></section>';
}

function projectsPage(teacherMode, filter = "all", search = "") {
  let filtered = projects;
  if (filter !== "all") filtered = projects.filter((project) => project.status === filter || (filter === "progress" && project.progress > 0 && project.progress < 100));
  if (search) filtered = filtered.filter((project) => (project.title + project.technology).toLowerCase().includes(search.toLowerCase()));
  const cards = filtered.map((project) => projectCard(project, teacherMode)).join("");
  return pageHeading(teacherMode ? "Biblioteca de projetos" : "Projetos", teacherMode ? "Encontre, visualize e atribua desafios para seus alunos." : "Escolha seu próximo desafio e continue evoluindo.", teacherMode ? button("Novo projeto", "plus", "primary", 'data-action="new-project"') : "") +
    '<div class="filter-bar"><div class="filter-tabs" role="tablist">' +
    filterButton("all", "Todos", filter) + filterButton("progress", "Em andamento", filter) + filterButton("completed", "Concluídos", filter) + filterButton("available", "Disponíveis", filter) +
    '</div><label class="search-box">' + icon("search") + '<input type="search" data-action="project-search" value="' + escapeHtml(search) + '" placeholder="Pesquisar projeto…" aria-label="Pesquisar projeto"></label></div>' +
    (cards ? '<section class="project-grid">' + cards + '</section>' : emptyState("Nenhum projeto encontrado", "Tente remover os filtros ou pesquisar por outra tecnologia.").replace('data-page="projects"', 'data-action="clear-filters"'));
}

function filterButton(value, label, active) {
  return '<button class="filter-tab ' + (value === active ? "is-active" : "") + '" type="button" data-action="project-filter" data-filter="' + value + '">' + label + '</button>';
}

function studentClasses() {
  return pageHeading("Minhas aulas", "Veja seus próximos encontros e relembre o que você já construiu.") +
    '<section class="dashboard-grid"><article class="card card--pad span-5"><div class="card-label"><h3>Próxima aula</h3>' + statusBadge("next") + '</div>' +
    '<div class="next-class"><div class="next-class__date"><span class="date-box"><strong>13</strong><small>AGO</small></span><div><h4>Construct 3</h4><p>Quinta-feira • 18:10</p></div></div>' +
    '<p>Professor Rafael • Inimigos inteligentes</p>' + button("Abrir detalhes", "arrow-right", "primary", 'data-action="lesson-detail"') + '</div></article>' +
    '<article class="card card--pad span-7"><div class="card-label"><h3>Histórico recente</h3><span class="badge badge--success">92% frequência</span></div>' +
    '<div class="timeline"><div class="timeline-item"><h4>03/08 • Projeto de Plataforma</h4><p>Movimentos e colisões concluídos.</p></div>' +
    '<div class="timeline-item"><h4>27/07 • Movimentação</h4><p>Eventos de teclado concluídos.</p></div>' +
    '<div class="timeline-item"><h4>20/07 • Introdução a eventos</h4><p>Primeiro protótipo publicado.</p></div></div></article></section>';
}

function achievementsPage() {
  const items = achievements.map((item) =>
    '<article class="card achievement-card ' + (item.earned ? "is-earned" : "") + '"><span class="achievement-emblem">' + icon(item.earned ? item.icon : "lock-keyhole") + '</span><div><h3>' + item.title + '</h3><p>' + item.description + '</p></div></article>'
  ).join("");
  return pageHeading("Conquistas", "Cada badge conta uma parte da história que você está construindo.") +
    '<section class="dashboard-grid"><article class="card card--pad xp-card span-12"><div class="xp-row"><div><p>Nível 7</p><strong>1.450 XP</strong><p>Faltam 550 XP para o próximo nível.</p></div><span class="xp-orb">' + icon("trophy") + '</span></div><div class="progress-line"><span style="width:72.5%"></span></div></article></section>' +
    '<div style="height:18px"></div><section class="achievement-grid">' + items + '</section>';
}

function calendarPage(role) {
  const days = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"].map((day) => '<div class="calendar-day-name">' + day + '</div>').join("");
  let cells = "";
  for (let prev = 27; prev <= 31; prev += 1) {
    cells += '<div class="calendar-cell is-muted"><span class="calendar-cell__date">' + prev + '</span></div>';
  }
  for (let day = 1; day <= 31; day += 1) {
    const events = calendarEvents.filter((event) => event.day === day);
    const eventHtml = events.map((event) => '<button class="calendar-event" type="button" data-action="calendar-event" data-event-id="' + event.id + '" data-type="' + event.type + '">' + event.time + ' ' + event.title + '</button>').join("");
    cells += '<div class="calendar-cell ' + (day === 10 ? "is-today" : "") + '"><span class="calendar-cell__date">' + day + '</span>' + eventHtml + '</div>';
  }
  const actions = role === "teacher" || role === "admin" ? button("Novo evento", "plus", "primary", 'data-action="new-event"') : "";
  return pageHeading("Calendário", role === "teacher" ? "Organize aulas, reposições, reuniões e eventos." : "Aulas, projetos e eventos em um só lugar.", actions) +
    '<section class="card calendar-card"><div class="calendar-toolbar"><div class="calendar-toolbar__month">' +
    '<button class="icon-button" type="button" data-action="calendar-prev" aria-label="Mês anterior">' + icon("chevron-left") + '</button><h3>Agosto 2026</h3><button class="icon-button" type="button" data-action="calendar-next" aria-label="Próximo mês">' + icon("chevron-right") + '</button></div>' +
    '<div class="calendar-legend"><span><i class="legend-dot"></i>Aula</span><span><i class="legend-dot project"></i>Projeto</span><span><i class="legend-dot event"></i>Evento</span><span><i class="legend-dot holiday"></i>Feriado</span></div></div>' +
    '<div class="calendar-scroll"><div class="calendar-grid">' + days + cells + '</div></div></section>';
}

function profilePage(profile, subtitle) {
  return pageHeading("Meu perfil", "Gerencie suas informações e preferências da plataforma.") +
    '<section class="section-stack"><article class="card profile-banner"><span class="profile-avatar">' + profile.avatar + '</span><div><h2>' + profile.name + '</h2><p>' + subtitle + '</p></div>' +
    '<div style="margin-left:auto">' + button("Editar perfil", "pencil", "ghost", 'data-action="edit-profile"') + '</div></article>' +
    '<article class="card settings-list"><div class="setting-row"><div><strong>Notificações de aula</strong><p>Receber lembretes antes de cada encontro.</p></div><button class="switch is-on" type="button" data-action="toggle-switch" aria-label="Ativar notificações"></button></div>' +
    '<div class="setting-row"><div><strong>Resumo semanal</strong><p>Uma visão rápida do que aconteceu na sua semana.</p></div><button class="switch is-on" type="button" data-action="toggle-switch" aria-label="Ativar resumo semanal"></button></div>' +
    '<div class="setting-row"><div><strong>Reduzir animações</strong><p>Deixar transições e efeitos visuais mais discretos.</p></div><button class="switch" type="button" data-action="toggle-switch" aria-label="Reduzir animações"></button></div>' +
    '<div class="setting-row"><div><strong>Sair da conta</strong><p>Encerrar sua sessão neste dispositivo.</p></div>' + button("Sair", "log-out", "danger", 'data-action="logout"') + '</div></article></section>';
}

function parentPage(state) {
  const child = children.find((item) => item.id === state.childId) || children[0];
  const pages = {
    home: () => parentHome(child),
    children: parentChildren,
    progress: () => parentProgress(child),
    classes: () => parentClasses(child),
    calendar: () => calendarPage("parent"),
    finance: financePage,
    reports: () => parentReports(child),
    profile: () => profilePage(profiles.parent, "Responsável • 2 alunos vinculados")
  };
  return (pages[state.page] || (() => parentHome(child)))();
}

function childSwitcher(child) {
  return '<div class="child-switcher"><label for="child-select">Acompanhando</label><select id="child-select" data-action="switch-child">' +
    children.map((item) => '<option value="' + item.id + '" ' + (item.id === child.id ? "selected" : "") + '>' + item.name + '</option>').join("") +
    '</select></div>';
}

function parentHome(child) {
  return pageHeading("Boa tarde, Willian.", "Aqui está o resumo mais importante da jornada de " + child.name.split(" ")[0] + ".", childSwitcher(child)) +
    '<section class="dashboard-grid">' +
    '<article class="card mission-card span-8"><div class="mission-card__content"><p class="eyebrow">Destaque do mês</p><h2>' + child.name.split(" ")[0] + ' está evoluindo muito bem.</h2><p>' + child.monthlyReport + '</p>' +
    button("Ver progresso completo", "arrow-right", "dark", 'data-page="progress"') + '</div><div class="mission-art"><div class="mission-art__planet">' + icon("chart-no-axes-combined") + '</div></div></article>' +
    '<article class="card card--pad span-4"><div class="card-label"><h3>Próxima aula</h3>' + statusBadge("next") + '</div><div class="next-class"><div class="next-class__date"><span class="date-box"><strong>13</strong><small>AGO</small></span><div><h4>' + child.course + '</h4><p>' + child.nextLesson + '</p></div></div><p>Com ' + child.teacher + '</p>' + button("Ver detalhes", "arrow-right", "soft", 'data-action="lesson-detail"') + '</div></article>' +
    statCard("Progresso geral", child.progress + "%", "chart-no-axes-combined", "+8% no mês", "span-3") +
    statCard("Frequência", child.attendance + "%", "calendar-check-2", "Ótimo", "span-3") +
    statCard("Projetos concluídos", String(child.completed), "folder-check", "+3 no mês", "span-3") +
    statCard("Próximo pagamento", "R$ 277", "wallet-cards", "10/09", "span-3") +
    '</section>';
}

function parentChildren() {
  const cards = children.map((child) =>
    '<article class="card card--pad card--interactive"><div class="profile-banner" style="padding:0"><span class="profile-avatar" style="width:64px;height:64px;border-radius:20px">' + child.avatar + '</span><div><h3>' + child.name + '</h3><p>' + child.age + ' anos • ' + child.course + '</p></div></div>' +
    '<div style="height:18px"></div><div class="progress-line"><span style="width:' + child.progress + '%"></span></div><p style="color:var(--muted);font-size:.8rem;margin:8px 0 18px">' + child.progress + '% da trilha concluída</p>' +
    button("Acompanhar", "arrow-right", "ghost", 'data-action="select-child" data-child-id="' + child.id + '"') + '</article>'
  ).join("");
  return pageHeading("Meus filhos", "Alterne entre os perfis para acompanhar cada jornada de perto.") + '<section class="project-grid">' + cards + '</section>';
}

function parentProgress(child) {
  return pageHeading("Progresso de " + child.name.split(" ")[0], "Uma visão clara do que já foi construído e do próximo passo.", childSwitcher(child)) +
    '<section class="dashboard-grid">' +
    '<article class="card card--pad span-4"><div class="card-label"><h3>Progresso geral</h3></div><div class="progress-card__body"><div class="ring" style="--value:' + child.progress + '"><strong>' + child.progress + '%</strong></div><div class="progress-card__copy"><strong>' + child.completed + ' concluídos</strong><span>' + child.inProgress + ' em andamento</span></div></div></article>' +
    statCard("Frequência", child.attendance + "%", "calendar-check-2", "Acima da média", "span-4") +
    '<article class="card card--pad span-4"><div class="card-label"><h3>Curso atual</h3></div><h2>' + child.course + '</h2><p style="color:var(--muted)">Professor ' + child.teacher + '</p></article>' +
    '<article class="card card--pad span-7"><div class="card-label"><h3>Linha do tempo</h3><span class="badge badge--info">Trilha ativa</span></div><div class="timeline">' +
    '<div class="timeline-item"><h4>Introdução ao Construct</h4><p>Concluído • 15/07</p></div><div class="timeline-item"><h4>Movimento do Personagem</h4><p>Concluído • 27/07</p></div><div class="timeline-item"><h4>Eventos e colisões</h4><p>Concluído • 03/08</p></div><div class="timeline-item is-current"><h4>Jogo de Plataforma</h4><p>Em andamento • 65%</p></div><div class="timeline-item is-locked"><h4>Sistema de Pontos</h4><p>Próximo projeto</p></div></div></article>' +
    '<article class="card report-card span-5"><div class="card-label"><h3>Relatório de agosto</h3><span class="badge badge--success">Publicado</span></div><p class="report-summary">' + child.monthlyReport + '</p>' +
    button("Ler relatório completo", "file-text", "ghost", 'data-page="reports"') + '</article></section>';
}

function parentClasses(child) {
  return pageHeading("Aulas de " + child.name.split(" ")[0], "Próximos encontros, frequência e histórico recente.", childSwitcher(child)) +
    '<section class="dashboard-grid"><article class="card card--pad span-5"><div class="card-label"><h3>Próxima aula</h3>' + statusBadge("next") + '</div>' +
    '<div class="next-class"><div class="next-class__date"><span class="date-box"><strong>13</strong><small>AGO</small></span><div><h4>' + child.course + '</h4><p>' + child.nextLesson + '</p></div></div><p>Professor ' + child.teacher + '</p>' + button("Abrir detalhes", "arrow-right", "primary", 'data-action="lesson-detail"') + '</div></article>' +
    '<article class="card card--pad span-7"><div class="card-label"><h3>Presença</h3><span class="badge badge--success">' + child.attendance + '% frequência</span></div>' +
    '<div class="timeline"><div class="timeline-item"><h4>03/08 • Presente</h4><p>Projeto de plataforma</p></div><div class="timeline-item"><h4>27/07 • Presente</h4><p>Movimentação do personagem</p></div><div class="timeline-item"><h4>20/07 • Falta justificada</h4><p>Aula reagendada para 22/07</p></div></div></article></section>';
}

function financePage() {
  const rows = payments.map((payment) =>
    '<div class="payment-row"><strong>' + payment.month + '</strong><span>' + payment.value + '</span><span>Vencimento ' + payment.due + '</span>' + statusBadge(payment.status) + '</div>'
  ).join("");
  return pageHeading("Financeiro", "Mensalidades, vencimentos e formas de pagamento em um só lugar.") +
    '<section class="section-stack"><article class="card payment-hero"><div><small>Próximo pagamento</small><h2>R$ 277,00</h2><p>Vencimento em 10/09/2026</p></div>' +
    button("Pagar mensalidade", "arrow-right", "dark", 'data-action="payment"') + '</article>' +
    '<article class="card payment-list"><div class="card-label" style="padding:20px;margin:0;border-bottom:1px solid var(--line)"><h3>Histórico de pagamentos</h3></div>' + rows + '</article></section>';
}

function parentReports(child) {
  return pageHeading("Relatórios pedagógicos", "Acompanhe percepções do professor e competências desenvolvidas.", childSwitcher(child)) +
    '<article class="card report-card"><div class="card-label"><div><span class="badge badge--info">AGOSTO 2026</span><h2 style="margin:12px 0 4px">Relatório mensal — ' + child.name.split(" ")[0] + '</h2><p style="color:var(--muted)">Professor ' + child.teacher + '</p></div>' + button("Baixar PDF", "download", "ghost", 'data-action="download-report"') + '</div>' +
    '<h3>Resumo</h3><p class="report-summary">' + child.monthlyReport + '</p><h3>Competências</h3><div class="competency-grid">' +
    competency("Lógica", 84) + competency("Criatividade", 96) + competency("Autonomia", 72) + competency("Programação", 86) +
    '</div><h3 style="margin-top:24px">Próxima etapa</h3><p style="color:var(--muted)">Fortalecer o planejamento antes de programar e começar a testar versões diferentes da mesma solução.</p></article>';
}

function competency(label, value) {
  return '<div class="competency"><div class="competency__top"><span>' + label + '</span><strong>' + value + '%</strong></div><div class="progress-line"><span style="width:' + value + '%"></span></div></div>';
}

function teacherPage(state) {
  const pages = {
    home: teacherHome,
    classes: teacherClasses,
    students: teacherStudents,
    attendance: attendancePage,
    calendar: () => calendarPage("teacher"),
    projects: () => projectsPage(true, state.projectFilter, state.search),
    reports: teacherReports,
    profile: () => profilePage(profiles.teacher, "Professor • 3 cursos")
  };
  return (pages[state.page] || teacherHome)();
}

function teacherHome() {
  return pageHeading("Bom dia, professor Rafael.", "Você tem 4 aulas hoje. A próxima começa às 14:15.", button("Abrir próxima aula", "play", "primary", 'data-action="open-class"')) +
    '<section class="dashboard-grid"><article class="card mission-card span-8"><div class="mission-card__content"><p class="eyebrow">Próxima aula • 14:15</p><h2>Pedro • Construct 3</h2><p>Projeto atual: Corrida Infinita. O aluno está em 48% e precisa revisar colisões.</p>' +
    '<div class="mission-card__meta"><span>Presença pendente</span><span>60 min</span></div>' + button("Abrir aula", "arrow-right", "dark", 'data-action="open-class"') + '</div><div class="mission-art"><div class="mission-art__planet">' + icon("monitor-play") + '</div></div></article>' +
    '<article class="card card--pad span-4"><div class="card-label"><h3>Agenda de hoje</h3><button class="text-button" data-page="classes">Ver agenda</button></div>' +
    '<div class="timeline"><div class="timeline-item"><h4>08:30 • João</h4><p>Python • Finalizada</p></div><div class="timeline-item"><h4>10:00 • Mariana</h4><p>Minecraft • Finalizada</p></div><div class="timeline-item is-current"><h4>14:15 • Pedro</h4><p>Construct 3 • Próxima</p></div><div class="timeline-item is-locked"><h4>18:10 • Bernardo</h4><p>Construct 3 • Agendada</p></div></div></article>' +
    statCard("Aulas hoje", "4", "calendar-clock", "2 concluídas", "span-3") +
    statCard("Alunos ativos", "28", "users-round", "+2 no mês", "span-3") +
    statCard("Chamadas pendentes", "2", "list-checks", "Hoje", "span-3") +
    statCard("Relatórios pendentes", "5", "clipboard-pen-line", "Até sexta", "span-3") + '</section>';
}

function teacherClasses() {
  const rows = lessons.map((lesson) =>
    '<div class="lesson-row ' + (lesson.status === "next" ? "is-next" : "") + '"><span class="lesson-time">' + lesson.time + '</span><div><strong>' + lesson.student + '</strong><span style="display:block">' + lesson.course + '</span></div><span>' + lesson.project + '</span><span>' + lesson.date + '</span>' + statusBadge(lesson.status) + '</div>'
  ).join("");
  return pageHeading("Minhas aulas", "Organize o dia e comece cada aula com o contexto certo.", button("Nova aula", "plus", "primary", 'data-action="new-class"')) +
    '<article class="card agenda">' + rows + '</article>';
}

function teacherStudents() {
  const students = adminStudents.slice(0, 4).map((student) =>
    '<article class="card card--pad card--interactive"><div class="profile-banner" style="padding:0"><span class="profile-avatar" style="width:58px;height:58px;border-radius:18px">' + initials(student.name) + '</span><div><h3>' + student.name + '</h3><p>' + student.course + ' • ' + student.progress + '%</p></div></div><div style="height:16px"></div><div class="progress-line"><span style="width:' + student.progress + '%"></span></div><div style="height:16px"></div>' +
    button("Abrir perfil", "arrow-right", "ghost", 'data-action="student-detail" data-student="' + student.name + '"') + '</article>'
  ).join("");
  return pageHeading("Alunos", "Acesse rapidamente progresso, histórico e projetos de cada aluno.") +
    '<div class="filter-bar"><label class="search-box">' + icon("search") + '<input type="search" placeholder="Buscar aluno…" aria-label="Buscar aluno"></label><div class="filter-tabs"><button class="filter-tab is-active">Todos</button><button class="filter-tab">Construct 3</button><button class="filter-tab">Python</button></div></div>' +
    '<section class="project-grid">' + students + '</section>';
}

function attendancePage() {
  const names = ["João Pedro", "Marcelo Nunes", "Bernardo Alves", "Lara Costa"];
  const list = names.map((name, index) =>
    '<div class="attendance-student" data-attendance-id="' + index + '"><div class="attendance-student__info"><span class="avatar">' + initials(name) + '</span><span>' + name + '</span></div>' +
    '<div class="attendance-options"><button class="attendance-option is-active" type="button" data-action="attendance-mark" data-value="present">Presente</button>' +
    '<button class="attendance-option" type="button" data-action="attendance-mark" data-value="absent">Ausente</button>' +
    '<button class="attendance-option" type="button" data-action="attendance-mark" data-value="late">Atraso</button></div></div>'
  ).join("");
  return pageHeading("Chamada", "Registre a presença em poucos cliques e siga para a aula.", button("Selecionar aula", "chevron-down", "ghost", 'data-action="select-class"')) +
    '<section class="dashboard-grid"><article class="card card--pad span-4"><div class="card-label"><h3>Detalhes da aula</h3>' + statusBadge("next") + '</div>' +
    '<div class="detail-facts"><div class="detail-fact"><span>Curso</span><strong>Construct 3</strong></div><div class="detail-fact"><span>Data</span><strong>10/08/2026</strong></div><div class="detail-fact"><span>Horário</span><strong>18:10</strong></div><div class="detail-fact"><span>Professor</span><strong>Rafael</strong></div></div></article>' +
    '<article class="card card--pad span-8"><div class="card-label"><h3>Alunos</h3><span class="badge badge--info">4 matriculados</span></div><div class="attendance-list">' + list + '</div><div style="height:18px"></div>' +
    button("Salvar chamada", "check", "primary", 'class="button button--primary button--wide" data-action="save-attendance"') + '</article></section>';
}

function teacherReports() {
  return pageHeading("Relatórios", "Registre avanços, pontos de atenção e objetivos para a próxima etapa.", button("Histórico", "history", "ghost", 'data-action="report-history"')) +
    '<form class="card card--pad" id="report-form"><div class="form-grid"><div class="field"><label for="report-student">Aluno</label><select id="report-student" name="student" required><option>Lucas Martins</option><option>Mariana Lopes</option><option>João Pedro</option></select></div>' +
    '<div class="field"><label for="report-period">Período</label><select id="report-period" name="period" required><option>Agosto 2026</option><option>Julho 2026</option></select></div>' +
    '<div class="field field--full"><label for="report-summary">Resumo do período</label><textarea id="report-summary" name="summary" required placeholder="Descreva a evolução do aluno…"></textarea></div>' +
    ratingField("Lógica", "logic") + ratingField("Criatividade", "creativity") + ratingField("Autonomia", "autonomy") + ratingField("Participação", "participation") + ratingField("Programação", "programming") +
    '<div class="field field--full"><label for="report-notes">Observações</label><textarea id="report-notes" name="notes" placeholder="Pontos importantes para a família…"></textarea></div>' +
    '<div class="field field--full"><label for="report-goals">Objetivos para a próxima etapa</label><textarea id="report-goals" name="goals" required placeholder="Quais habilidades serão trabalhadas?"></textarea></div></div>' +
    '<div style="display:flex;justify-content:flex-end;margin-top:22px">' + button("Salvar relatório", "check", "primary", 'data-action="save-report"') + '</div></form>';
}

function ratingField(label, name) {
  const buttons = [1, 2, 3, 4, 5].map((value) => '<button type="button" class="' + (value <= 4 ? "is-active" : "") + '" data-action="rating" data-rating="' + value + '" aria-label="' + value + ' de 5">' + icon("star") + '</button>').join("");
  return '<div class="field"><label>' + label + '</label><div class="rating-group" data-rating-name="' + name + '">' + buttons + '</div></div>';
}

function adminPage(state) {
  const pages = {
    home: adminHome,
    students: adminStudentsPage,
    teachers: adminTeachersPage,
    classes: teacherClasses,
    projects: () => projectsPage(true, state.projectFilter, state.search),
    courses: adminCourses,
    calendar: () => calendarPage("admin"),
    finance: adminFinance,
    reports: adminReports,
    settings: adminSettings
  };
  return (pages[state.page] || adminHome)();
}

function adminHome() {
  return pageHeading("Visão geral", "Acompanhe os indicadores mais importantes da operação New Code.", button("Exportar resumo", "download", "ghost", 'data-action="export-summary"')) +
    '<section class="dashboard-grid">' +
    statCard("Alunos ativos", "146", "users-round", "+12 este mês", "span-3") +
    statCard("Professores", "12", "graduation-cap", "Todos ativos", "span-3") +
    statCard("Aulas hoje", "38", "calendar-clock", "16 realizadas", "span-3") +
    statCard("Pagamentos pendentes", "17", "wallet-cards", "R$ 4.709", "span-3") +
    '<article class="card card--pad span-7"><div class="card-label"><h3>Atividade da escola</h3><span class="badge badge--success">Últimos 30 dias</span></div>' +
    '<div class="competency-grid">' + competency("Projetos concluídos", 78) + competency("Frequência média", 92) + competency("Relatórios publicados", 68) + competency("Pagamentos em dia", 88) + '</div></article>' +
    '<article class="card card--pad span-5"><div class="card-label"><h3>Atenção necessária</h3><button class="text-button" data-page="reports">Ver tudo</button></div>' +
    '<div class="timeline"><div class="timeline-item is-current"><h4>5 relatórios pendentes</h4><p>Prazo até sexta-feira.</p></div><div class="timeline-item is-current"><h4>3 pagamentos vencidos</h4><p>Equipe financeira notificada.</p></div><div class="timeline-item"><h4>Agenda equilibrada</h4><p>Todos os professores abaixo do limite.</p></div></div></article></section>';
}

function adminStudentsPage() {
  const rows = adminStudents.map((student) =>
    '<tr><td><div class="table-person"><span class="avatar">' + initials(student.name) + '</span><strong>' + student.name + '</strong></div></td><td>' + student.age + '</td><td>' + student.course + '</td><td>' + student.teacher + '</td><td>' + student.parent + '</td>' +
    '<td><div class="table-progress"><small>' + student.progress + '%</small><div class="progress-line"><span style="width:' + student.progress + '%"></span></div></div></td><td>' + statusBadge(student.status === "Ativo" ? "active" : "pending") + '</td>' +
    '<td><button class="icon-button" type="button" data-action="edit-student" data-student="' + student.name + '" aria-label="Editar ' + student.name + '">' + icon("pencil") + '</button></td></tr>'
  ).join("");
  return pageHeading("Gestão de alunos", "Busque, acompanhe e atualize os dados dos alunos.", button("Novo aluno", "plus", "primary", 'data-action="new-student"')) +
    '<div class="filter-bar"><label class="search-box">' + icon("search") + '<input type="search" data-action="admin-search" placeholder="Buscar aluno…" aria-label="Buscar aluno"></label><div class="filter-tabs"><button class="filter-tab is-active">Todos</button><button class="filter-tab">Ativos</button><button class="filter-tab">Pausados</button></div></div>' +
    '<div class="data-table-wrap"><table class="data-table"><thead><tr><th>Aluno</th><th>Idade</th><th>Curso</th><th>Professor</th><th>Responsável</th><th>Progresso</th><th>Status</th><th></th></tr></thead><tbody>' + rows + '</tbody></table></div>';
}

function adminTeachersPage() {
  const teachers = [
    ["Rafael Costa", "Construct 3, Python", "28 alunos", "4 aulas hoje", "Ativo"],
    ["Camila Rocha", "Scratch, Scratch Jr", "22 alunos", "3 aulas hoje", "Ativo"],
    ["André Vidal", "Unity, Roblox", "19 alunos", "2 aulas hoje", "Ativo"],
    ["Bianca Souza", "Robótica, Minecraft", "24 alunos", "4 aulas hoje", "Ativo"]
  ];
  const rows = teachers.map((teacher) =>
    '<tr><td><div class="table-person"><span class="avatar avatar--amber">' + initials(teacher[0]) + '</span><strong>' + teacher[0] + '</strong></div></td><td>' + teacher[1] + '</td><td>' + teacher[2] + '</td><td>' + teacher[3] + '</td><td>' + statusBadge("active") + '</td><td><button class="icon-button" type="button" data-action="edit-teacher" aria-label="Editar professor">' + icon("pencil") + '</button></td></tr>'
  ).join("");
  return pageHeading("Gestão de professores", "Equipe, cursos, alunos e agenda em uma única visão.", button("Novo professor", "plus", "primary", 'data-action="new-teacher"')) +
    '<div class="data-table-wrap"><table class="data-table"><thead><tr><th>Professor</th><th>Cursos</th><th>Alunos</th><th>Agenda</th><th>Status</th><th></th></tr></thead><tbody>' + rows + '</tbody></table></div>';
}

function adminCourses() {
  const courses = [
    ["Construct 3", "9 a 14 anos", "12 projetos", "gamepad-2", "Rafael Costa"],
    ["Scratch", "7 a 12 anos", "10 projetos", "blocks", "Camila Rocha"],
    ["Python", "12 a 17 anos", "14 projetos", "terminal", "Rafael Costa"]
  ];
  const cards = courses.map((course) =>
    '<article class="card course-admin-card"><div class="course-admin-card__top">' + icon(course[3]) + '<span class="badge">' + course[1] + '</span></div><div class="course-admin-card__body"><h3>' + course[0] + '</h3><p>' + course[2] + ' • Professor ' + course[4] + '</p>' +
    button("Gerenciar curso", "arrow-right", "ghost", 'data-action="edit-course"') + '</div></article>'
  ).join("");
  return pageHeading("Cursos", "Organize trilhas, faixas etárias, professores e projetos.", button("Novo curso", "plus", "primary", 'data-action="new-course"')) + '<section class="course-admin-grid">' + cards + '</section>';
}

function adminFinance() {
  return pageHeading("Financeiro", "Acompanhe recebimentos, pendências e status de cobrança.", button("Exportar", "download", "ghost", 'data-action="export-summary"')) +
    '<section class="dashboard-grid">' + statCard("Recebido no mês", "R$ 35.684", "circle-dollar-sign", "+8,2%", "span-3") + statCard("Pendente", "R$ 4.709", "clock-3", "17 cobranças", "span-3") + statCard("Vencido", "R$ 831", "triangle-alert", "3 cobranças", "span-3") + statCard("Taxa de pagamento", "88%", "chart-no-axes-combined", "Acima da meta", "span-3") + '</section><div style="height:18px"></div>' +
    '<article class="card payment-list"><div class="payment-row"><strong>Willian Martins</strong><span>Lucas e Roberto</span><span>R$ 554,00 • 10/09</span>' + statusBadge("pending") + '</div><div class="payment-row"><strong>Carla Lopes</strong><span>Mariana</span><span>R$ 277,00 • 10/08</span>' + statusBadge("paid") + '</div><div class="payment-row"><strong>Marta Souza</strong><span>João Pedro</span><span>R$ 277,00 • 10/08</span>' + statusBadge("overdue") + '</div></article>';
}

function adminReports() {
  return pageHeading("Relatórios", "Acompanhe publicação, pendências e qualidade do acompanhamento pedagógico.", button("Gerar relatório", "plus", "primary", 'data-action="new-admin-report"')) +
    '<section class="dashboard-grid">' + statCard("Publicados no mês", "118", "file-check-2", "81%", "span-3") + statCard("Pendentes", "5", "clock-3", "Até sexta", "span-3") + statCard("Média de evolução", "8,4", "trending-up", "+0,6", "span-3") + statCard("Famílias que visualizaram", "92%", "eye", "Alto engajamento", "span-3") + '</section><div style="height:18px"></div>' +
    '<div class="data-table-wrap"><table class="data-table"><thead><tr><th>Aluno</th><th>Professor</th><th>Período</th><th>Status</th><th>Visualização</th><th></th></tr></thead><tbody><tr><td>Lucas Martins</td><td>Rafael Costa</td><td>Agosto 2026</td><td>' + statusBadge("completed") + '</td><td>Visualizado</td><td>' + iconButton("eye", "Visualizar") + '</td></tr><tr><td>Mariana Lopes</td><td>Rafael Costa</td><td>Agosto 2026</td><td>' + statusBadge("pending") + '</td><td>—</td><td>' + iconButton("pencil", "Editar") + '</td></tr></tbody></table></div>';
}

function adminSettings() {
  return pageHeading("Configurações", "Preferências gerais, permissões e comportamento da plataforma.") +
    '<article class="card settings-list"><div class="setting-row"><div><strong>Cadastro público</strong><p>Permitir solicitações de matrícula pela landing page.</p></div><button class="switch is-on" type="button" data-action="toggle-switch"></button></div>' +
    '<div class="setting-row"><div><strong>Notificações automáticas</strong><p>Lembretes de aula e pagamento para usuários vinculados.</p></div><button class="switch is-on" type="button" data-action="toggle-switch"></button></div>' +
    '<div class="setting-row"><div><strong>Modo manutenção</strong><p>Exibe uma mensagem de indisponibilidade temporária.</p></div><button class="switch" type="button" data-action="toggle-switch"></button></div>' +
    '<div class="setting-row"><div><strong>Políticas de acesso</strong><p>Revisar permissões por perfil e regras de segurança.</p></div>' + button("Revisar", "shield-check", "ghost", 'data-action="permissions"') + '</div></article>';
}

function iconButton(iconName, label) {
  return '<button class="icon-button" type="button" data-action="generic-action" aria-label="' + label + '">' + icon(iconName) + '</button>';
}

function escapeHtml(value) {
  return String(value || "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[character]));
}

export function projectDetail(projectId, teacherMode = false) {
  const project = projects.find((item) => item.id === projectId) || projects[0];
  return '<div class="modal modal--large" role="dialog" aria-modal="true" aria-labelledby="project-detail-title">' +
    '<header class="modal__header"><div><span class="badge">' + project.technology + '</span><h2 id="project-detail-title" style="margin-top:7px">' + project.title + '</h2></div><button class="icon-button" type="button" data-action="close-overlay" aria-label="Fechar">' + icon("x") + '</button></header>' +
    '<div class="modal__body"><div class="project-detail-hero">' + icon(project.icon) + '</div><div class="project-detail-grid"><div><p class="eyebrow">' + project.kicker + '</p><p>' + project.description + '</p><h3>O que você vai construir</h3><ul class="objective-list">' +
    project.objectives.map((objective) => '<li>' + icon("circle-check") + objective + '</li>').join("") + '</ul></div>' +
    '<aside><div class="detail-facts"><div class="detail-fact"><span>Dificuldade</span><strong>' + project.difficulty + '</strong></div><div class="detail-fact"><span>Duração</span><strong>' + project.duration + '</strong></div><div class="detail-fact"><span>Professor</span><strong>' + project.teacher + '</strong></div><div class="detail-fact"><span>Recompensa</span><strong>+' + project.xp + ' XP</strong></div></div></aside></div></div>' +
    '<footer class="modal__footer">' + button("Abrir material", "file-text", "ghost", 'data-action="open-pdf" data-project-id="' + project.id + '"') +
    (teacherMode ? button("Atribuir projeto", "user-plus", "primary", 'data-action="assign-project" data-project-id="' + project.id + '"') : button(project.progress > 0 ? "Continuar projeto" : "Começar projeto", "arrow-right", "primary", 'data-action="start-project"')) + '</footer></div>';
}

export function pdfViewer(projectId, page = 0, zoom = 1) {
  const project = projects.find((item) => item.id === projectId) || projects[0];
  const text = project.materialPages[page] || project.materialPages[0];
  return '<div class="modal modal--large" role="dialog" aria-modal="true" aria-labelledby="pdf-title"><header class="modal__header"><div><span class="badge">Material do projeto</span><h2 id="pdf-title" style="margin-top:7px">' + project.title + '</h2></div><button class="icon-button" type="button" data-action="close-overlay" aria-label="Fechar">' + icon("x") + '</button></header>' +
    '<div class="modal__body"><div class="pdf-viewer" data-project-id="' + project.id + '" data-pdf-page="' + page + '" data-zoom="' + zoom + '"><div class="pdf-toolbar">' +
    '<button type="button" data-action="pdf-prev" aria-label="Página anterior">' + icon("chevron-left") + '</button><span>Página ' + (page + 1) + ' de ' + project.materialPages.length + '</span><button type="button" data-action="pdf-next" aria-label="Próxima página">' + icon("chevron-right") + '</button>' +
    '<button type="button" data-action="pdf-zoom-out" aria-label="Diminuir zoom">' + icon("zoom-out") + '</button><button type="button" data-action="pdf-zoom-in" aria-label="Aumentar zoom">' + icon("zoom-in") + '</button><button type="button" data-action="pdf-fullscreen" aria-label="Tela cheia">' + icon("maximize-2") + '</button></div>' +
    '<article class="pdf-page" style="--zoom:' + zoom + '"><div class="pdf-page__brand">NEW CODE</div><p class="eyebrow">Projeto guiado</p><h3>' + project.title + '</h3><p>' + text + '</p><div style="margin-top:55px" class="progress-line"><span style="width:' + (((page + 1) / project.materialPages.length) * 100) + '%"></span></div></article></div></div></div>';
}

export function notificationsDrawer() {
  return '<aside class="drawer" role="dialog" aria-modal="true" aria-labelledby="notifications-title"><header class="drawer__header"><div><p class="fresh-kicker">CENTRAL DE AVISOS</p><h2 id="notifications-title">Notificações</h2></div><button class="icon-button" type="button" data-action="close-overlay" aria-label="Fechar">' + icon("x") + '</button></header>' +
    '<div class="drawer__body"><section class="fresh-empty fresh-empty--compact"><div class="fresh-empty__art"><span>' + icon("bell") + '</span><i></i><i></i></div><div class="fresh-empty__copy"><h2>Nenhum aviso por enquanto.</h2><p>Novos conteúdos, recados e atualizações aparecerão aqui quando forem cadastrados.</p></div></section></div></aside>';
}

export function lessonDetail() {
  return '<div class="modal" role="dialog" aria-modal="true" aria-labelledby="lesson-title"><header class="modal__header"><div><span class="badge badge--info">Próxima aula</span><h2 id="lesson-title" style="margin-top:7px">Construct 3 • Inimigos inteligentes</h2></div><button class="icon-button" type="button" data-action="close-overlay" aria-label="Fechar">' + icon("x") + '</button></header>' +
    '<div class="modal__body"><div class="detail-facts"><div class="detail-fact"><span>Professor</span><strong>Rafael Costa</strong></div><div class="detail-fact"><span>Data e hora</span><strong>13/08/2026 • 18:10</strong></div><div class="detail-fact"><span>Curso</span><strong>Construct 3</strong></div><div class="detail-fact"><span>Material</span><strong>Jogo de Plataforma</strong></div></div></div>' +
    '<footer class="modal__footer">' + button("Abrir projeto", "folder-kanban", "primary", 'data-action="open-project" data-project-id="jogo-plataforma"') + '</footer></div>';
}

export function calendarEventDetail(eventId) {
  const event = calendarEvents.find((item) => item.id === eventId) || calendarEvents[0];
  return '<div class="modal modal--small" role="dialog" aria-modal="true" aria-labelledby="event-title"><header class="modal__header"><div>' + statusBadge(event.type === "lesson" ? "next" : "available") + '<h2 id="event-title" style="margin-top:7px">' + event.title + '</h2></div><button class="icon-button" type="button" data-action="close-overlay" aria-label="Fechar">' + icon("x") + '</button></header>' +
    '<div class="modal__body"><div class="detail-facts"><div class="detail-fact"><span>Data</span><strong>' + String(event.day).padStart(2, "0") + '/08/2026</strong></div><div class="detail-fact"><span>Horário</span><strong>' + event.time + '</strong></div><div class="detail-fact"><span>Responsável</span><strong>' + event.teacher + '</strong></div><div class="detail-fact"><span>Material</span><strong>' + event.material + '</strong></div></div></div></div>';
}

export function paymentModal() {
  return '<div class="modal modal--small" role="dialog" aria-modal="true" aria-labelledby="payment-title"><header class="modal__header"><div><span class="badge badge--warning">Pagamento pendente</span><h2 id="payment-title" style="margin-top:7px">R$ 277,00</h2></div><button class="icon-button" type="button" data-action="close-overlay" aria-label="Fechar">' + icon("x") + '</button></header>' +
    '<div class="modal__body"><p style="color:var(--muted)">Escolha como deseja pagar a mensalidade de setembro. Esta etapa está preparada para futura integração com o gateway.</p><div class="section-stack">' +
    paymentMethod("qr-code", "PIX", "Confirmação rápida e segura", "pix") + paymentMethod("barcode", "Boleto", "Vencimento em 10/09/2026", "boleto") + paymentMethod("credit-card", "Cartão", "Crédito ou débito", "cartao") + '</div></div></div>';
}

function paymentMethod(iconName, title, description, method) {
  return '<button class="card card--pad card--interactive" type="button" data-action="payment-method" data-method="' + method + '" style="display:flex;align-items:center;gap:14px;text-align:left;cursor:pointer"><span class="metric-block__icon">' + icon(iconName) + '</span><span><strong style="display:block">' + title + '</strong><small style="color:var(--muted)">' + description + '</small></span><span style="margin-left:auto">' + icon("chevron-right") + '</span></button>';
}

export function assignProjectModal(projectId) {
  const project = projects.find((item) => item.id === projectId) || projects[0];
  return '<div class="modal modal--small" role="dialog" aria-modal="true" aria-labelledby="assign-title"><header class="modal__header"><div><span class="badge">' + project.technology + '</span><h2 id="assign-title" style="margin-top:7px">Atribuir ' + project.title + '</h2></div><button class="icon-button" type="button" data-action="close-overlay" aria-label="Fechar">' + icon("x") + '</button></header>' +
    '<form id="assign-form"><div class="modal__body"><div class="field"><label for="assign-target">Aluno ou grupo</label><select id="assign-target" name="target" required><option>Lucas Martins</option><option>Mariana Lopes</option><option>Turma Construct 3 • Terça</option></select></div>' +
    '<div class="form-grid"><div class="field"><label for="assign-date">Data</label><input id="assign-date" name="date" type="date" value="2026-08-11" required></div><div class="field"><label for="assign-deadline">Prazo</label><input id="assign-deadline" name="deadline" type="date" value="2026-08-25" required></div></div>' +
    '<div class="field" style="margin-top:16px"><label for="assign-note">Observação</label><textarea id="assign-note" name="note" placeholder="Orientações para o aluno…"></textarea></div></div>' +
    '<footer class="modal__footer">' + button("Cancelar", "", "ghost", 'data-action="close-overlay"') + button("Confirmar atribuição", "check", "primary", 'data-action="confirm-assign" data-project-id="' + project.id + '"') + '</footer></form></div>';
}

export function classPanel() {
  return '<aside class="drawer" role="dialog" aria-modal="true" aria-labelledby="class-title"><header class="drawer__header"><div><span class="badge badge--info">14:15 • Próxima</span><h2 id="class-title" style="margin-top:8px">Aula de Pedro</h2></div><button class="icon-button" type="button" data-action="close-overlay" aria-label="Fechar">' + icon("x") + '</button></header>' +
    '<div class="drawer__body"><div class="profile-banner card" style="padding:18px"><span class="profile-avatar" style="width:60px;height:60px;border-radius:18px">PL</span><div><h3>Pedro Lima</h3><p>Construct 3 • Nível 5</p></div></div>' +
    '<div style="height:18px"></div><div class="detail-facts"><div class="detail-fact"><span>Projeto atual</span><strong>Corrida Infinita</strong></div><div class="detail-fact"><span>Progresso</span><strong>48%</strong></div><div class="detail-fact"><span>Última aula</span><strong>Colisões</strong></div><div class="detail-fact"><span>Presença</span><strong>Pendente</strong></div></div>' +
    '<h3 style="margin-top:24px">Observação da última aula</h3><p style="color:var(--muted)">Pedro entendeu a lógica de movimento, mas precisa revisar a ordem dos eventos de colisão.</p>' +
    '<div class="section-stack">' + button("Registrar presença", "list-checks", "primary", 'class="button button--primary button--wide" data-page="attendance" data-action="close-overlay"') + button("Abrir projeto", "folder-kanban", "ghost", 'class="button button--ghost button--wide" data-action="open-project" data-project-id="jogo-plataforma"') + button("Finalizar aula", "check-circle-2", "soft", 'class="button button--soft button--wide" data-action="finish-class"') + '</div></div></aside>';
}

export function finishClassModal() {
  return '<div class="modal modal--small" role="dialog" aria-modal="true" aria-labelledby="finish-title"><header class="modal__header"><h2 id="finish-title">Finalizar aula</h2><button class="icon-button" type="button" data-action="close-overlay" aria-label="Fechar">' + icon("x") + '</button></header>' +
    '<div class="modal__body"><div class="field"><label for="project-status">Status do projeto</label><select id="project-status"><option>Em andamento</option><option>Concluído</option><option>Não iniciado</option></select></div><div class="field"><label for="class-notes">Observação</label><textarea id="class-notes" placeholder="O que foi realizado nesta aula?"></textarea></div><div class="field"><label for="next-project">Próximo projeto</label><select id="next-project"><option>Manter projeto atual</option><option>Sistema de Pontos</option><option>Inimigos Inteligentes</option></select></div></div>' +
    '<footer class="modal__footer">' + button("Salvar e finalizar", "check", "primary", 'data-action="confirm-finish-class"') + '</footer></div>';
}

export function genericFormModal(title, kind) {
  return '<div class="modal modal--small" role="dialog" aria-modal="true" aria-labelledby="generic-form-title"><header class="modal__header"><h2 id="generic-form-title">' + title + '</h2><button class="icon-button" type="button" data-action="close-overlay" aria-label="Fechar">' + icon("x") + '</button></header>' +
    '<div class="modal__body"><div class="field"><label for="generic-name">Nome</label><input id="generic-name" placeholder="Digite um nome" required></div><div class="field"><label for="generic-detail">Detalhes</label><textarea id="generic-detail" placeholder="Adicione informações importantes…"></textarea></div></div>' +
    '<footer class="modal__footer">' + button("Cancelar", "", "ghost", 'data-action="close-overlay"') + button("Salvar", "check", "primary", 'data-action="save-generic" data-kind="' + kind + '"') + '</footer></div>';
}

export function commandPalette(role, query = "") {
  const nav = roleNavigation[role];
  const items = nav.filter((item) => item[1].toLowerCase().includes(query.toLowerCase())).map((item) =>
    '<button class="command-item" type="button" data-page="' + item[0] + '" data-action="close-overlay">' + icon(item[2]) + '<span>' + item[1] + '</span><small>Página</small></button>'
  );
  return '<div class="command-wrap" role="dialog" aria-modal="true" aria-label="Busca rápida"><label class="command-input">' + icon("search") + '<input id="command-search" type="search" value="' + escapeHtml(query) + '" placeholder="Buscar uma área…" autocomplete="off"><kbd>ESC</kbd></label><div class="command-results">' + items.join("") + '</div></div>';
}

export function profileMenu() {
  return '<div class="modal modal--small" role="dialog" aria-modal="true" aria-labelledby="profile-menu-title"><header class="modal__header"><h2 id="profile-menu-title">Minha conta</h2><button class="icon-button" type="button" data-action="close-overlay" aria-label="Fechar">' + icon("x") + '</button></header><div class="modal__body section-stack">' +
    button("Meu perfil", "user-round", "ghost", 'class="button button--ghost button--wide" data-page="profile" data-action="close-overlay"') +
    button("Alternar tema", "moon", "ghost", 'class="button button--ghost button--wide" data-action="toggle-theme"') +
    button("Sair", "log-out", "danger", 'class="button button--danger button--wide" data-action="logout"') + '</div></div>';
}

export function onboarding(step = 0) {
  const steps = [
    ["rocket", "Bem-vindo à New Code!", "Aqui, cada ideia pode virar um jogo, uma história ou um novo mundo."],
    ["sparkles", "Escolha sua vibe.", "Use o modo criação e as ideias-surpresa para aquecer a criatividade."],
    ["send", "Seu professor envia as missões.", "Quando um conteúdo for atribuído a você, ele aparecerá na sua trilha."]
  ];
  const current = steps[step] || steps[0];
  return '<div class="modal modal--small" role="dialog" aria-modal="true" aria-labelledby="onboarding-title"><div class="modal__body onboarding"><span class="onboarding__visual">' + icon(current[0]) + '</span><h2 id="onboarding-title">' + current[1] + '</h2><p>' + current[2] + '</p><div class="onboarding-dots">' + steps.map((_, index) => '<span class="' + (index === step ? "is-active" : "") + '"></span>').join("") + '</div>' +
    button(step === steps.length - 1 ? "Começar" : "Continuar", "arrow-right", "primary", 'class="button button--primary button--wide" data-action="' + (step === steps.length - 1 ? "finish-onboarding" : "next-onboarding") + '" data-step="' + step + '"') + '</div></div>';
}

export { roleRoots, roleLabels, pageTitles, projects };
export {
  renderFreshLanding as renderLanding,
  renderFreshLogin as renderLogin,
  renderFreshSignup as renderSignup,
  studentCreativePrompts,
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
  attendanceFormModal
};
