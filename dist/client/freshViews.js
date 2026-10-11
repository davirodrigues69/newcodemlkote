const icon = (name) => '<i data-lucide="' + name + '" aria-hidden="true"></i>';

const safe = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#039;"
}[character]));

const safeUrl = (value) => {
  try {
    const url = new URL(String(value || ""));
    return ["http:", "https:"].includes(url.protocol) ? safe(url.href) : "";
  } catch {
    return "";
  }
};

export const studentCreativePrompts = [
  "Invente um personagem que resolve problemas com uma habilidade inesperada.",
  "Desenhe uma fase de jogo que acontece dentro de um computador.",
  "Crie um nome, uma cor e um superpoder para o seu próprio robô.",
  "Imagine um aplicativo que deixaria a escola mais divertida.",
  "Transforme um objeto comum em um item lendário de videogame."
];

const actionButton = (label, iconName, variant, attributes = "") => {
  const classMatch = attributes.match(/class="([^"]+)"/);
  const classes = classMatch ? classMatch[1] : "button button--" + (variant || "primary");
  const cleanAttributes = attributes.replace(/\s*class="[^"]+"/, "");
  return '<button class="' + classes + '" type="button" ' + cleanAttributes + '>' +
    '<span>' + label + '</span>' + (iconName ? icon(iconName) : "") + '</button>';
};

const pageHeading = (title, subtitle, actions) =>
  '<header class="page-heading fresh-page-heading"><div><p class="fresh-kicker">NEW CODE HUB</p><h1>' + title + '</h1><p>' + subtitle + '</p></div>' +
  (actions ? '<div class="page-actions">' + actions + '</div>' : "") + '</header>';

const metric = (label, value, iconName, color) =>
  '<article class="card fresh-metric fresh-metric--' + color + '"><span>' + icon(iconName) + '</span><div><strong>' + value + '</strong><p>' + label + '</p></div></article>';

const empty = (iconName, title, body, actionLabel, action) =>
  '<section class="fresh-empty"><div class="fresh-empty__art"><span>' + icon(iconName) + '</span><i></i><i></i></div>' +
  '<div class="fresh-empty__copy"><p class="fresh-kicker">ESPAÇO PRONTO PARA CRESCER</p><h2>' + title + '</h2><p>' + body + '</p>' +
  (actionLabel ? actionButton(actionLabel, "arrow-up-right", "primary", 'data-action="' + action + '"') : "") + '</div></section>';

function brand() {
  return '<span class="brand fresh-brand"><span class="brand-mark" aria-hidden="true"><span class="brand-logo"></span></span><span class="brand-copy"><strong>NEW CODE</strong><small>Clube de criadores</small></span></span>';
}

export function renderFreshLanding() {
  return '<div class="public-page fresh-public">' +
    '<header class="public-nav fresh-public-nav" id="public-nav"><div class="public-nav__inner">' +
    '<a href="#/" aria-label="New Code, início">' + brand() + '</a>' +
    '<nav class="public-links" id="public-links" aria-label="Navegação principal"><a href="#/" data-action="scroll-section" data-target="#experiencia">A experiência</a><a href="#/" data-action="scroll-section" data-target="#jornadas">Jornadas</a><a href="#/" data-action="scroll-section" data-target="#familias">Para famílias</a></nav>' +
    '<div class="public-actions"><a class="button button--ghost" href="#/login">Entrar</a><a class="button button--primary" href="#/cadastro">Criar conta ' + icon("arrow-up-right") + '</a>' +
    '<button class="icon-button mobile-menu-button" type="button" data-action="toggle-public-menu" aria-label="Abrir menu">' + icon("menu") + '</button></div></div></header>' +
    '<main id="app-main"><section class="fresh-hero"><div class="fresh-hero__glow"></div><div class="marketing-shell fresh-hero__grid">' +
    '<div class="fresh-hero__copy"><p class="fresh-pill">' + icon("sparkles") + ' APRENDER PODE SER O MELHOR MOMENTO DO DIA</p>' +
    '<h1>Um lugar para a curiosidade virar <em>conquista.</em></h1>' +
    '<p>A New Code conecta aluno, família e professor em uma jornada viva — com desafios criativos, acompanhamento claro e conteúdo feito para cada pessoa.</p>' +
    '<div class="hero-buttons"><a class="button button--primary" href="#/cadastro">Quero começar ' + icon("arrow-right") + '</a><a class="button button--ghost" href="#/" data-action="scroll-section" data-target="#experiencia">Conhecer a experiência</a></div>' +
    '<div class="fresh-trust"><span>' + icon("shield-check") + ' Ambiente seguro</span><span>' + icon("users-round") + ' Família por perto</span><span>' + icon("palette") + ' Criação de verdade</span></div></div>' +
    '<div class="fresh-world" aria-label="Universo de aprendizagem New Code"><div class="fresh-world__sun"></div><div class="fresh-world__core"><span><span class="fresh-core-logo" aria-hidden="true"></span></span><strong>Seu próximo<br>grande passo</strong></div>' +
    '<article class="fresh-float-card fresh-float-card--one"><span>' + icon("lightbulb") + '</span><div><small>IDEIA DO DIA</small><strong>Crie algo que só você imaginou.</strong></div></article>' +
    '<article class="fresh-float-card fresh-float-card--two"><span>' + icon("heart") + '</span><div><small>PARA A FAMÍLIA</small><strong>Acompanhe cada evolução.</strong></div></article>' +
    '<article class="fresh-float-card fresh-float-card--three"><span>' + icon("wand-sparkles") + '</span><div><small>NOVA HABILIDADE</small><strong>+ criatividade desbloqueada</strong></div></article>' +
    '<div class="fresh-shape fresh-shape--one"></div><div class="fresh-shape fresh-shape--two"></div></div></div></section>' +
    '<section class="fresh-marquee" aria-label="Princípios New Code"><div><span>EXPLORAR</span><i></i><span>CRIAR</span><i></i><span>COMPARTILHAR</span><i></i><span>EVOLUIR</span><i></i><span>EXPLORAR</span><i></i><span>CRIAR</span></div></section>' +
    '<section class="fresh-section fresh-section--light" id="experiencia"><div class="marketing-shell"><header class="fresh-section__heading"><p class="fresh-kicker">UMA EXPERIÊNCIA COMPLETA</p><h2>Feita para prender a atenção.<br>Construída para gerar evolução.</h2></header>' +
    '<div class="fresh-feature-grid">' +
    freshFeature("01", "Para quem aprende", "Um espaço claro, vibrante e sem distrações inúteis. O aluno vê apenas o que o professor preparou para ele.", "arrow-up-right", "royal") +
    freshFeature("02", "Para quem acompanha", "Responsáveis entendem o que está acontecendo sem precisar decifrar relatórios complicados.", "heart-handshake", "sky") +
    freshFeature("03", "Para quem ensina", "O professor cadastra alunos, cria conteúdos e encontra qualquer pessoa pelo nome completo.", "graduation-cap", "ice") +
    '</div></div></section>' +
    '<section class="fresh-section fresh-section--dark" id="jornadas"><div class="marketing-shell fresh-journey"><div><p class="fresh-kicker">NÃO É UM DASHBOARD GENÉRICO</p><h2>Cada acesso começa com uma tela limpa e uma ação que importa.</h2><p>Sem conteúdo fictício. Sem dados de demonstração misturados com alunos reais. A plataforma cresce à medida que a escola cadastra sua comunidade.</p><a class="button button--primary" href="#/cadastro">Criar meu espaço ' + icon("arrow-right") + '</a></div>' +
    '<div class="fresh-journey__steps"><article><span>1</span><strong>Professor cadastra</strong><p>Aluno, turma e conteúdo.</p></article><article><span>2</span><strong>Conteúdo é atribuído</strong><p>Busca rápida por nome e sobrenome.</p></article><article><span>3</span><strong>Aluno recebe</strong><p>Somente o que foi preparado para ele.</p></article></div></div></section>' +
    '<section class="fresh-section fresh-section--family" id="familias"><div class="marketing-shell fresh-family"><div class="fresh-family__art"><span>' + icon("heart") + '</span><strong>Juntos<br>em cada<br>descoberta.</strong></div><div><p class="fresh-kicker">FAMÍLIA CONECTADA</p><h2>O pai não precisa perguntar: “como foi a aula?”</h2><p>Projetos, evolução, presença e recados aparecem de forma simples quando o professor começar a registrar a jornada.</p><a class="button button--dark" href="#/cadastro">Criar conta de responsável ' + icon("arrow-right") + '</a></div></div></section>' +
    '<section class="fresh-final"><div class="marketing-shell"><p class="fresh-kicker">A PRÓXIMA IDEIA COMEÇA AQUI</p><h2>Abra espaço para aprender<br>de um jeito inesquecível.</h2><div class="hero-buttons"><a class="button button--primary" href="#/cadastro">Criar conta agora ' + icon("arrow-up-right") + '</a><a class="button button--ghost" href="#/login">Já tenho uma conta</a></div></div></section></main>' +
    '<footer class="public-footer fresh-footer"><div class="marketing-shell"><div class="public-footer__grid"><div>' + brand() + '<p>Uma área de aprendizado viva para alunos, famílias e professores.</p></div><div><h3>Plataforma</h3><a href="#/login">Entrar</a><a href="#/cadastro">Criar conta</a></div><div><h3>Experiência</h3><a href="#/" data-action="scroll-section" data-target="#experiencia">Como funciona</a><a href="#/" data-action="scroll-section" data-target="#familias">Para famílias</a></div></div><div class="footer-bottom">© 2026 New Code. Curiosidade que vira conquista.</div></div></footer></div>';
}

function freshFeature(number, title, body, iconName, color) {
  return '<article class="fresh-feature fresh-feature--' + color + '"><div><span>' + number + '</span>' + icon(iconName) + '</div><h3>' + title + '</h3><p>' + body + '</p></article>';
}

