# mini-proj2
[PWA] Tarefa 3.2: Mini-projeto - desenvolvimento do front-end

A tarefa 3.2 corresponde ao desenvolvimento do front-end que visa complementar
o projeto apresentado no livro recomendado, Projeto Web Conference.

## Objetivos
Criar as páginas de gestão para as entidades `Voluntários` e `Membros do Comité Científico`

## Trabalho desenvolvido
Partindo do esqueleto do projeto apresentado na bibliografia da disciplina, foram revistas as páginas existentes e criadas novas páginas para as entidades `Conferências`, `Voluntários` e `Membros do Comité Científico`.

As conferências foram expandidas sendo possível criar novas conferências e definir os seus oradores, sponsors, membros do comité, tarefas a realizar e o(s) respetivo(s) voluntário(s), e gerir a lista de participantes.

### Notas

Todos os pedidos estão ser feitos baseados na API original do livro até ao commit [cb62175](https://github.com/ejgr-mtsiw/mini-proj2/commit/cb62175edd0e8e0989cd87d62184c44463f5314e) , sendo os dados das novas entidades simuladas recorrendo a arrays.

A partir do commit [cb62175](https://github.com/ejgr-mtsiw/mini-proj2/commit/cb62175edd0e8e0989cd87d62184c44463f5314e) , todos os pedidos são feitos recorrendo à API desenvolvida no (mini-proj3), que expandiu a API do livro, criando os endpoints necessários para as novas entidades criadas.

A página principal corresponde apenas a uma conferência (`idConference = 1`) mas alterando esta constante no ficheiro `js/webconf.js` é possível obter os dados da conferência correspondente (se existir), isto permite definir várias páginas de entrada para diferentes conferências utilizando o mesmo back-office.
