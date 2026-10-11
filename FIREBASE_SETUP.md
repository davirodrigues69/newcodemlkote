# Ativação do Firebase — New Code

O site já está conectado ao projeto Firebase `newcodemlkote`. Para liberar o uso em produção, conclua estas etapas no Console do Firebase:

1. Em **Authentication > Sign-in method**, ative **E-mail/senha**.
2. Em **Authentication > Settings > Authorized domains**, adicione o domínio onde o site será publicado, incluindo `new-code-plataforma.lucascr.chatgpt.site` e o domínio do GitHub Pages quando ele existir.
3. Crie o banco **Cloud Firestore** em modo de produção.
4. Em **Firestore Database > Rules**, publique o conteúdo de `firebase/firestore.rules`.
5. O **Storage** é opcional e permanece desativado no plano gratuito atual. Ative-o somente no futuro, se desejar upload direto de arquivos.
6. Confirme que a conta da coordenação existe em **Authentication > Users** e que o documento correspondente em `profiles/{UID}` possui o mesmo `user_id` e `role: "admin"`. A plataforma não cria nem promove administradores pelo navegador.
7. Em **App Check**, registre o aplicativo Web com **reCAPTCHA Enterprise**, acompanhe as métricas e depois ative a aplicação obrigatória para o Firestore.
8. No Google Cloud Console, restrinja a chave Web aos domínios oficiais da New Code e somente às APIs Firebase utilizadas.
9. Teste o envio de recuperação de senha. Se necessário, personalize o remetente e o texto em **Authentication > Templates**.

As regras incluídas mantêm os dados protegidos por autenticação, validam campos imutáveis e separam as permissões de alunos, professores e coordenação. O arquivo de configuração Web do Firebase identifica o projeto e necessariamente aparece no navegador; ele não é uma senha. Nunca coloque chaves de conta de serviço, credenciais do Admin SDK ou segredos privados nos arquivos do site.

O cadastro público aceita somente alunos e responsáveis. As contas de professor são criadas pela coordenação na área **Professores**, com senha temporária forte e envio automático de um link de redefinição. Nenhuma nova conta pode se promover para coordenação pelo site. Publique sempre a versão mais recente de `firebase/firestore.rules`.

Os conteúdos atribuídos são copiados para o documento individual de atribuição. Assim, alunos recebem somente o material destinado ao próprio e-mail, sem permissão para abrir diretamente a coleção completa de conteúdos.

O cadastro de aluno aceita até dois responsáveis. Quando o e-mail ainda não está no Authentication, o navegador cria uma conta separada de perfil `parent`, grava o documento correspondente em `profiles/{UID}` e envia um link de redefinição de senha. Mantenha o template de recuperação habilitado e use sempre o mesmo e-mail no cadastro do aluno e no acesso do responsável.

No plano gratuito, os PDFs são compartilhados por link HTTPS informado na atribuição. Configure no Google Drive, OneDrive ou serviço equivalente a permissão adequada para que aluno e responsáveis consigam abrir o arquivo. O link só aparece dentro da atividade atribuída, mas as permissões finais do arquivo pertencem ao serviço externo.

Ao remover um professor pela plataforma, o perfil e as permissões administrativas são removidos imediatamente. Para apagar também o registro de login ou reutilizar o mesmo e-mail em outra conta, exclua o usuário correspondente em **Authentication > Users**.
