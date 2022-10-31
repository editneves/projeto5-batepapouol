let novoUsuario = prompt(" Digite o seu nome: "); // entrada do nome do usuária que ira entrar no chat
let inputMessage = ''; // declaração da variavel responsavel por receber a mensagem que será digitada no chat

usuario()
pegarMessage()

// a função usuario envia para a API o nome do usuário que vai entrar no batepapo, caso o usuário já esteja online 
// solicita um novo nome de usuário e chama a função de conexão
function usuario() {

    const user = { name: novoUsuario }

    axios.post(
        "https://mock-api.driven.com.br/api/v6/uol/participants",
        user
    )
        .then(setTimeout(conexao(), 100000000))
        .catch(function (error) {
            console.log(error)
            if (error.response.status === 400) {
                novoUsuario = prompt(" Erro 400 (Bad Request), já existe um usuário online com esse nome,por favor informe um novo usuário ");
                usuario(novoUsuario)
            } else if (error.response.status === 404) {
                alert("O recurso não foi encontrada no servidor");
            } else {
                alert("ocorreu um erro!");
            }
        })
}

// a função conexão matem o usuário conectado, envia os dados para API a cada 5 segundos
function conexao() {
    const user = { name: novoUsuario }
    //console.log(novoUsuario)
    axios.post(
        "https://mock-api.driven.com.br/api/v6/uol/status",
        user
    )
        .then(function (certo) {
            setInterval(conexao(), 5000);
            console.log(certo.data)
        })
        .catch(function (erro) {
            console.log(erro)
            setInterval(conexao(), 5000);
        })
}

function adicionarMessage() {
    inputMessage = document.querySelector('input').value;
    const novaMessage =
    {
        from: novoUsuario,
        to: 'Todos',
        text: inputMessage,
        type: 'message'
    };

    // teste de envio privado -- nome do destinatário igual ao nome do usuário que está usando o chat

    // {
    //     from: novoUsuario,
    //     to: novoUsuario,
    //     text: inputMessage,
    //     type: 'private_message'
    // };

    axios.post(
        'https://mock-api.driven.com.br/api/v6/uol/messages',
        novaMessage
    )
        .then(function (resp) {
            //console.log(resp)
            //console.log(inputMessage)
            setTimeout(pegarMessage(), 100000000)
        })
        .catch(function (errado) {
            console.log(errado)
            window.location.reload()
        })
}

// a função pegarMessage busca as mensagens na API  e depois chama a função renderizarLista passando
// o resultado como parametro, assim as mensagem são atualizadas na tela com as mensagens novas que vem da API
function pegarMessage() {

    //  mandar uma requisição GET para a URL, para buscar mensagens do servidor
    const promessa = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    // resposta do servidor
    promessa.then(respostaChegou); // agendando para a função respostaChegou ser executada quando a resposta 
    //do servidor chegar

    function respostaChegou(resposta) { // tratar sucesso
        console.log(resposta.data);  // é o array da resposta
        message = resposta.data;
        //renderizar as mensagens vindas do servidor
        renderizarLista(resposta.data);
    }
}

// a função renderizarLista atualiza as mensagens na tela a cada 3 segundos
function renderizarLista(message) {

    const lista = document.querySelector('ul');

    lista.innerHTML = '';
    //0: {from: 'asfasf', to: 'Todos', text: 'entra na sala...', type: 'status', time: '05:07:57'}
    for (let i = 0; i < message.length; i++) {

        let item = message[i];

        // Mensagens de status (Entrou ou Saiu da sala): com fundo cinza
        if (item.text === 'entra na sala...' || item.text === 'sai da sala...') {
            lista.innerHTML += `
                    <li class="message-log-in-go-out">
                        <p>
                            <span>(${item.time}) </span>
                            <span class="negrito">${item.from} </span>
                            <span>${item.text}</span>
                        </p>
                    </li>
                    `;
        //Mensagens reservadas (Reservadamente): com fundo rosa
        } else if (item.type === "private_message" && item.from===item.to) {
            lista.innerHTML += `
                    <li class="message-privately">
                        <p>
                            <span>(${item.time}) </span>
                            <span class="negrito">${item.from}</span> reservadamente para
                            <span class="negrito">${item.to}</span>
                            <span>${item.text}</span>
                        </p>
                    </li>
                    `;
        // Mensagens normais: com fundo branco
        } else {
            lista.innerHTML += `
                    <li class="message-normal">
                        <p>
                            <span>(${item.time}) </span>
                            <span class="negrito">${item.from}</span> para
                            <span class="negrito">${item.to}</span>
                            <span>${item.text}</span>
                        </p>
                    </li>
                    `;
        }
    }
    // o site re-carregar as mensagens do servidor a cada 3 segundos para manter sempre atualizado
    setInterval(pegarMessage(), 3000);
    // uso da função scrollIntoView, para o chat ter rolagem automática 
    scrolar()
    
}

// uso da função scrollIntoView, para o chat ter rolagem automática 
function scrolar() {
    const elementoQueQueroQueApareca = document.getElementById("scrol");
    elementoQueQueroQueApareca.scrollIntoView();
}
C:\Users\ruann\dev\ediane\Driven Curso\Projeto #05 - Bate-Papo UOLcd 