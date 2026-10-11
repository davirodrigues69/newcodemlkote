# New Code — Plataforma Educacional

Portal responsivo da New Code para alunos, responsáveis, professores e coordenação. A aplicação usa Firebase Authentication e Cloud Firestore para contas, cadastros, conteúdos e atribuições. PDFs podem ser compartilhados por links HTTPS externos sem exigir o plano Blaze.

## O que já funciona

- cadastro público somente para alunos e responsáveis;
- login por e-mail e senha e recuperação de senha;
- coordenação exclusiva definida pelo perfil administrativo protegido no Firestore;
- criação de contas de professor somente pela coordenação;
- cadastro, busca por nome e sobrenome, edição e exclusão de alunos;
- criação, edição, exclusão e atribuição de conteúdos;
- atribuição de atividades com instruções específicas, prazo e link de PDF;
- módulo de aulas com data, horário, formato online/presencial e link de acesso;
- agenda automática de aulas e entregas para aluno, professor e responsáveis;
- acompanhamento pedagógico com evolução, habilidades e próximos passos;
- área de chamada com cadastro de escolas, cursos e turmas separadas entre online e presencial;
- cadastro do aluno com até dois responsáveis, contas próprias e vínculo automático por e-mail;
- responsáveis visualizam atividades, PDFs, aulas, agenda e registros pedagógicos dos alunos vinculados;
- edição do perfil;
- áreas vazias honestas para módulos que ainda não possuem dados reais;
- experiência responsiva, temas claro/escuro e redução de movimento;
- publicação automática pelo GitHub Pages.

## Publicar no GitHub Pages

1. Crie um repositório no GitHub e envie todos os arquivos deste projeto.
2. No repositório, abra **Settings > Pages**.
3. Em **Build and deployment > Source**, escolha **GitHub Actions**.
4. Envie uma alteração para a branch `main` ou execute o fluxo **Publicar New Code** na aba **Actions**.
5. Copie o domínio publicado e adicione-o em **Firebase Authentication > Settings > Authorized domains**.

O fluxo em `.github/workflows/pages.yml` valida, gera e publica o site automaticamente.

## Ativar o Firebase

Antes de receber usuários reais, conclua o checklist de [FIREBASE_SETUP.md](FIREBASE_SETUP.md). As regras em `firebase/firestore.rules` fazem parte da segurança do produto e precisam estar publicadas no Firebase. O arquivo `firebase/storage.rules` fica reservado para uma futura ativação do Storage.

A configuração Web visível no navegador não concede acesso aos registros. A autorização é aplicada pelas regras publicadas no Firebase. Dados de demonstração e credenciais de teste não fazem parte do pacote de produção.

Se o Firebase CLI estiver instalado e autenticado, as regras podem ser publicadas com:

```bash
firebase deploy --only hosting,firestore:rules
```

## Desenvolvimento local

```bash
npm run dev
```

Validação e geração da versão de produção:

```bash
npm run check
npm run build
```

O resultado estático para hospedagens como GitHub Pages é criado em `dist/client`.

## Como funciona o vínculo familiar

Ao cadastrar ou editar um aluno, informe nome, parentesco e e-mail de até dois responsáveis. Para um e-mail novo, a plataforma cria uma conta de responsável no Firebase Authentication, grava o perfil em `profiles/{UID}` e envia um link para definição de senha. Se a conta já existir, o mesmo e-mail é usado para vinculá-la ao aluno.

Atividades, aulas e registros pedagógicos recebem uma cópia da lista de e-mails vinculados. As regras do Firestore usam essa lista para liberar somente os dados daquele aluno aos responsáveis. O acesso ao PDF também depende das permissões definidas no serviço externo onde o arquivo foi hospedado.