export function renderFreshLogin() {
  return '<main class="fresh-auth" id="app-main"><section class="fresh-auth__story"><a href="#/" aria-label="Voltar para o início">' + brand() + '</a><div><p class="fresh-pill">' + icon("sparkles") + ' SEU ESPAÇO NEW CODE</p><h1>Volte para o que você está construindo.</h1><p>Seu perfil define o espaço certo: aprender, acompanhar ou ensinar.</p></div><div class="fresh-auth__orbit"><span><span class="fresh-orbit-logo" aria-hidden="true"></span></span><i></i><i></i><i></i></div></section>' +
    '<section class="fresh-auth__form"><form class="fresh-form-box" id="login-form" novalidate><p class="fresh-kicker">BEM-VINDO DE VOLTA</p><h2>Entrar na plataforma</h2><p>Use o e-mail e a senha da sua conta cadastrada no Firebase da New Code.</p>' +
    '<div class="fresh-auth-note fresh-auth-note--firebase">' + icon("database-zap") + '<div><strong>Conta conectada ao Firebase</strong><span>Seu login abre automaticamente a área de aluno, responsável, professor ou coordenação.</span></div></div>' +
    '<div class="field"><label for="email">E-mail</label><input id="email" name="email" type="email" autocomplete="email" required placeholder="voce@email.com"></div>' +
    '<div class="field field-password"><label for="password">Senha</label><input id="password" name="password" type="password" autocomplete="current-password" minlength="6" required placeholder="Digite sua senha"><button type="button" data-action="toggle-password" aria-label="Mostrar senha">' + icon("eye") + '</button></div>' +
    '<div class="login-error" id="login-error" role="alert"></div><button class="button button--primary button--wide" id="login-submit" type="submit"><span>Entrar com minha conta</span>' + icon("arrow-right") + '</button>' +
    '<button class="fresh-account-switch" type="button" data-action="forgot-password">' + icon("key-round") + '<span>Esqueci minha senha</span></button>' +
    '<div class="fresh-divider"><span>Ainda não tem cadastro?</span></div><a class="button button--ghost button--wide" href="#/cadastro">Criar uma conta nova</a><a class="fresh-back-link" href="#/">Voltar para a página inicial</a></form></section></main>';
}

export function renderFreshSignup() {
  return '<main class="fresh-auth fresh-auth--signup" id="app-main"><section class="fresh-auth__story"><a href="#/" aria-label="Voltar para o início">' + brand() + '</a><div><p class="fresh-pill">' + icon("sparkles") + ' PRIMEIRO PASSO</p><h1>Crie um espaço que cresce com você.</h1><p>O cadastro público é exclusivo para alunos e responsáveis. Professores recebem a conta diretamente da coordenação.</p></div><div class="fresh-role-preview"><span>' + icon("rocket") + ' Aluno</span><span>' + icon("heart-handshake") + ' Responsável</span></div></section>' +
    '<section class="fresh-auth__form"><form class="fresh-form-box" id="signup-form" novalidate><p class="fresh-kicker">CRIAR CONTA</p><h2>Vamos montar seu perfil.</h2><p>Alunos e responsáveis podem criar a própria conta e recuperar a senha pelo e-mail cadastrado.</p>' +
    '<div class="form-grid"><div class="field"><label for="signup-first-name">Nome</label><input id="signup-first-name" name="first_name" autocomplete="given-name" required placeholder="Seu nome"></div>' +
    '<div class="field"><label for="signup-last-name">Sobrenome</label><input id="signup-last-name" name="last_name" autocomplete="family-name" required placeholder="Seu sobrenome"></div>' +
    '<div class="field field--full"><label for="signup-email">E-mail</label><input id="signup-email" name="email" type="email" autocomplete="email" required placeholder="voce@email.com"></div>' +
    '<div class="field"><label for="signup-password">Senha</label><input id="signup-password" name="password" type="password" autocomplete="new-password" minlength="6" required placeholder="Mínimo de 6 caracteres"></div>' +
    '<div class="field"><label for="signup-confirm-password">Confirmar senha</label><input id="signup-confirm-password" name="confirm_password" type="password" autocomplete="new-password" minlength="6" required placeholder="Digite novamente"></div>' +
    '<div class="field field--full"><label for="signup-role">Como você usará a New Code?</label><select id="signup-role" name="role" required><option value="">Selecione seu perfil</option><option value="student">Sou aluno</option><option value="parent">Sou responsável</option></select><small>Contas de professor e coordenação não podem ser criadas por este formulário.</small></div></div>' +
    '<label class="fresh-check"><input type="checkbox" name="terms" required><span>Concordo em usar meus dados para criar o perfil na plataforma.</span></label><div class="login-error" id="signup-error" role="alert"></div>' +
    '<button class="button button--primary button--wide" id="signup-submit" type="submit"><span>Criar minha conta</span>' + icon("arrow-right") + '</button><a class="fresh-back-link" href="#/login">Já tenho uma conta</a></form></section></main>';
}

export function renderFreshPage(state) {
  const data = state.data || {};
  if (state.role === "teacher") return teacherPage(state, data);
  if (state.role === "admin") return adminPage(state, data);
  if (state.role === "parent") return parentPage(state, data);
  return studentPage(state, data);
}

function teacherPage(state, data) {
  const students = data.students || [];
  const contents = data.contents || [];
  const assignments = data.assignments || [];
  const lessons = data.lessons || [];
  const pedagogicalRecords = data.pedagogical_records || [];
  const academicStructure = data.academic_structure || [];
  const assignedForAgenda = assignments.map((assignment) => ({ ...(assignment.content || {}), due_at: assignment.due_at, student_name: assignment.student_name }));
  const pages = {
    home: () => teacherHome(students, contents, assignments),
    students: () => studentsPage(students, state.studentSearch),
    projects: () => contentsPage(contents),
    classes: () => lessonsPage("Minhas aulas", "Cadastre encontros e acompanhe a programação dos alunos.", lessons, students, true),
    attendance: () => attendanceHub(students, academicStructure),
    calendar: () => agendaPage(lessons, assignedForAgenda),
    pedagogical: () => pedagogicalPage("Acompanhamento pedagógico", "Registre evolução, habilidades e próximos passos de cada aluno.", pedagogicalRecords, students, true),
    profile: () => profilePage(state)
  };
  return (pages[state.page] || pages.home)();
}

function teacherHome(students, contents, assignments) {
  return pageHeading("Seu estúdio de aprendizagem", "Cadastre sua comunidade e construa experiências sob medida.", actionButton("Cadastrar aluno", "user-plus", "ghost", 'data-action="new-student"') + actionButton("Criar conteúdo", "plus", "primary", 'data-action="new-content"')) +
    '<section class="fresh-dashboard">' +
    '<article class="fresh-command-card"><div><p class="fresh-kicker">COMECE POR AQUI</p><h2>A plataforma cresce com o que você ensina.</h2><p>Nada é preenchido com dados fictícios. Cadastre um aluno, crie um conteúdo e faça a primeira atribuição.</p><div class="fresh-command-card__actions">' +
    actionButton("1. Cadastrar aluno", "user-plus", "dark", 'data-action="new-student"') + actionButton("2. Criar conteúdo", "wand-sparkles", "soft", 'data-action="new-content"') + '</div></div><span class="fresh-command-card__symbol">' + icon("sparkles") + '</span></article>' +
    '<div class="fresh-metrics">' + metric("Alunos cadastrados", students.length, "users-round", "royal") + metric("Conteúdos criados", contents.length, "library-big", "sky") + metric("Atribuições", assignments.length, "send", "ice") + '</div>' +
    '<div class="fresh-two-column"><article class="card card--pad fresh-list-card"><div class="card-label"><h3>Alunos recentes</h3><button class="text-button" data-page="students">Ver alunos</button></div>' +
    (students.length ? students.slice(0, 3).map(studentRow).join("") : '<p class="fresh-muted">Nenhum aluno cadastrado ainda.</p>') + '</article>' +
    '<article class="card card--pad fresh-list-card"><div class="card-label"><h3>Conteúdos recentes</h3><button class="text-button" data-page="projects">Ver conteúdos</button></div>' +
    (contents.length ? contents.slice(0, 3).map(contentRow).join("") : '<p class="fresh-muted">Nenhum conteúdo criado ainda.</p>') + '</article></div></section>';
}

function studentsPage(students, query) {
  const search = query || "";
  return pageHeading("Alunos", "Pesquise por nome e sobrenome ou cadastre uma nova pessoa.", actionButton("Cadastrar aluno", "user-plus", "primary", 'data-action="new-student"')) +
    '<div class="fresh-search-bar"><label class="search-box">' + icon("search") + '<input type="search" data-action="student-search" value="' + safe(search) + '" placeholder="Buscar por nome e sobrenome…" aria-label="Buscar aluno por nome completo"></label><span>' + students.length + ' cadastrado' + (students.length === 1 ? "" : "s") + '</span></div>' +
    (students.length ? '<section class="fresh-student-grid">' + students.map(studentCard).join("") + '</section>' :
      empty("user-round-plus", "Nenhum aluno cadastrado.", "Cadastre nome, sobrenome, contato e curso. Depois, ele poderá receber conteúdos preparados pelo professor.", "Cadastrar primeiro aluno", "new-student"));
}

function studentCard(student) {
  return '<article class="fresh-person-card"><div class="fresh-person-card__top"><span class="fresh-avatar">' + safe(initials(student.first_name + " " + student.last_name)) + '</span><span class="fresh-status">CADASTRADO</span></div><h3>' + safe(student.first_name + " " + student.last_name) + '</h3><p>' + safe(student.course || "Curso ainda não definido") + '</p><small>' + safe(student.email || "Sem e-mail") + '</small><div class="fresh-card-actions">' +
    actionButton("Ver perfil", "arrow-right", "ghost", 'data-action="view-student" data-student-id="' + safe(student.id) + '"') +
    actionButton("Atribuir", "send", "primary", 'data-action="assign-content" data-student-id="' + safe(student.id) + '"') +
    actionButton("Editar", "pencil", "ghost", 'data-action="edit-student-record" data-student-id="' + safe(student.id) + '"') +
    actionButton("Excluir", "trash-2", "danger", 'data-action="delete-student" data-student-id="' + safe(student.id) + '"') + '</div></article>';
}

function studentRow(student) {
  return '<button class="fresh-inline-row" type="button" data-action="view-student" data-student-id="' + safe(student.id) + '"><span class="fresh-avatar">' + safe(initials(student.first_name + " " + student.last_name)) + '</span><span><strong>' + safe(student.first_name + " " + student.last_name) + '</strong><small>' + safe(student.course || "Curso não definido") + '</small></span>' + icon("arrow-up-right") + '</button>';
}

