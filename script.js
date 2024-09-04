//TRAZ TODOS OS DADOS DO MENU
const menu = document.getElementById("menu")
//BOTÃO DE ABRIR CARRINHO
const cartBtn = document.getElementById("cart-btn")
//MODAL QUE APARECE A TELA DO CARRINHO
const cartModal = document.getElementById("cart-modal")
//LISTA OS ITENS ADICIONADOS NO CARRINHO
const cartItemsContainer = document.getElementById("cart-items")
//VALOR TOTAL DE TODOS OS ITENS ADICIONADOS NO CARRINHO
const cartTotal = document.getElementById("cart-total")
//BOTÃO DE FINALIZAR PEDIDO DENTRO DO CARRINHO
const checkoutBtn = document.getElementById("checkout-btn")
//BOTÃO PARA FECHAR A TELA DO CARRINHO
const closeModalBtn = document.getElementById("close-modal-btn")
//CONTADOR DE ITENS ADICIONADOS NO CARRINHO
const cartCounter = document.getElementById("cart-count")
//INPUT PARA ADICIONAR ENDEREÇO DO CLIENTE NO PEDIDO
const addressInput = document.getElementById("address")
//VALICAÇÃO SE O CLIENTE INSERIU UM ENDEREÇO NO INPUT DO PEDIDO
const addressWarn = document.getElementById("address-warn")

//CARRINHO VAZIO
let cart = [];

//FUNÇÃO QUE ABRE A TELA DO CARRINHO EM TELA
cartBtn.addEventListener("click", function () {

    //ATUALIZA OS ITENS ADICIONADOS NO CARRINHO
    updateCartModal();

    //ADICIONA A CLASSE DISPLAY: FLEX PARA SOBREPOR NA TELA
    cartModal.style.display = "flex"
})

//FUNÇÃO QUE FECHA O CARRINHO AO CLICAR FORA DA TELA
cartModal.addEventListener("click", function(event){

    //VALIDA SE O CLIQUE FOI FORA DA TELA DO CARRINHO, CASO TRUE, ELE FECHA A TELA DO CARRINHO
    if (event.target === cartModal) {

        //ADICIONA A CLASSE DISPLAY: NONE E PARA DE EXIBIR A TELA DO CARRINHO
        cartModal.style.display = "none"
    }
})

//FUNÇÃO QUE FECHA A TELA DO CARRINHO AO CLICAR NO BOTÃO "FECHAR"
closeModalBtn.addEventListener("click", function () {

    //ADICIONA A CLASSE DISPLAY: NONE AO CLICAR NO BOTÃO "FECHAR"
    cartModal.style.display = "none"
})

//FUNÇÃO QUE ARMAZENA A INFORMAÇÃO DE DESCRIÇÃO E PREÇO AO ADICIONAR ITEM NO CARRINHO
menu.addEventListener("click", function (event) {

    //VARIÁVEL QUE ARMAZENA O CLICK NO BOTÃO DE ADICIONAR NO CARRINHO
    let parentButton = event.target.closest(".add-to-cart-btn")

    //CASO SEJA CLICADO EM ALGUM BOTÃO DE ADICIONAR AO CARRINHO, ARMAZENA O DATA-NAME(NOME) E O DATA-PRICE(PREÇO) DO PRODUTO
    if (parentButton) {

        //VARIÁVEL NAME QUE ARMAZENA O NOME DO PRODUTO
        const name = parentButton.getAttribute("data-name")

        //VARIÁVEL PRICE QUE ARMAZENA O VALOR DO PRODUTO
        const price = parseFloat(parentButton.getAttribute("data-price"))

        //ADICIONA AS VARIÁVEIS À FUNÇÃO addToCart()
        addToCart(name, price)
    }

})

