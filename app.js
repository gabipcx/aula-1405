document.addEventListener("DOMContentLoaded", () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartTable = document.getElementById("cart-table").getElementsByTagName("tbody")[0];
    const cartTotal = document.getElementById("cart-total");
    const productList = document.getElementById("product-list");

    // Verificar se o usuário está logado
    const user = JSON.parse(localStorage.getItem("loggedIn"));
    if (!user) {
        alert("Você precisa estar logado para fazer compras.");
        window.location.href = "login.html";
    }

    // Carregar produtos com imagens reais
    const products = [
        { 
            id: "001", 
            name: "Macarrão", 
            price: 25.00, 
            imageUrl: "https://itanareceitas.com.br/wp-content/uploads/2024/09/Macarrao-Cremoso-de-Frigideirae.webp", // Imagem real de macarrão
        },
        { 
            id: "002", 
            name: "Suco de Morango", 
            price: 8.00, 
            imageUrl: "https://cdn.vnda.com.br/substancia/2016/07/15/60286-suco-de-morango-e-uva-271.jpg?v=1468588662", // Imagem real de suco de morango
        },
        { 
            id: "003", 
            name: "Torta Holandesa", 
            price: 35.00, 
            imageUrl: "https://www.unileverfoodsolutions.com.br/dam/global-ufs/mcos/SLA/calcmenu/recipes/BR-recipes/desserts-%26-bakery/torta-holandesa/main-header.jpg", // Imagem real de torta holandesa
        },
    ];

    // Exibir produtos na página
    products.forEach(product => {
        const productElement = document.createElement("div");
        productElement.classList.add("product");
        productElement.dataset.id = product.id;
        productElement.innerHTML = `
            <img src="${product.imageUrl}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price">R$ ${product.price.toFixed(2)}</p>
            <button class="add-to-cart">Adicionar ao Carrinho</button>
        `;
        productList.appendChild(productElement);
    });

    // Atualizar o carrinho na tela
    function updateCart() {
        cartTable.innerHTML = "";
        let total = 0;

        cart.forEach(item => {
            const row = cartTable.insertRow();
            row.innerHTML = `
                <td>${item.name}</td>
                <td>
                    <button class="quantity-btn" data-action="decrease" data-id="${item.id}">-</button>
                    ${item.quantity}
                    <button class="quantity-btn" data-action="increase" data-id="${item.id}">+</button>
                </td>
                <td>R$ ${item.unitPrice.toFixed(2)}</td>
                <td>R$ ${(item.unitPrice * item.quantity).toFixed(2)}</td>
                <td><button class="remove-btn" data-id="${item.id}">Remover</button></td>
            `;
            total += item.unitPrice * item.quantity;
        });

        cartTotal.textContent = total.toFixed(2);
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    // Adicionar ao carrinho
    function addToCart(product) {
        const existingProduct = cart.find(item => item.id === product.id);
        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        updateCart();
    }

    // Lidar com o clique do botão "Adicionar ao Carrinho"
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", () => {
            const productElement = button.closest(".product");
            const productId = productElement.dataset.id;
            const product = products.find(p => p.id === productId);
            addToCart(product);
        });
    });

    // Lidar com o clique do botão "Remover"
    cartTable.addEventListener("click", (e) => {
        if (e.target.classList.contains("remove-btn")) {
            const productId = e.target.dataset.id;
            removeFromCart(productId);
        } else if (e.target.classList.contains("quantity-btn")) {
            const action = e.target.dataset.action;
            const productId = e.target.dataset.id;
            changeQuantity(productId, action);
        }
    });

    // Remover produto do carrinho
    function removeFromCart(productId) {
        const index = cart.findIndex(item => item.id === productId);
        if (index > -1) {
            cart.splice(index, 1);
            updateCart();
        }
    }

    // Alterar a quantidade do produto
    function changeQuantity(productId, action) {
        const product = cart.find(item => item.id === productId);
        if (product) {
            if (action === "increase") {
                product.quantity++;
            } else if (action === "decrease" && product.quantity > 1) {
                product.quantity--;
            }
            updateCart();
        }
    }

    // Limpar carrinho
    document.getElementById("clear-cart").addEventListener("click", () => {
        localStorage.removeItem("cart");
        cart.length = 0;
        updateCart();
    });

    // Atualizar carrinho ao carregar a página
    updateCart();
});