function contentsPage(contents) {
  return pageHeading("Conteúdos", "Crie materiais e atribua apenas aos alunos certos.", actionButton("Criar conteúdo", "plus", "primary", 'data-action="new-content"')) +
    (contents.length ? '<section class="fresh-content-grid">' + contents.map(contentCard).join("") + '</section>' :
      empty("library-big", "Sua biblioteca está vazia.", "Crie o primeiro conteúdo com título, descrição, tipo, faixa etária e duração. Depois, procure o aluno pelo nome completo para atribuir.", "Criar primeiro conteúdo", "new-content"));
}

function contentCard(content) {
  return '<article class="fresh-content-card"><div class="fresh-content-card__visual"><span>' + icon(contentIcon(content.content_type)) + '</span><small>' + safe(content.content_type || "Conteúdo") + '</small></div><div class="fresh-content-card__body"><p class="fresh-kicker">' + safe(content.age_group || "TODAS AS IDADES") + '</p><h3>' + safe(content.title) + '</h3><p>' + safe(content.description || "Sem descrição.") + '</p><div class="fresh-content-card__meta"><span>' + icon("clock-3") + safe(content.estimated_minutes || 30) + ' min</span><span>' + icon("circle-dot") + 'Rascunho</span></div>' +
    '<div class="fresh-card-actions fresh-card-actions--content">' + actionButton("Atribuir a um aluno", "send", "primary", 'data-action="assign-content" data-content-id="' + safe(content.id) + '"') +
    actionButton("Editar", "pencil", "ghost", 'data-action="edit-content-record" data-content-id="' + safe(content.id) + '"') +
    actionButton("Excluir", "trash-2", "danger", 'data-action="delete-content" data-content-id="' + safe(content.id) + '"') + '</div></div></article>';
}

function contentRow(content) {
  return '<button class="fresh-inline-row" type="button" data-action="assign-content" data-content-id="' + safe(content.id) + '"><span class="fresh-row-icon">' + icon(contentIcon(content.content_type)) + '</span><span><strong>' + safe(content.title) + '</strong><small>' + safe(content.content_type || "Conteúdo") + '</small></span>' + icon("send") + '</button>';
}

function parentPage(state, data) {
  const children = data.children || [];
  const assigned = data.assigned_contents || [];
  const lessons = data.lessons || [];
  const pedagogicalRecords = data.pedagogical_records || [];
  const pages = {
    home: () => parentHome(children, assigned, lessons, pedagogicalRecords),
    children: () => childrenPage(children),
    activities: () => assignedPage("Atividades", "Instruções e materiais enviados para seus filhos.", assigned),
    classes: () => lessonsPage("Aulas", "Veja a grade, o professor e o formato de cada encontro.", lessons, [], false),
    calendar: () => agendaPage(lessons, assigned),
    pedagogical: () => pedagogicalPage("Acompanhamento pedagógico", "Evolução publicada pelos professores para a família.", pedagogicalRecords, [], false),
    finance: () => emptyPage("Financeiro", "Somente cobranças reais aparecerão aqui.", "Nenhum pagamento disponível", "Mensalidades e comprovantes serão exibidos quando a integração financeira for ativada.", "wallet-cards", "", ""),
    reports: () => emptyPage("Relatórios", "Acompanhamento pedagógico claro e direto.", "Nenhum relatório publicado", "O professor publicará relatórios quando houver dados suficientes sobre a jornada.", "file-chart-column", "", ""),
    profile: () => profilePage(state)
  };
  return (pages[state.page] || pages.home)();
}

function parentHome(children, assigned, lessons, pedagogicalRecords) {
  return pageHeading("Acompanhe sem ficar no escuro", "Quando a escola vincular um aluno, toda a jornada aparecerá aqui.") +
    '<section class="fresh-dashboard"><article class="fresh-command-card fresh-command-card--family"><div><p class="fresh-kicker">ESPAÇO DA FAMÍLIA</p><h2>Clareza para acompanhar. Calma para deixar evoluir.</h2><p>Seu portal começa limpo. Apenas informações reais cadastradas pela escola serão exibidas.</p></div><span class="fresh-command-card__symbol">' + icon("heart-handshake") + '</span></article>' +
    '<div class="fresh-metrics">' + metric("Alunos vinculados", children.length, "users-round", "royal") + metric("Próximas aulas", lessons.filter(isUpcoming).length, "calendar-clock", "sky") + metric("Registros pedagógicos", pedagogicalRecords.length, "notebook-tabs", "ice") + '</div>' +
    (children.length ? '<div class="fresh-two-column"><article class="card card--pad fresh-list-card"><div class="card-label"><h3>Atividades recentes</h3><button class="text-button" data-page="activities">Ver todas</button></div>' + (assigned.length ? assigned.slice(0, 3).map(assignedContentRow).join("") : '<p class="fresh-muted">Nenhuma atividade atribuída ainda.</p>') + '</article><article class="card card--pad fresh-list-card"><div class="card-label"><h3>Próximas aulas</h3><button class="text-button" data-page="classes">Ver agenda</button></div>' + (lessons.filter(isUpcoming).length ? lessons.filter(isUpcoming).slice(0, 3).map(lessonCompactRow).join("") : '<p class="fresh-muted">Nenhuma aula agendada.</p>') + '</article></div>' : empty("heart-handshake", "Aguardando vínculo com um aluno.", "Informe o e-mail desta conta no campo de responsável do cadastro do aluno. Depois disso, atividades, aulas e registros pedagógicos aparecem automaticamente.", "", "")) + '</section>';
}

function studentPage(state, data) {
  const assigned = data.assigned_contents || [];
  const lessons = data.lessons || [];
  const pedagogicalRecords = data.pedagogical_records || [];
  const pages = {
    home: () => studentHome(assigned, state),
    trail: () => assignedPage("Minha trilha", "A trilha é construída com os conteúdos enviados pelo professor.", assigned),
    projects: () => assignedPage("Meus conteúdos", "Tudo que foi preparado especialmente para você.", assigned),
    classes: () => lessonsPage("Minhas aulas", "Datas, horários e acessos organizados em um só lugar.", lessons, [], false),
    calendar: () => agendaPage(lessons, assigned),
    pedagogical: () => pedagogicalPage("Meu acompanhamento", "Veja os feedbacks e os próximos passos publicados pelo professor.", pedagogicalRecords, [], false),
    achievements: () => emptyPage("Conquistas", "Conquistas representam evolução real.", "Sua primeira conquista está esperando", "Complete um conteúdo enviado pelo professor para começar sua coleção.", "trophy", "", ""),
    profile: () => profilePage(state)
  };
  return '<div class="fresh-student-space" data-vibe="' + safe(state.studentVibe || "curioso") + '">' + studentDecor() + '<div class="fresh-student-space__content">' + (pages[state.page] || pages.home)() + '</div></div>';
}

function studentDecor() {
  return '<div class="fresh-student-decor" aria-hidden="true"><span class="fresh-student-doodle fresh-student-doodle--one">' + icon("sparkles") + '</span><span class="fresh-student-doodle fresh-student-doodle--two">' + icon("code-2") + '</span><span class="fresh-student-doodle fresh-student-doodle--three">' + icon("gamepad-2") + '</span><i></i><i></i><i></i></div>';
}

function studentHome(assigned, state) {
  const vibe = state.studentVibe || "curioso";
  const vibeCopy = {
    curioso: "Hoje vale testar tudo e seguir a curiosidade.",
    focado: "Foco ligado. Uma ideia de cada vez, no seu ritmo.",
    ideias: "Ideias a mil? Joga todas na tela e vê o que acontece."
  }[vibe] || "Hoje vale testar tudo e seguir a curiosidade.";
  const promptIndex = Number(state.creativePromptIndex || 0) % studentCreativePrompts.length;
  return pageHeading("Seu universo criativo", "Entre, escolha sua vibe e transforme curiosidade em alguma coisa sua.") +
    '<section class="fresh-dashboard fresh-student-dashboard"><article class="fresh-student-hero"><div class="fresh-student-hero__copy"><span class="fresh-student-sticker">' + icon("zap") + ' MODO CRIAÇÃO: ON</span><p class="fresh-kicker">SEM PRESSÃO. COM IMAGINAÇÃO.</p><h2>' + (assigned.length ? "Tem conteúdo novo. Mas a ideia continua sendo sua." : "Enquanto a próxima missão não chega, sua criatividade não precisa esperar.") + '</h2><p id="student-vibe-copy">' + vibeCopy + '</p><div class="fresh-vibe-picker" aria-label="Escolha sua vibe para criar"><span>QUAL É A VIBE DE HOJE?</span><div>' +
    vibeButton("curioso", "sparkles", "Curioso", vibe) + vibeButton("focado", "target", "Focado", vibe) + vibeButton("ideias", "lightbulb", "Ideias a mil", vibe) + '</div></div></div>' +
    '<div class="fresh-student-hero__art"><div class="fresh-portal-ring fresh-portal-ring--outer" aria-hidden="true"></div><div class="fresh-portal-ring fresh-portal-ring--inner" aria-hidden="true"></div><button class="fresh-portal-core" type="button" data-action="shuffle-creative-prompt" aria-label="Sortear uma ideia criativa">' + icon("mouse-pointer-2") + '<strong>CLIQUE<br>E CRIE</strong></button><span class="fresh-hero-sticker fresh-hero-sticker--code" aria-hidden="true">&lt;/&gt;</span><span class="fresh-hero-sticker fresh-hero-sticker--wow" aria-hidden="true">WOW!</span></div></article>' +
    '<div class="fresh-student-marquee" aria-label="Manifesto criativo"><span>TESTAR</span><i></i><span>ERRAR</span><i></i><span>DESCOBRIR</span><i></i><span>CRIAR DO SEU JEITO</span></div>' +
    studentCreativePanel(promptIndex, assigned.length) +
    (assigned.length ? '<section><div class="fresh-section-label"><div><p class="fresh-kicker">CHEGOU PRA VOCÊ</p><h2>Suas próximas missões</h2></div><span>' + assigned.length + ' disponível' + (assigned.length === 1 ? "" : "is") + '</span></div><div class="fresh-content-grid">' + assigned.map(assignedContentCard).join("") + '</div></section>' : '') + '</section>';
}