//FUNÇÃO PARA ADICIONAR ITENS NO CARRINHO
function addToCart(name, price) {

    //FAZ A VERIFICAÇÃO SE O ITEM JÁ EXISTE NO CARRINHO
    const existingItem = cart.find(item => item.name === name)

    //CASO JÁ EXISTA O ITEM ADICIONADO É SOMENTE ALTERADO A QUANTIDADE
    if (existingItem) {
        existingItem.quantify += 1;
    } else {
        //CASO NÃO EXISTA O ITEM NO CARRINHO, ADICIONA O NOME, PREÇO E QUANTIDADE AO CARRINHO
        cart.push({
            name,
            price,
            quantify: 1
        })
    }

    //ATUALIZA AS INFORMAÇÕES DO CARRINHO
    updateCartModal()
}

//FUNÇÃO QUE ATUALIZA OS ITENS DENTRO DO CARRINHO
function updateCartModal() {

    //CRIA UMA DIV VAZIA
    cartItemsContainer.innerHTML = "";
    //VARIÁVEL COM O TOTAL DO VALOR DOS ITENS ADICIONADOS NO CARRINHO
    let total = 0;

    //PERCORRER DENTRO DOS ITENS DO CARRINHO E TRAZER OS VALORES EM MOEDA BRASILEIRA R$
    cart.forEach(item => {

        //CRIA UMA NOVA DIV DENTRO DA TELA DO CARRINHO
        const cartItemElement = document.createElement("div");
        //CRIA CLASSES DENTRO DA DIV CRIADA ACIMA
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")
        //MONTA A DIV COM OS PRODUTOS ADICIONADOS NO CARRINHO(NOME, QUANTIDADE E PREÇO)
        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-bold">${item.name}</p>
                    <p>Qtd: ${item.quantify}</p>
                    <p mt=2>R$ ${item.price.toFixed(2)}</p>
                </div>

                <button class="bg-red-500 text-white px-4 py-1 rounded remove-from-cart-btn" data-name = "${item.name}">
                    Remover
                </button>
            </div>
        `

        //PEGA O VALOR DO ITEM E MULTIPLICA COM A QUANTIDADE, APÓS ISSO SOMA AO VALOR TOTAL JÁ ADICIONADO NO CARRINHO
        total += item.price * item.quantify

        cartItemsContainer.appendChild(cartItemElement)
    })

    //CONVERTE PARA MOEDA BRASILEIRA R$
    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    //CONTA QUANTOS ITENS TEM DENTRO DO CARRINHO ADICIONADOS
    cartCounter.innerHTML = cart.length;
}

//FUNÇÃO SABER SE FOI CLICADO NO BOTÃO "REMOVER" DO ITEM NO CARRINHO
cartItemsContainer.addEventListener("click", function (event) {

    //CASO CLIQUE EM "REMOVER" NO CARRINHO, O ITEM É REMOVIDO
    if (event.target.classList.contains("remove-from-cart-btn")) {
        const name = event.target.getAttribute("data-name")

        //FUNÇÃO QUE REMOVE ITEM DO CARRINHO
        removeItemCart(name);
    }
})

//FUNÇÃO PARA REMOVER ITEM DO CARRINHO
function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);

    if (index !== - 1) {
        const item = cart[index];

        if (item.quantify > 1) {
            item.quantify -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }
}

//FUNCÃO PARA VALIDAR SE O CLIENTE COLOCOU ENDEREÇO NO CARRINHO
addressInput.addEventListener("input", function (event) {

    //VARIÁVEL PARA GRAVAR ENDEREÇO DO CLIENTE
    let inputValue = event.target.value;

    //CASO O CLIENTE TENHA DIGITADO O ENDEREÇO, REMOVE O ALERTA DE FALTA DE ENDEREÇO NO PEDIDO
    if (inputValue !== "") {

        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
})

//BOTÃO DE FINALIZAR PEDIDO
checkoutBtn.addEventListener("click", function () {

    //VARIÁVEL PARA SABER SE O RESTAURANTE ESTÁ ABERTO OU NÃO
    const isOpen = checkRestaurantOpen();

    //CASO SEJA FLASE, OU SEJA FECHADO, É EXIBIDO UM ALERTA NA TELA DO USUÁRIO
    if (!isOpen) {

        //MENSAGEM DE AVISO QUE O RESTAURANTE ESTÁ FECHADO
        Toastify({
            text: "No momento, nossa hamburgueria está fechada. \nAtendimento de segunda a sábado, das 19:00 às 23:00.",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#ef4444",
            }
        }).showToast();
        //PARAR EXECUÇÃO CASO ESTEJA FECHADO
        return;
    }

    //CASO NÃO TENHO ITENS NO CARRINHO NÃO CONCLUA O PEDIDO
    if (cart.length === 0) return;

    //VALIDAÇÃO SE O CLIENTE ADICIONOU UM ENDEREÇO NO INPUT
    if (addressInput.value === "") {

        //REAPARECE A MENSAGEM PARA INSERIR O ENDEREÇO NA TELA
        addressWarn.classList.remove("hidden")
        //A BORDA DO INPUT FICA COM A COR VERMELHA ATÉ SER INSERIDO UM ENDEREÇO
        addressInput.classList.add("border-red-500")
        return;
    }

    //ENVIAR PEDIDO PARA O WHATSAPP WEB
    const cartItems = cart.map((item) => {
        return (
            //BUSCAR OS ITENS DO PEDIDO
            `\n\nProduto: ${item.name} \nQuantidade: ${item.quantify} \nValor: ${item.price.toFixed(2)}`
        )
    }).join("")

    //ITENS DAS VARIÁVEIS QUE FORAM ADICIONADOS NO CARRINHO
    const message = encodeURIComponent(cartItems)
    //TELEFONE VINCULADO AO RESTAURANTE
    const phone = "45988281454"

    //COMANDO PARA ABRIR A TELA DO WHATSAPP DO RESTAURANTE COM AS INFORMAÇÕES DO PRODUTO, QUANTIDADE, VALOR E ENDEREÇO DO CLIENTE
    window.open(`https://wa.me/${phone}?text=RESUMO DO PEDIDO:${message}Endereço de entrega: ${addressInput.value}`, "_blank")

    //APÓS ABRIR A TELA DO PEDIDO NO WHATSAPP, LIMPA TODO O CARRINHO(ARRAY)
    cart = [];
    //ATUALIZA OS ITENS ADICIONADOS NO CARRO, NESTE CASO, SERÁ ZERADO.
    updateCartModal();
})

//VERIFICA SE O RESTAURANTE ESTÁ ABERTO OU FECHADO, CONFORME HORÁRIO DE FUNCIONAMENTO
function checkRestaurantOpen() {

    const data = new Date();

    const hora = data.getHours();

    return hora >= 19 && hora < 23;

}

//VARIÁVEL QUE PEGA HORÁRIO DO DISPOSITIVO DO USUÁRIO
const spanItem = document.getElementById("date-span")
//VARIÁVEL QUE RETORNA TRUE OU FALSE SE ESTÁ ABERTO
const isOpen = checkRestaurantOpen();

//VALIDAÇÃO PARA ALTERAR O STATUS DO RESTAURANTE COMO "ABERTO" OU "FECHADO" NO CABEÇALHO
if (isOpen) {

    //CASO ESTEJA ABERTO VAI REMOVER A COR VERMELHA DE FUNDO
    spanItem.classList.remove("bg-red-500");
    //VAI ADICIONAR A COR VERDE DE FUNDO
    spanItem.classList.add("bg-green-500");
    //VAI MUDAR O TEXTO DE "FECHADO" PARA "ABERTO"
    spanItem.innerHTML = `
        <span>Aberto</span>
    `
//CASO ESTEJA "FECHADO"
} else {
    //VAI REMOVER O FUNDO VERDE
    spanItem.classList.remove("bg-green-500");
    // E VAI COLOCAR O FUNDO VERMELHO(POR PADRÃO A DESCRIÇÃO JÁ VEM COMO "FECHADO" NO HTML)
    spanItem.classList.add("bg-red-500");

}