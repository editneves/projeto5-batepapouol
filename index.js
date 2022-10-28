//A cada 3 segundos o site deve re-carregar as mensagens do servidor para manter sempre atualizado
var meuInterval = setInterval(function() {
    console.log(pegarMessage());
}, 3000);
clearInterval(meuInterval);

function scrolar() {
    const element = document.querySelector('.container');
    element.scrollIntoView();
}

usuario()
conexao()

function usuario() {

    const requisicao = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", { name: "Ediane" });
    requisicao.then(Sucesso);
    requisicao.catch(Error);

    function Sucesso(resposta) {
        console.log(resposta);
    }
    function Error(erro) {
        console.log(erro);
    }
}

function conexao() {
    const request = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", { name: "Ediane" });
    request.then(certo);
    request.catch(Errado);

    function certo(resposta) {
        console.log(resposta);
    }
    function Errado(erro) {
        console.log(erro);
    }
}

const adicinarMessage = async () => {
    const dados =
    {
        from: 'Ediane',
        to: 'Todos',
        text: 'entra na sala...',
        type: "message"
    };

    try {
        const resp = await axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', dados);
        console.log(resp.data); // é o array da resposta
        renderizarLista();
    } catch (erro) {
        // Handle Error Here
        console.error(erro);
        if (erro.response.status === 422) {
            alert(erro.response.data.detalhes[0] + ', ' + erro.response.data.detalhes[1]);
        } else if (erro.response.status === 404) {
            alert("O recurso não foi encontrada no servidor");
        } else {
            alert("ocorreu um erro!");
        }
    }
};

adicinarMessage()

let message = []; //pegar mensagens que já foram salvas na internet e trazer pra cá
function pegarMessage() {

    //  mandar uma requisição GET para a URL, para buscar mensagens do servidor
    const promessa = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    // resposta do servidor
    promessa.then(respostaChegou); // agendando para a função respostaChegou ser esecuta quando a resposta do servidor chegar

    function respostaChegou(resposta) { // tratar sucesso
        //console.log(resposta);
        console.log(resposta.data);  // é o array da resposta
        message = resposta.data;
        //renderizar as mensagens vindas do servidor
        renderizarLista();
    }
}
pegarMessage()

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
}