function vibeButton(value, iconName, label, activeVibe) {
  return '<button class="fresh-vibe-button ' + (value === activeVibe ? "is-active" : "") + '" type="button" data-action="student-vibe" data-vibe="' + value + '" aria-pressed="' + (value === activeVibe ? "true" : "false") + '">' + icon(iconName) + '<span>' + label + '</span></button>';
}

function studentCreativePanel(promptIndex, assignedCount) {
  return '<article class="fresh-creative-lab"><div class="fresh-creative-lab__badge">' + icon("wand-sparkles") + '<span>IDEIA SURPRESA</span></div><div class="fresh-creative-lab__copy"><p class="fresh-kicker">AQUECIMENTO CRIATIVO</p><h3 id="student-creative-prompt" aria-live="polite">' + safe(studentCreativePrompts[promptIndex]) + '</h3><p>' + (assignedCount ? "Use essa ideia como aquecimento antes de abrir sua missão." : "Essa brincadeira é livre e não altera suas atividades na plataforma.") + '</p></div><button class="button button--dark fresh-shuffle-button" type="button" data-action="shuffle-creative-prompt"><span>Sortear outra</span>' + icon("shuffle") + '</button><div class="fresh-creative-lab__shape" aria-hidden="true"><span>?</span><i></i><i></i></div></article>';
}

function childrenPage(children) {
  return pageHeading("Meus filhos", "Alunos vinculados pelo e-mail do responsável.") + (children.length
    ? '<section class="fresh-student-grid">' + children.map((student) => '<article class="fresh-person-card"><div class="fresh-person-card__top"><span class="fresh-avatar">' + safe(initials(student.first_name + " " + student.last_name)) + '</span><span class="fresh-status">VINCULADO</span></div><h3>' + safe(student.first_name + " " + student.last_name) + '</h3><p>' + safe(student.course || "Curso ainda não definido") + '</p><small>' + safe(student.email || "Sem e-mail do aluno") + '</small></article>').join("") + '</section>'
    : empty("users-round", "Nenhum aluno vinculado", "Peça ao professor para informar o e-mail desta conta no cadastro do responsável pelo aluno.", "", ""));
}

function attendanceHub(students, structure) {
  const groups = structure.filter((item) => item.kind === "class_group");
  const online = groups.filter((item) => item.modality !== "presential");
  const presential = groups.filter((item) => item.modality === "presential");
  const actions = actionButton("Escola", "building-2", "ghost", 'data-action="new-academic-item" data-kind="school"') + actionButton("Curso", "book-open", "ghost", 'data-action="new-academic-item" data-kind="course"') + actionButton("Turma", "users-round", "ghost", 'data-action="new-academic-item" data-kind="class_group"') + actionButton("Aluno", "user-plus", "primary", 'data-action="new-student"');
  return pageHeading("Chamada e turmas", "Organize escolas, cursos e turmas para ensino online e presencial.", actions) + '<section class="fresh-structure-summary"><article><span>' + icon("building-2") + '</span><strong>' + structure.filter((item) => item.kind === "school").length + '</strong><small>Escolas</small></article><article><span>' + icon("book-open") + '</span><strong>' + structure.filter((item) => item.kind === "course").length + '</strong><small>Cursos</small></article><article><span>' + icon("users-round") + '</span><strong>' + groups.length + '</strong><small>Turmas</small></article><article><span>' + icon("graduation-cap") + '</span><strong>' + students.length + '</strong><small>Alunos</small></article></section><section class="fresh-modality-grid">' + modalityColumn("Online", "video", online, students, structure, "online") + modalityColumn("Presencial", "map-pin", presential, students, structure, "presential") + '</section>';
}

function modalityColumn(title, iconName, groups, students, structure, modality) {
  return '<section class="fresh-modality-column fresh-modality-column--' + modality + '"><header><span>' + icon(iconName) + '</span><div><p class="fresh-kicker">ENSINO ' + title.toUpperCase() + '</p><h2>' + title + '</h2></div><strong>' + groups.length + '</strong></header><div>' + (groups.length ? groups.map((group) => classGroupCard(group, students, structure)).join("") : '<div class="fresh-mini-empty">' + icon("users-round") + '<p>Nenhuma turma ' + title.toLowerCase() + ' criada.</p></div>') + '</div></section>';
}

function classGroupCard(group, students, structure) {
  const course = structure.find((item) => item.id === group.course_id);
  const school = structure.find((item) => item.id === group.school_id) || structure.find((item) => item.id === course?.school_id);
  const members = students.filter((student) => student.class_group_id === group.id);
  return '<article class="fresh-class-group"><div class="fresh-class-group__top"><span>' + icon(group.modality === "presential" ? "map-pin" : "video") + '</span><div><h3>' + safe(group.name) + '</h3><p>' + safe([school?.name, course?.name].filter(Boolean).join(" · ") || "Estrutura independente") + '</p></div></div><div class="fresh-class-group__meta"><span>' + icon("clock-3") + safe(group.schedule || "Horário a definir") + '</span><span>' + icon("users-round") + members.length + ' aluno' + (members.length === 1 ? "" : "s") + '</span></div>' + actionButton("Fazer chamada", "list-checks", "primary", 'data-action="take-attendance" data-group-id="' + safe(group.id) + '"') + '</article>';
}

function lessonsPage(title, subtitle, lessons, students, canCreate) {
  const action = canCreate ? actionButton("Agendar aula", "calendar-plus", "primary", 'data-action="new-lesson"') : "";
  const sorted = [...lessons].sort((a, b) => String(a.start_at || "").localeCompare(String(b.start_at || "")));
  return pageHeading(title, subtitle, action) + (sorted.length
    ? '<section class="fresh-lesson-list">' + sorted.map(lessonCard).join("") + '</section>'
    : empty("calendar-plus", "Nenhuma aula cadastrada", canCreate ? (students.length ? "Agende a primeira aula e ela aparecerá automaticamente para o aluno e seu responsável." : "Cadastre um aluno antes de agendar a primeira aula.") : "Quando o professor agendar um encontro, todos os detalhes aparecerão aqui.", canCreate && students.length ? "Agendar primeira aula" : "", canCreate && students.length ? "new-lesson" : ""));
}

function lessonCard(lesson) {
  const meetingUrl = safeUrl(lesson.meeting_url);
  return '<article class="card fresh-lesson-card"><div class="fresh-date-tile"><strong>' + safe(formatDay(lesson.start_at)) + '</strong><span>' + safe(formatMonth(lesson.start_at)) + '</span></div><div class="fresh-lesson-card__body"><div><p class="fresh-kicker">' + safe(lesson.status === "cancelled" ? "AULA CANCELADA" : "AULA AGENDADA") + '</p><h3>' + safe(lesson.title || "Aula New Code") + '</h3></div><div class="fresh-lesson-meta"><span>' + icon("clock-3") + safe(formatTime(lesson.start_at)) + ' · ' + safe(lesson.duration_minutes || 60) + ' min</span><span>' + icon("user-round") + safe(lesson.student_name || "Aluno") + '</span><span>' + icon(lesson.format === "online" ? "video" : "map-pin") + safe(lesson.format === "online" ? "Online" : (lesson.location || "Presencial")) + '</span></div>' + (lesson.notes ? '<p class="fresh-lesson-notes">' + safe(lesson.notes) + '</p>' : '') + '</div>' + (meetingUrl ? '<a class="button button--ghost" href="' + meetingUrl + '" target="_blank" rel="noopener noreferrer"><span>Entrar na aula</span>' + icon("external-link") + '</a>' : '') + '</article>';
}

function lessonCompactRow(lesson) {
  return '<div class="fresh-inline-row fresh-inline-row--static"><span class="fresh-row-icon">' + icon("calendar-clock") + '</span><span><strong>' + safe(lesson.title || "Aula New Code") + '</strong><small>' + safe(formatDateTime(lesson.start_at)) + ' · ' + safe(lesson.student_name || "Aluno") + '</small></span></div>';
}

function agendaPage(lessons, assigned = []) {
  const lessonItems = lessons.map((lesson) => ({
    kind: "lesson",
    date: lesson.start_at,
    title: lesson.title || "Aula New Code",
    subtitle: (lesson.student_name ? lesson.student_name + " · " : "") + formatTime(lesson.start_at),
    icon: "monitor-play"
  }));
  const dueItems = assigned.filter((item) => item.due_at).map((item) => ({
    kind: "assignment",
    date: item.due_at + "T23:59:00",
    title: item.title,
    subtitle: (item.student_name ? item.student_name + " · " : "") + "Entrega de atividade",
    icon: "clipboard-check"
  }));
  const items = [...lessonItems, ...dueItems].filter((item) => item.date).sort((a, b) => String(a.date).localeCompare(String(b.date)));
  return pageHeading("Agenda", "Aulas e prazos organizados em ordem cronológica.") + (items.length
    ? '<section class="fresh-agenda"><div class="fresh-agenda__legend"><span><i class="is-lesson"></i>Aula</span><span><i class="is-assignment"></i>Entrega</span></div>' + items.map((item) => '<article class="fresh-agenda-item fresh-agenda-item--' + item.kind + '"><div class="fresh-date-tile"><strong>' + safe(formatDay(item.date)) + '</strong><span>' + safe(formatMonth(item.date)) + '</span></div><span class="fresh-agenda-item__icon">' + icon(item.icon) + '</span><div><small>' + safe(formatWeekday(item.date)) + '</small><h3>' + safe(item.title) + '</h3><p>' + safe(item.subtitle) + '</p></div></article>').join("") + '</section>'
    : empty("calendar-days", "Sua agenda está livre", "Aulas agendadas e prazos de atividades aparecerão aqui automaticamente.", "", ""));
}

function pedagogicalPage(title, subtitle, records, students, canCreate) {
  const action = canCreate ? actionButton("Novo registro", "file-plus-2", "primary", 'data-action="new-pedagogical-record"') : "";
  const sorted = [...records].sort((a, b) => String(b.created_at || "").localeCompare(String(a.created_at || "")));
  return pageHeading(title, subtitle, action) + (sorted.length
    ? '<section class="fresh-pedagogical-grid">' + sorted.map(pedagogicalCard).join("") + '</section>'
    : empty("notebook-tabs", "Nenhum registro pedagógico", canCreate ? (students.length ? "Crie o primeiro acompanhamento com evolução, habilidades e próximos passos." : "Cadastre um aluno antes de criar o primeiro acompanhamento.") : "Quando o professor publicar um acompanhamento, ele aparecerá aqui.", canCreate && students.length ? "Criar primeiro registro" : "", canCreate && students.length ? "new-pedagogical-record" : ""));
}

