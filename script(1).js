const bananaPriceUnit = 1;
const laranjaPriceUnit = 1.5;
const macaPriceUnit = 1;
const peraPriceUnit = 1.7;


const bananaPriceKilo = 5;
const laranjaPriceKilo = 8;
const macaPriceKilo = 6;
const peraPriceKilo = 8;

const fruitPrices = {
    "banana": {
        unit: bananaPriceUnit,
        kilo: bananaPriceKilo
    },
    "laranja": {
        unit: laranjaPriceUnit,
        kilo: laranjaPriceKilo
    },
    "maca": {
        unit: macaPriceUnit,
        kilo: macaPriceKilo
    },
    "pera": {
        unit: peraPriceUnit,
        kilo: peraPriceKilo
    }
};
let totalKilo = 0
let total = 0;

// Função de add ao carrinho por unidade
function addToCart() {
    const fruitSelect = document.getElementById('fruit');
    const selectedOption = fruitSelect.options[fruitSelect.selectedIndex];
    const fruitName = selectedOption.value.toLowerCase();
    const fruitPrice = fruitPrices[fruitName].unit;
    const quantity = parseInt(document.getElementById('quantity').value);

    if (quantity <= 0) {
        alert("Quantidade Inválida!");
        return;
    }

    let cartItem = null;
    const cart = document.getElementById('cart');

    // checa se a fruta tá no carrinho
    for (let i = 0; i < cart.children.length; i++) {
        const currentItem = cart.children[i];
        if (currentItem.dataset.fruitName === fruitName) {
            cartItem = currentItem;
            break;
        }
    }

    //atualiza o item no carrinho
    if (cartItem) {
        const existingQuantity = parseInt(cartItem.querySelector('.item-quantity').textContent);
        const newQuantity = existingQuantity + quantity;
        cartItem.querySelector('.item-details').textContent = `${newQuantity}x ${fruitName} - R$ ${(fruitPrice * newQuantity).toFixed(2)}`;
        cartItem.querySelector('.item-quantity').textContent = newQuantity;
        total += (fruitPrice * quantity);
    } else { //cria um novo item no carrinho
        cartItem = document.createElement('li');
        cartItem.dataset.fruitName = fruitName;
        cartItem.innerHTML = `
            <span class="item-details">${quantity}x ${fruitName} - R$ ${(fruitPrice * quantity).toFixed(2)}</span>
            <span class="item-quantity" style="display: none;">${quantity}</span>
            <input type="number" class="remove-quantity" value="1" min="1" />
            <button onclick="removeFromCart(this)">Remover</button>`;
        cart.appendChild(cartItem);
        total += fruitPrice * quantity;
    }

    document.getElementById('total').textContent = total.toFixed(2);
}

// Função para remover itens do carrinho unitário
function removeFromCart(button) {
    const cartItem = button.parentNode;
    const fruitName = cartItem.dataset.fruitName;
    const fruitPrice = fruitPrices[fruitName].unit;
    const removeQuantity = parseInt(cartItem.querySelector('.remove-quantity').value);
    let currentQuantity = parseInt(cartItem.querySelector('.item-quantity').textContent);

    //Verifica se o valor é positivo
    if (removeQuantity <= 0) {
        alert("A quantidade para remover deve ser positiva.");
        return;
    }

    // Verifica se a quantidade a ser removida é maior que a quantidade atual
    if (removeQuantity >= currentQuantity) {
        total -= fruitPrice * currentQuantity;
        cartItem.remove(); // remove o item do carrinho caso seja maior
    } else { // Atualiza a quantidade atual e o total caso não seja maior
        currentQuantity -= removeQuantity;
        cartItem.querySelector('.item-details').textContent = `${currentQuantity}x ${fruitName} - R$ ${(fruitPrice * currentQuantity).toFixed(2)}`;
        cartItem.querySelector('.item-quantity').textContent = currentQuantity;
        total -= fruitPrice * removeQuantity;  // Atualiza o total com base na quantidade removida
    }

    document.getElementById('total').textContent = total.toFixed(2);  // Atualiza o total no carrinho
}

// Função para remover acentos (evitar erro com Maçã e Pêra)
function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Função de Adicionar ao Carrinho por kilograma
function addToCartKilo() {
    const fruitSelect = document.getElementById('fruitKilo');
    let fruitName = fruitSelect.value.toLowerCase(); // Use o valor diretamente

    // remove acentos do nome da fruta para garantir a puxada correta
    fruitName = removeAccents(fruitName);

    // puxa o preço do objeto
    const fruitPrice = fruitPrices[fruitName].kilo;
    //converte para kilogramas
    const quantityKilo = parseInt(document.getElementById('quantityKilo').value) / 1000;

    //verifica se o valor é positivo
    if (quantityKilo <= 0) {
        alert("A quantidade para remover deve ser positiva.");
        return;
    }

    let cartItem = null;
    const cartKilo = document.getElementById('cartKilo');
    // verifica se a fruta já está no carrinho
    for (let i = 0; i < cartKilo.children.length; i++) {
        const currentItem = cartKilo.children[i].textContent;
        if (currentItem.includes(fruitName)) {
            cartItem = cartKilo.children[i];
            break;
        }
    }
    // atualiza o item no carrinho (mesma ideia do por unidade)
    if (cartItem) {
        const existingQuantity = parseFloat(cartItem.textContent.split('x ')[0]);
        const newQuantity = existingQuantity + quantityKilo;
        cartItem.textContent = `${newQuantity.toFixed(3)}kg de ${fruitName} - R$ ${(fruitPrice * newQuantity).toFixed(2)}`;
        totalKilo += fruitPrice * quantityKilo;
    } else {
        cartItem = document.createElement('li');
        cartItem.textContent = `${quantityKilo.toFixed(3)}kg de ${fruitName} - R$ ${(fruitPrice * quantityKilo).toFixed(2)}`;
        cartKilo.appendChild(cartItem);
        totalKilo += fruitPrice * quantityKilo;
    }
    document.getElementById('totalKilo').textContent = totalKilo.toFixed(2);
}
// Muda a calculadora ao selecionar no dropdown
function changeCalculator() {
    const calculatorType = document.getElementById('calculatorType').value;

    if (calculatorType === 'unit') { //Mostra a calculadora por unidade
        document.getElementById('unitCalculator').style.display = 'block';
        document.getElementById('kiloCalculator').style.display = 'none';
    } else if (calculatorType === 'kilo') { //Mostra a calculadora por kilograma
        document.getElementById('unitCalculator').style.display = 'none';
        document.getElementById('kiloCalculator').style.display = 'block';
    }
}
// Função limpar o carrinho
function clearCart() {
    document.getElementById('cart').innerHTML = '';
    document.getElementById('total').textContent = '0.00';
    total = 0;
    document.getElementById('cartKilo').innerHTML = '';
    document.getElementById('totalKilo').textContent = '0.00';
    totalKilo = 0;
}
