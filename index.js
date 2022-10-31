let novoUsuario = prompt(" Digite o seu nome: ");
//let resposta1=0;//A cada 3 segundos o site deve re-carregar as mensagens do servidor para manter sempre atualizado
let inputMessage = '';
let message = []; //pegar mensagens que já foram salvas na internet e trazer pra cá

usuario()

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


function conexao() {
    const user = { name: novoUsuario }
    console.log(novoUsuario)
    axios.post(
        "https://mock-api.driven.com.br/api/v6/uol/status",
        user
    )
        .then(function (certo) {
            console.log(certo.data)
            if (certo.data == "OK") {
                //adicionarMessage()
                //pegarMessage() }
                console.log("oi")
            }
        })
        .catch(function (erro) {
            console.log(erro)
        })
}

function adicionarMessage() {
    inputMessage = document.querySelector('input').value;
    const novaMessage =
    {
        from: usuario,
        to: 'Todos',
        text: inputMessage,
        type: 'message'
    };
    //message.push(novaMessage);
    axios.post(
        'https://mock-api.driven.com.br/api/v6/uol/messages',
        novaMessage
    )
        .then(function (resp) {
            // resposta1= resp
            console.log(resp)
            console.log(inputMessage)
            renderizarLista();
        })
        .catch(function (errado) {
            console.log(errado)
            window.location.reload()
        })
}

function pegarMessage() {

    //  mandar uma requisição GET para a URL, para buscar mensagens do servidor
    const promessa = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    // resposta do servidor
    promessa.then(respostaChegou); // agendando para a função respostaChegou ser esecuta quando a resposta do servidor chegar

    function respostaChegou(resposta) { // tratar sucesso
        console.log(resposta.data);  // é o array da resposta
        message = resposta.data;
        //renderizar as mensagens vindas do servidor
        renderizarLista();
    }
}
function renderizarLista() {

    const lista = document.querySelector('ul');

    lista.innerHTML = '';
    //0: {from: 'asfasf', to: 'Todos', text: 'entra na sala...', type: 'status', time: '05:07:57'}
    for (let i = 0; i < message.length; i++) {

        let item = message[i];

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
        } else if (item.type === "private_message") {
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
    scrolar()
}

function scrolar() {
    const elementoQueQueroQueApareca = document.getElementById("scrol");
    elementoQueQueroQueApareca.scrollIntoView();
}