function pedagogicalCard(record) {
  return '<article class="card fresh-pedagogical-card"><header><span class="fresh-avatar">' + safe(initials(record.student_name || "Aluno")) + '</span><div><p class="fresh-kicker">' + safe(record.period || "ACOMPANHAMENTO") + '</p><h3>' + safe(record.student_name || "Aluno") + '</h3></div><span class="badge badge--success">Publicado</span></header><div class="fresh-pedagogical-card__section"><strong>Evolução observada</strong><p>' + safe(record.summary || "Sem observações.") + '</p></div>' + (record.skills ? '<div class="fresh-pedagogical-card__section"><strong>Habilidades</strong><p>' + safe(record.skills) + '</p></div>' : '') + (record.next_steps ? '<div class="fresh-next-steps">' + icon("route") + '<div><strong>Próximos passos</strong><p>' + safe(record.next_steps) + '</p></div></div>' : '') + '</article>';
}

function parseDate(value) {
  const date = new Date(String(value || ""));
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDate(value) {
  const date = parseDate(String(value || "").length === 10 ? value + "T12:00:00" : value);
  return date ? new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date) : "Data a definir";
}

function formatDateTime(value) {
  const date = parseDate(value);
  return date ? new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(date) : "Horário a definir";
}

function formatDay(value) {
  const date = parseDate(value);
  return date ? String(date.getDate()).padStart(2, "0") : "--";
}

function formatMonth(value) {
  const date = parseDate(value);
  return date ? new Intl.DateTimeFormat("pt-BR", { month: "short" }).format(date).replace(".", "").toUpperCase() : "---";
}

function formatTime(value) {
  const date = parseDate(value);
  return date ? new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(date) : "--:--";
}

function formatWeekday(value) {
  const date = parseDate(value);
  return date ? new Intl.DateTimeFormat("pt-BR", { weekday: "long" }).format(date) : "";
}

function isUpcoming(lesson) {
  const date = parseDate(lesson.start_at);
  return date ? date.getTime() >= Date.now() : false;
}

function assignedPage(title, subtitle, assigned) {
  return pageHeading(title, subtitle) + (assigned.length ? '<section class="fresh-content-grid">' + assigned.map(assignedContentCard).join("") + '</section>' :
    empty("map", "Sua jornada ainda não começou.", "Os conteúdos serão organizados aqui depois que o professor fizer a primeira atribuição.", "", ""));
}

function assignedContentCard(content) {
  return '<article class="fresh-content-card fresh-content-card--assigned"><div class="fresh-content-card__visual"><span>' + icon(contentIcon(content.content_type)) + '</span><small>' + safe(content.content_type || "Conteúdo") + '</small></div><div class="fresh-content-card__body"><p class="fresh-kicker">' + safe(content.age_group || "SUA PRÓXIMA DESCOBERTA") + '</p><h3>' + safe(content.title) + '</h3><p>' + safe(content.description || "Conteúdo preparado para você.") + '</p><div class="fresh-content-card__meta"><span>' + icon("clock-3") + safe(content.estimated_minutes || 30) + ' min</span><span>' + icon("sparkles") + 'Disponível</span></div>' +
    (content.student_name ? '<div class="fresh-assignment-person">' + icon("user-round") + '<span>Para <strong>' + safe(content.student_name) + '</strong></span></div>' : '') +
    (content.due_at ? '<div class="fresh-assignment-due">' + icon("calendar-clock") + '<span>Entrega até ' + safe(formatDate(content.due_at)) + '</span></div>' : '') +
    (content.pdf_url ? '<div class="fresh-pdf-chip">' + icon("file-text") + '<span>' + safe(content.pdf_name || "Atividade em PDF") + '</span></div>' : '') +
    actionButton("Abrir conteúdo", "arrow-right", "primary", 'data-action="open-assigned-content" data-content-id="' + safe(content.id) + '" data-assignment-id="' + safe(content.assignment_id || "") + '"') + '</div></article>';
}

function assignedContentRow(content) {
  return '<button class="fresh-inline-row" type="button" data-action="open-assigned-content" data-content-id="' + safe(content.id) + '" data-assignment-id="' + safe(content.assignment_id || "") + '"><span class="fresh-row-icon">' + icon(content.pdf_url ? "file-text" : contentIcon(content.content_type)) + '</span><span><strong>' + safe(content.title) + '</strong><small>' + safe(content.student_name || (content.due_at ? "Entrega " + formatDate(content.due_at) : "Atividade disponível")) + '</small></span>' + icon("arrow-up-right") + '</button>';
}

export function assignedContentModal(content) {
  if (!content) return "";
  const resourceUrl = safeUrl(content.resource_url);
  const pdfUrl = safeUrl(content.pdf_url);
  return modalShell(safe(content.title), "Conteúdo preparado pelo seu professor.", '<div class="modal__body"><div class="fresh-content-focus"><span>' + icon(contentIcon(content.content_type)) + '</span><div><p class="fresh-kicker">' + safe(content.content_type || "CONTEÚDO") + '</p><p>' + safe(content.description || "Seu material estará disponível aqui.") + '</p></div></div>' +
    (content.assignment_instructions || content.instructions ? '<article class="fresh-instructions"><p class="fresh-kicker">INSTRUÇÕES DA ATIVIDADE</p><p>' + safe(content.assignment_instructions || content.instructions) + '</p></article>' : "") +
    (pdfUrl ? '<a class="fresh-pdf-download" href="' + pdfUrl + '" target="_blank" rel="noopener noreferrer"><span>' + icon("file-down") + '</span><div><strong>' + safe(content.pdf_name || "Atividade em PDF") + '</strong><small>Abrir o arquivo enviado pelo professor</small></div>' + icon("arrow-up-right") + '</a>' : '') +
    '<div class="detail-facts"><div class="detail-fact"><span>Duração estimada</span><strong>' + safe(content.estimated_minutes || 30) + ' minutos</strong></div><div class="detail-fact"><span>Faixa etária</span><strong>' + safe(content.age_group || "Livre") + '</strong></div></div></div><footer class="modal__footer">' +
    (resourceUrl ? '<a class="button button--ghost" href="' + resourceUrl + '" target="_blank" rel="noopener noreferrer"><span>Abrir material</span>' + icon("external-link") + '</a>' : "") +
    actionButton("Fechar", "check", "primary", 'data-action="close-overlay"') + '</footer>');
}

function adminPage(state, data) {
  const students = data.students || [];
  const contents = data.contents || [];
  const teachers = data.teachers || [];
  const lessons = data.lessons || [];
  const pedagogicalRecords = data.pedagogical_records || [];
  const academicStructure = data.academic_structure || [];
  const pages = {
    home: () => adminHome(students, contents, teachers),
    students: () => studentsPage(students, state.studentSearch),
    teachers: () => teachersPage(teachers),
    classes: () => lessonsPage("Aulas da escola", "Visualize e cadastre encontros para os alunos.", lessons, students, true),
    projects: () => contentsPage(contents),
    attendance: () => attendanceHub(students, academicStructure),
    calendar: () => agendaPage(lessons),
    pedagogical: () => pedagogicalPage("Pedagógico", "Acompanhamentos registrados pela equipe.", pedagogicalRecords, students, true),
    finance: () => emptyPage("Financeiro", "Nenhuma cobrança fictícia será exibida.", "Financeiro ainda não conectado", "Ative a integração de pagamentos para começar a registrar mensalidades.", "wallet-cards", "", ""),
    reports: () => emptyPage("Relatórios", "Indicadores surgem somente com dados reais.", "Nenhum dado para consolidar", "Relatórios serão gerados após os primeiros cadastros e atividades.", "file-chart-column", "", ""),
    settings: () => settingsPage(),
    profile: () => profilePage(state)
  };
  return (pages[state.page] || pages.home)();
}

function adminHome(students, contents, teachers) {
  return pageHeading("Central da New Code", "Configure a escola começando pelas pessoas e pelos conteúdos.", actionButton("Cadastrar aluno", "user-plus", "ghost", 'data-action="new-student"') + actionButton("Criar conteúdo", "plus", "primary", 'data-action="new-content"')) +
    '<section class="fresh-dashboard"><article class="fresh-command-card"><div><p class="fresh-kicker">BASE LIMPA</p><h2>Uma operação organizada desde o primeiro cadastro.</h2><p>Sem números inventados. Os indicadores serão construídos apenas com informações reais da escola.</p></div><span class="fresh-command-card__symbol">' + icon("layout-dashboard") + '</span></article>' +
    '<div class="fresh-metrics">' + metric("Alunos", students.length, "users-round", "royal") + metric("Professores", teachers.length, "graduation-cap", "sky") + metric("Conteúdos", contents.length, "library-big", "ice") + '</div>' +
    empty("blocks", "A estrutura está pronta para ser preenchida.", "Comece cadastrando alunos, professores e conteúdos. Cada nova informação atualizará os indicadores da coordenação.", "Cadastrar primeiro aluno", "new-student") + '</section>';
}

function teachersPage(teachers) {
  return pageHeading("Professores", "Somente a coordenação pode criar contas para a equipe.", actionButton("Cadastrar professor", "user-plus", "primary", 'data-action="new-teacher"')) +
    (teachers.length ? '<section class="fresh-student-grid">' + teachers.map(teacherCard).join("") + '</section>' :
      empty("graduation-cap", "Nenhum professor cadastrado", "Cadastre o primeiro professor. A plataforma criará uma senha temporária e enviará um link para que ele escolha uma nova senha.", "Cadastrar professor", "new-teacher"));
}

function teacherCard(teacher) {
  const fullName = ((teacher.first_name || "") + " " + (teacher.last_name || "")).trim();
  const teacherId = safe(teacher.id || "");
  return '<article class="fresh-person-card fresh-teacher-card"><div class="fresh-person-card__top"><span class="fresh-avatar">' + safe(initials(fullName)) + '</span><span class="fresh-status">PROFESSOR</span></div><h3>' + safe(fullName || "Professor") + '</h3><p>Conta criada pela coordenação</p><small>' + safe(teacher.email || "Sem e-mail") + '</small><div class="fresh-teacher-card__footer"><span>' + icon("shield-check") + ' Acesso protegido</span><div class="fresh-teacher-card__actions">' +
    actionButton("Editar", "pencil", "ghost", 'data-action="edit-teacher-record" data-teacher-id="' + teacherId + '"') +
    actionButton("Remover", "trash-2", "danger", 'data-action="delete-teacher" data-teacher-id="' + teacherId + '"') + '</div></div></article>';
}

function emptyPage(title, subtitle, emptyTitle, body, iconName, actionLabel, action) {
  return pageHeading(title, subtitle, actionLabel ? actionButton(actionLabel, "plus", "primary", 'data-action="' + action + '"') : "") +
    empty(iconName, emptyTitle, body, actionLabel, action);
}

function profilePage(state) {
  const profile = state.profile || {};
  const fullName = ((profile.first_name || "") + " " + (profile.last_name || "")).trim() || roleName(state.role);
  const avatar = '<span class="fresh-avatar fresh-avatar--large fresh-profile-photo"><span>' + safe(initials(fullName)) + '</span>' +
    (profile.photo_url ? '<img src="' + safe(profile.photo_url) + '" alt="Foto de perfil de ' + safe(fullName) + '">' : "") + '</span>';
  return pageHeading("Meu perfil", "Suas informações e preferências de acesso.") +
    '<section class="fresh-profile"><article class="fresh-profile__hero fresh-profile__hero--photo">' + avatar + '<div class="fresh-profile__identity"><p class="fresh-kicker">' + roleName(state.role).toUpperCase() + '</p><h2>' + safe(fullName) + '</h2><p>' + safe(profile.email || "Perfil protegido pela plataforma") + '</p></div><div class="fresh-profile__photo-actions">' +
    actionButton("Editar nome", "pencil", "ghost", 'data-action="edit-profile"') +
    '<small>Fotos ficam desativadas enquanto o projeto utiliza apenas o plano gratuito.</small></div></article>' +
    '<article class="card settings-list"><div class="setting-row"><div><strong>Aparência</strong><p>Alternar entre modo claro e modo escuro.</p></div><button class="switch ' + (state.theme === "dark" ? "is-on" : "") + '" type="button" data-action="toggle-theme" aria-label="Alternar tema" aria-pressed="' + String(state.theme === "dark") + '"></button></div><div class="setting-row"><div><strong>Alterar senha</strong><p>Receber um link seguro no seu e-mail cadastrado.</p></div>' + actionButton("Enviar link", "key-round", "ghost", 'data-action="request-password-change"') + '</div><div class="setting-row"><div><strong>Sair</strong><p>Voltar para a área de acesso.</p></div>' +
    actionButton("Sair", "log-out", "danger", 'data-action="logout"') + '</div></article></section>';
}

function settingsPage() {
  return pageHeading("Configurações", "Preferências gerais da plataforma.") +
    '<article class="card settings-list"><div class="setting-row"><div><strong>Cadastros públicos</strong><p>Somente alunos e responsáveis podem criar a própria conta.</p></div><span class="badge badge--success">Protegido</span></div><div class="setting-row"><div><strong>Contas de professor</strong><p>Criadas exclusivamente pela coordenação.</p></div><span class="badge badge--success">Restrito</span></div><div class="setting-row"><div><strong>Conteúdos dos alunos</strong><p>Exibidos somente depois de uma atribuição do professor ou da coordenação.</p></div><span class="badge badge--info">Controlado</span></div><div class="setting-row"><div><strong>Dados de demonstração</strong><p>Desativados. Somente registros reais são exibidos.</p></div><span class="badge">Desativado</span></div></article>';
}

export function profileFormModal(profile = null) {
  const record = profile || {};
  return modalShell("Editar perfil", "Atualize o nome exibido na plataforma. O e-mail de acesso não é alterado aqui.", '<form id="profile-form"><div class="modal__body"><div class="form-grid">' +
    field("profile-first-name", "first_name", "Nome", "text", "Seu nome", record.first_name) + field("profile-last-name", "last_name", "Sobrenome", "text", "Seu sobrenome", record.last_name) +
    '<div class="field field--full"><label for="profile-email">E-mail de acesso</label><input id="profile-email" type="email" value="' + safe(record.email || "") + '" disabled><small>Para trocar o e-mail, use o Firebase Authentication.</small></div></div><div class="login-error" id="profile-form-error"></div></div>' +
    '<footer class="modal__footer">' + actionButton("Cancelar", "", "ghost", 'data-action="close-overlay"') + actionButton("Salvar perfil", "check", "primary", 'data-action="save-profile"') + '</footer></form>');
}

export function studentFormModal(student = null, academicStructure = []) {
  const editing = Boolean(student?.id);
  const record = student || {};
  const groups = academicStructure.filter((item) => item.kind === "class_group");
  const groupOptions = groups.map((group) => '<option value="' + safe(group.id) + '"' + (record.class_group_id === group.id ? " selected" : "") + '>' + safe(group.name) + ' · ' + (group.modality === "presential" ? "Presencial" : "Online") + '</option>').join("");
  return modalShell(editing ? "Editar aluno" : "Cadastrar aluno", editing ? "Corrija os dados e salve as alterações." : "Preencha os dados que serão usados na busca e nas atribuições.", '<form id="student-form"><input type="hidden" name="record_id" value="' + safe(record.id || "") + '"><div class="modal__body"><div class="form-grid">' +
    field("student-first-name", "first_name", "Nome", "text", "Nome do aluno", record.first_name) + field("student-last-name", "last_name", "Sobrenome", "text", "Sobrenome do aluno", record.last_name) +
    '<div class="field field--full"><label for="student-email">E-mail do aluno</label><input id="student-email" name="email" type="email" value="' + safe(record.email || "") + '" required placeholder="aluno@email.com"><small>Use o mesmo e-mail da conta do aluno para liberar aulas, atividades e acompanhamento.</small></div>' +
    field("student-birth-date", "birth_date", "Data de nascimento", "date", "", record.birth_date) + field("student-course", "course", "Curso", "text", "Ex.: Construct 3", record.course) +
    '<div class="field field--full"><label for="student-class-group">Turma</label><select id="student-class-group" name="class_group_id"><option value="">Sem turma definida</option>' + groupOptions + '</select><small>As turmas são criadas na aba Chamada e podem ser online ou presenciais.</small></div>' +
    '<div class="field field--full fresh-form-divider"><span>RESPONSÁVEL 1</span></div><div class="field"><label for="student-guardian">Nome</label><input id="student-guardian" name="guardian_name" value="' + safe(record.guardian_name || "") + '" placeholder="Nome completo"></div>' +
    '<div class="field"><label for="student-guardian-relationship">Parentesco</label><select id="student-guardian-relationship" name="guardian_relationship"><option value="mother"' + (record.guardian_relationship === "mother" ? " selected" : "") + '>Mãe</option><option value="father"' + (record.guardian_relationship === "father" ? " selected" : "") + '>Pai</option><option value="guardian"' + (record.guardian_relationship === "guardian" ? " selected" : "") + '>Outro responsável</option></select></div><div class="field field--full"><label for="student-guardian-email">E-mail</label><input id="student-guardian-email" name="guardian_email" type="email" value="' + safe(record.guardian_email || "") + '" placeholder="responsavel1@email.com"><small>Se o e-mail ainda não existir, uma conta de responsável será criada.</small></div>' +
    '<div class="field field--full fresh-form-divider"><span>RESPONSÁVEL 2 (OPCIONAL)</span></div><div class="field"><label for="student-guardian-two">Nome</label><input id="student-guardian-two" name="guardian_two_name" value="' + safe(record.guardian_two_name || "") + '" placeholder="Nome completo"></div>' +
    '<div class="field"><label for="student-guardian-two-relationship">Parentesco</label><select id="student-guardian-two-relationship" name="guardian_two_relationship"><option value="father"' + (record.guardian_two_relationship === "father" ? " selected" : "") + '>Pai</option><option value="mother"' + (record.guardian_two_relationship === "mother" ? " selected" : "") + '>Mãe</option><option value="guardian"' + (record.guardian_two_relationship === "guardian" ? " selected" : "") + '>Outro responsável</option></select></div><div class="field field--full"><label for="student-guardian-two-email">E-mail</label><input id="student-guardian-two-email" name="guardian_two_email" type="email" value="' + safe(record.guardian_two_email || "") + '" placeholder="responsavel2@email.com"><small>Os dois responsáveis terão contas próprias e verão a mesma jornada do aluno.</small></div></div><div class="login-error" id="student-form-error"></div></div>' +
    '<footer class="modal__footer">' + actionButton("Cancelar", "", "ghost", 'data-action="close-overlay"') + actionButton(editing ? "Salvar alterações" : "Salvar aluno", "check", "primary", 'data-action="save-student"') + '</footer></form>');
}

export function guardianAccountsModal(result) {
  const accounts = result?.guardian_accounts || [];
  const rows = accounts.map((account) => '<article class="fresh-guardian-account"><span>' + icon(account.created ? "user-check" : "link") + '</span><div><strong>' + safe(account.name || "Responsável") + '</strong><p>' + safe(account.email) + '</p><small>' + (account.created ? (account.reset_email_sent ? "Conta criada · link para definir senha enviado" : "Conta criada · entregue a senha temporária abaixo") : "Conta existente vinculada ao aluno") + '</small>' + (account.temporary_password ? '<code>' + safe(account.temporary_password) + '</code>' : '') + '</div></article>').join("");
  return modalShell("Aluno e responsáveis cadastrados", "As contas da família já foram vinculadas no banco de dados.", '<div class="modal__body"><div class="fresh-guardian-accounts">' + rows + '</div><p class="fresh-credential-note">Cada responsável entra com o próprio e-mail. As atividades, os PDFs, as aulas e os registros pedagógicos do aluno ficarão disponíveis para ambos.</p></div><footer class="modal__footer">' + actionButton("Concluir", "check", "primary", 'data-action="close-overlay"') + '</footer>');
}

export function teacherFormModal(teacher = null) {
  const editing = Boolean(teacher?.id);
  const record = teacher || {};
  const note = editing
    ? "O e-mail de acesso permanece o mesmo para manter a conta do Firebase vinculada corretamente."
    : "Uma senha temporária será gerada e o professor receberá um link para escolher a própria senha.";
  return modalShell(editing ? "Editar professor" : "Cadastrar professor", "Apenas a coordenação pode alterar esta conta.", '<form id="teacher-form"><input type="hidden" name="record_id" value="' + safe(record.id || "") + '"><div class="modal__body"><div class="fresh-auth-note">' + icon("shield-check") + '<div><strong>Conta institucional protegida</strong><span>' + note + '</span></div></div><div class="form-grid">' +
    field("teacher-first-name", "first_name", "Nome", "text", "Nome do professor", record.first_name) + field("teacher-last-name", "last_name", "Sobrenome", "text", "Sobrenome do professor", record.last_name) +
    '<div class="field field--full"><label for="teacher-email">E-mail profissional</label><input id="teacher-email" name="email" type="email" autocomplete="off" value="' + safe(record.email || "") + '" required ' + (editing ? "readonly" : "") + ' placeholder="professor@email.com"><small>' + (editing ? "Para trocar este e-mail, atualize a conta no Firebase Authentication." : "Este e-mail será usado para entrar e recuperar a senha.") + '</small></div></div><div class="login-error" id="teacher-form-error"></div></div>' +
    '<footer class="modal__footer">' + actionButton("Cancelar", "", "ghost", 'data-action="close-overlay"') + actionButton(editing ? "Salvar alterações" : "Criar conta do professor", editing ? "check" : "user-plus", "primary", 'data-action="save-teacher"') + '</footer></form>');
}

export function teacherCredentialsModal(result) {
  const teacher = result?.teacher || {};
  const fullName = ((teacher.first_name || "") + " " + (teacher.last_name || "")).trim();
  const resetMessage = result?.reset_email_sent
    ? "Também enviamos um link para o professor escolher uma nova senha."
    : "O e-mail automático não foi enviado. Entregue a senha temporária e oriente o professor a usar “Esqueci minha senha”.";
  return modalShell("Professor cadastrado", "A conta já está pronta para entrar na plataforma.", '<div class="modal__body"><div class="fresh-created-account"><span>' + icon("badge-check") + '</span><div><p class="fresh-kicker">CONTA CRIADA</p><h3>' + safe(fullName || "Professor") + '</h3><p>' + safe(teacher.email || "") + '</p></div></div><div class="fresh-credential-box"><small>SENHA TEMPORÁRIA</small><code>' + safe(result?.temporary_password || "") + '</code><button class="button button--ghost" type="button" data-action="copy-teacher-password" data-password="' + safe(result?.temporary_password || "") + '"><span>Copiar senha</span>' + icon("copy") + '</button></div><p class="fresh-credential-note">' + resetMessage + '</p></div><footer class="modal__footer">' + actionButton("Concluir", "check", "primary", 'data-action="close-overlay"') + '</footer>');
}

export function contentFormModal(content = null) {
  const editing = Boolean(content?.id);
  const record = content || {};
  const contentTypes = ["Projeto", "Aula", "Desafio", "Material"].map((type) => '<option' + (record.content_type === type ? " selected" : "") + '>' + type + '</option>').join("");
  return modalShell(editing ? "Editar conteúdo" : "Criar conteúdo", editing ? "Corrija o material e salve as alterações." : "Monte um conteúdo para depois atribuir aos alunos certos.", '<form id="content-form"><input type="hidden" name="record_id" value="' + safe(record.id || "") + '"><div class="modal__body"><div class="form-grid">' +
    '<div class="field field--full"><label for="content-title">Título</label><input id="content-title" name="title" value="' + safe(record.title || "") + '" required placeholder="Ex.: Crie seu primeiro personagem"></div>' +
    '<div class="field"><label for="content-type">Tipo</label><select id="content-type" name="content_type" required><option value="">Selecione</option>' + contentTypes + '</select></div>' +
    '<div class="field"><label for="content-age">Faixa etária</label><input id="content-age" name="age_group" value="' + safe(record.age_group || "") + '" placeholder="Ex.: 9 a 12 anos"></div>' +
    '<div class="field"><label for="content-duration">Duração em minutos</label><input id="content-duration" name="estimated_minutes" type="number" min="5" max="600" value="' + safe(record.estimated_minutes || 30) + '"></div>' +
    '<div class="field field--full"><label for="content-description">Descrição</label><textarea id="content-description" name="description" required placeholder="O que o aluno vai criar ou aprender?">' + safe(record.description || "") + '</textarea></div>' +
    '<div class="field field--full"><label for="content-instructions">Instruções para o aluno</label><textarea id="content-instructions" name="instructions" placeholder="Explique os passos, o desafio ou o que deve ser entregue.">' + safe(record.instructions || "") + '</textarea></div>' +
    '<div class="field field--full"><label for="content-resource">Link do material</label><input id="content-resource" name="resource_url" type="url" value="' + safe(record.resource_url || "") + '" placeholder="https://…"><small>Opcional: vídeo, documento, atividade ou ambiente externo.</small></div></div><div class="login-error" id="content-form-error"></div></div>' +
    '<footer class="modal__footer">' + actionButton("Cancelar", "", "ghost", 'data-action="close-overlay"') + actionButton(editing ? "Salvar alterações" : "Salvar conteúdo", "check", "primary", 'data-action="save-content"') + '</footer></form>');
}

export function deleteRecordModal(kind, record) {
  const isStudent = kind === "student";
  const isTeacher = kind === "teacher";
  const recordId = safe(record?.id || "");
  const personName = safe(((record?.first_name || "") + " " + (record?.last_name || "")).trim());
  const label = isStudent || isTeacher ? personName : safe(record?.title || "este conteúdo");
  const title = isStudent ? "Excluir aluno" : isTeacher ? "Remover professor" : "Excluir conteúdo";
  const message = isStudent
    ? "O cadastro e todas as atribuições ligadas a este aluno serão removidos."
    : isTeacher
      ? "O acesso de professor será removido. Contas com alunos ou conteúdos vinculados precisam ser organizadas antes."
      : "O conteúdo e todas as atribuições enviadas aos alunos serão removidos.";
  return modalShell(title, "Esta ação não pode ser desfeita.", '<div class="modal__body"><div class="fresh-delete-warning"><span>' + icon("triangle-alert") + '</span><div><strong>Você deseja excluir “' + label + '”?</strong><p>' + message + '</p></div></div></div><footer class="modal__footer">' +
    actionButton("Cancelar", "", "ghost", 'data-action="close-overlay"') + actionButton("Excluir definitivamente", "trash-2", "danger", 'data-action="confirm-delete-' + kind + '" data-record-id="' + recordId + '"') + '</footer>');
}

export function assignContentModal(contents, selectedContentId, selectedStudentId) {
  const options = (contents || []).map((content) => '<option value="' + safe(content.id) + '" ' + (content.id === selectedContentId ? "selected" : "") + '>' + safe(content.title) + '</option>').join("");
  return modalShell("Atribuir conteúdo", "Pesquise o aluno por nome e sobrenome antes de confirmar.", '<form id="assign-form"><div class="modal__body"><div class="field"><label for="assign-content">Conteúdo</label><select id="assign-content" name="content_id" required><option value="">Selecione um conteúdo</option>' + options + '</select></div>' +
    '<div class="field"><label for="assign-student-search">Aluno</label><div class="search-box fresh-assignment-search">' + icon("search") + '<input id="assign-student-search" data-action="assignment-student-search" autocomplete="off" placeholder="Digite nome e sobrenome…"></div><input id="assign-student-id" name="student_id" type="hidden" value="' + safe(selectedStudentId || "") + '"><div id="assign-student-results" class="fresh-search-results"><p>Digite pelo menos 2 letras para pesquisar.</p></div></div>' +
    '<div class="field"><label for="assign-due-at">Prazo de entrega</label><input id="assign-due-at" name="due_at" type="date"></div>' +
    '<div class="field"><label for="assign-pdf-url">Link do PDF</label><input id="assign-pdf-url" name="pdf_url" type="url" placeholder="https://drive.google.com/…"><small>Opcional · use um link do Google Drive, OneDrive ou outro serviço gratuito e libere o acesso para aluno e responsáveis.</small></div>' +
    '<div class="field"><label for="assign-pdf-name">Nome do arquivo</label><input id="assign-pdf-name" name="pdf_name" placeholder="Ex.: atividade-de-logica.pdf"></div>' +
    '<div class="field"><label for="assign-instructions">Instruções para o aluno</label><textarea id="assign-instructions" name="assignment_instructions" required placeholder="Explique o que deve ser feito e entregue."></textarea></div>' +
    '<div class="fresh-auth-note">' + icon("eye") + '<div><strong>Visível para a família</strong><span>O responsável vinculado também verá as instruções, o prazo e o PDF.</span></div></div><div class="login-error" id="assign-form-error"></div></div>' +
    '<footer class="modal__footer">' + actionButton("Cancelar", "", "ghost", 'data-action="close-overlay"') + actionButton("Confirmar atribuição", "send", "primary", 'data-action="confirm-fresh-assignment"') + '</footer></form>');
}

export function lessonFormModal(students) {
  const options = (students || []).map((student) => '<option value="' + safe(student.id) + '">' + safe(student.first_name + " " + student.last_name) + '</option>').join("");
  return modalShell("Agendar aula", "O aluno e o responsável vinculado verão este encontro na agenda.", '<form id="lesson-form"><div class="modal__body"><div class="form-grid"><div class="field field--full"><label for="lesson-title">Título da aula</label><input id="lesson-title" name="title" required placeholder="Ex.: Lógica de movimento"></div><div class="field field--full"><label for="lesson-student">Aluno</label><select id="lesson-student" name="student_id" required><option value="">Selecione</option>' + options + '</select></div><div class="field"><label for="lesson-date">Data</label><input id="lesson-date" name="date" type="date" required></div><div class="field"><label for="lesson-time">Horário</label><input id="lesson-time" name="time" type="time" required></div><div class="field"><label for="lesson-duration">Duração</label><input id="lesson-duration" name="duration_minutes" type="number" min="15" max="480" value="60" required></div><div class="field"><label for="lesson-format">Formato</label><select id="lesson-format" name="format"><option value="online">Online</option><option value="presential">Presencial</option></select></div><div class="field field--full"><label for="lesson-meeting">Link da aula</label><input id="lesson-meeting" name="meeting_url" type="url" placeholder="https://…"><small>Opcional para aulas online.</small></div><div class="field field--full"><label for="lesson-location">Local</label><input id="lesson-location" name="location" placeholder="Sala ou endereço, se presencial"></div><div class="field field--full"><label for="lesson-notes">Orientações</label><textarea id="lesson-notes" name="notes" placeholder="Materiais necessários ou observações."></textarea></div></div><div class="login-error" id="lesson-form-error"></div></div><footer class="modal__footer">' + actionButton("Cancelar", "", "ghost", 'data-action="close-overlay"') + actionButton("Agendar aula", "calendar-check", "primary", 'data-action="save-lesson"') + '</footer></form>');
}

export function pedagogicalFormModal(students) {
  const options = (students || []).map((student) => '<option value="' + safe(student.id) + '">' + safe(student.first_name + " " + student.last_name) + '</option>').join("");
  return modalShell("Novo registro pedagógico", "O registro publicado ficará disponível para o aluno e seu responsável.", '<form id="pedagogical-form"><div class="modal__body"><div class="form-grid"><div class="field field--full"><label for="pedagogical-student">Aluno</label><select id="pedagogical-student" name="student_id" required><option value="">Selecione</option>' + options + '</select></div><div class="field field--full"><label for="pedagogical-period">Período</label><input id="pedagogical-period" name="period" required placeholder="Ex.: Setembro de 2026"></div><div class="field field--full"><label for="pedagogical-summary">Evolução observada</label><textarea id="pedagogical-summary" name="summary" required placeholder="Descreva participação, progresso e conquistas."></textarea></div><div class="field field--full"><label for="pedagogical-skills">Habilidades desenvolvidas</label><textarea id="pedagogical-skills" name="skills" placeholder="Ex.: raciocínio lógico, criatividade, autonomia."></textarea></div><div class="field field--full"><label for="pedagogical-next">Próximos passos</label><textarea id="pedagogical-next" name="next_steps" required placeholder="O que será trabalhado nas próximas aulas?"></textarea></div></div><div class="fresh-auth-note">' + icon("send") + '<div><strong>Publicação imediata</strong><span>Aluno e responsável receberão este acompanhamento assim que você salvar.</span></div></div><div class="login-error" id="pedagogical-form-error"></div></div><footer class="modal__footer">' + actionButton("Cancelar", "", "ghost", 'data-action="close-overlay"') + actionButton("Publicar registro", "send", "primary", 'data-action="save-pedagogical-record"') + '</footer></form>');
}

export function academicItemModal(kind, structure) {
  const schools = (structure || []).filter((item) => item.kind === "school");
  const courses = (structure || []).filter((item) => item.kind === "course");
  const labels = {
    school: ["Cadastrar escola", "A escola poderá reunir cursos online e presenciais."],
    course: ["Cadastrar curso", "Organize a proposta de ensino dentro de uma escola."],
    class_group: ["Cadastrar turma", "Defina o formato da turma e o acesso às aulas."]
  };
  const current = labels[kind] || labels.school;
  const schoolField = kind !== "school" ? '<div class="field field--full"><label for="academic-school">Escola</label><select id="academic-school" name="school_id" required><option value="">Selecione</option>' + schools.map((school) => '<option value="' + safe(school.id) + '">' + safe(school.name) + '</option>').join("") + '</select></div>' : '';
  const courseField = kind === "class_group" ? '<div class="field field--full"><label for="academic-course">Curso</label><select id="academic-course" name="course_id" required><option value="">Selecione</option>' + courses.map((course) => '<option value="' + safe(course.id) + '">' + safe(course.name) + '</option>').join("") + '</select></div>' : '';
  const modalityFields = kind === "class_group" ? '<div class="field"><label for="academic-modality">Formato</label><select id="academic-modality" name="modality"><option value="online">Online</option><option value="presential">Presencial</option></select></div><div class="field"><label for="academic-schedule">Dias e horários</label><input id="academic-schedule" name="schedule" placeholder="Ex.: Terças, 18h"></div><div class="field field--full"><label for="academic-meeting">Link da sala online</label><input id="academic-meeting" name="meeting_url" type="url" placeholder="https://…"></div>' : '';
  const addressField = kind === "school" ? '<div class="field field--full"><label for="academic-address">Endereço</label><input id="academic-address" name="address" placeholder="Endereço da unidade presencial"></div>' : '';
  return modalShell(current[0], current[1], '<form id="academic-form"><input type="hidden" name="kind" value="' + safe(kind) + '"><div class="modal__body"><div class="form-grid"><div class="field field--full"><label for="academic-name">Nome</label><input id="academic-name" name="name" required placeholder="Digite o nome"></div>' + schoolField + courseField + modalityFields + addressField + '<div class="field field--full"><label for="academic-description">Observações</label><textarea id="academic-description" name="description" placeholder="Informações importantes para a equipe."></textarea></div></div><div class="login-error" id="academic-form-error"></div></div><footer class="modal__footer">' + actionButton("Cancelar", "", "ghost", 'data-action="close-overlay"') + actionButton("Salvar", "check", "primary", 'data-action="save-academic-item"') + '</footer></form>');
}

export function attendanceFormModal(group, students) {
  const members = (students || []).filter((student) => student.class_group_id === group?.id);
  const rows = members.map((student) => '<div class="fresh-attendance-row" data-attendance-id="' + safe(student.id) + '"><span class="fresh-avatar">' + safe(initials(student.first_name + " " + student.last_name)) + '</span><div><strong>' + safe(student.first_name + " " + student.last_name) + '</strong><small>' + safe(student.course || "Aluno") + '</small></div><div class="attendance-options"><button class="attendance-option is-active" type="button" data-action="attendance-mark" data-value="present">Presente</button><button class="attendance-option" type="button" data-action="attendance-mark" data-value="absent">Falta</button><button class="attendance-option" type="button" data-action="attendance-mark" data-value="excused">Justificada</button></div></div>').join("");
  return modalShell("Chamada · " + safe(group?.name || "Turma"), group?.modality === "presential" ? "Turma presencial" : "Turma online", '<form id="attendance-form"><input type="hidden" name="group_id" value="' + safe(group?.id || "") + '"><div class="modal__body"><div class="field"><label for="attendance-date">Data da aula</label><input id="attendance-date" name="date" type="date" required value="' + new Date().toISOString().slice(0, 10) + '"></div><div class="fresh-attendance-list">' + (rows || '<div class="fresh-mini-empty"><p>Vincule alunos a esta turma antes de fazer a chamada.</p></div>') + '</div><div class="login-error" id="attendance-form-error"></div></div><footer class="modal__footer">' + actionButton("Cancelar", "", "ghost", 'data-action="close-overlay"') + (members.length ? actionButton("Salvar chamada", "check", "primary", 'data-action="save-attendance"') : '') + '</footer></form>');
}

export function studentSearchResults(students) {
  if (!students || !students.length) return '<p>Nenhum aluno encontrado com esse nome.</p>';
  return students.map((student) => '<button type="button" data-action="choose-assignment-student" data-student-id="' + safe(student.id) + '" data-student-name="' + safe(student.first_name + " " + student.last_name) + '"><span class="fresh-avatar">' + safe(initials(student.first_name + " " + student.last_name)) + '</span><span><strong>' + safe(student.first_name + " " + student.last_name) + '</strong><small>' + safe(student.email || student.course || "Aluno cadastrado") + '</small></span></button>').join("");
}

export function studentDetailDrawer(student, assignments) {
  if (!student) return "";
  const guardianNames = [student.guardian_name, student.guardian_two_name].filter(Boolean).join(" e ");
  return '<aside class="drawer" role="dialog" aria-modal="true" aria-labelledby="student-drawer-title"><header class="drawer__header"><div><p class="fresh-kicker">PERFIL DO ALUNO</p><h2 id="student-drawer-title">' + safe(student.first_name + " " + student.last_name) + '</h2></div><button class="icon-button" data-action="close-overlay" aria-label="Fechar">' + icon("x") + '</button></header><div class="drawer__body">' +
    '<article class="fresh-profile__hero"><span class="fresh-avatar fresh-avatar--large">' + safe(initials(student.first_name + " " + student.last_name)) + '</span><div><h3>' + safe(student.course || "Curso não definido") + '</h3><p>' + safe(student.email || "Sem e-mail") + '</p></div></article><div class="detail-facts"><div class="detail-fact"><span>Responsáveis</span><strong>' + safe(guardianNames || "Não informados") + '</strong></div><div class="detail-fact"><span>Data de nascimento</span><strong>' + safe(student.birth_date || "Não informada") + '</strong></div><div class="detail-fact"><span>Conteúdos atribuídos</span><strong>' + (assignments || []).length + '</strong></div></div><div style="height:18px"></div>' +
    '<div class="fresh-drawer-actions">' + actionButton("Atribuir conteúdo", "send", "primary", 'data-action="assign-content" data-student-id="' + safe(student.id) + '"') + actionButton("Editar aluno", "pencil", "ghost", 'data-action="edit-student-record" data-student-id="' + safe(student.id) + '"') + actionButton("Excluir aluno", "trash-2", "danger", 'data-action="delete-student" data-student-id="' + safe(student.id) + '"') + '</div></div></aside>';
}

function modalShell(title, subtitle, content) {
  return '<div class="modal modal--small fresh-modal" role="dialog" aria-modal="true" aria-labelledby="fresh-modal-title"><header class="modal__header"><div><h2 id="fresh-modal-title">' + title + '</h2><p>' + subtitle + '</p></div><button class="icon-button" type="button" data-action="close-overlay" aria-label="Fechar">' + icon("x") + '</button></header>' + content + '</div>';
}

function field(id, name, label, type, placeholder, value = "") {
  return '<div class="field"><label for="' + id + '">' + label + '</label><input id="' + id + '" name="' + name + '" type="' + type + '" value="' + safe(value || "") + '" required ' + (placeholder ? 'placeholder="' + placeholder + '"' : "") + '></div>';
}

function contentIcon(type) {
  const value = String(type || "").toLowerCase();
  if (value.includes("aula")) return "monitor-play";
  if (value.includes("desafio")) return "trophy";
  if (value.includes("material")) return "file-text";
  return "wand-sparkles";
}

function initials(name) {
  return String(name || "N").split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

function roleName(role) {
  return { student: "Aluno", parent: "Responsável", teacher: "Professor", admin: "Coordenação" }[role] || "Perfil";
}
