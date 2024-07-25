let allProducts = [];
let basket = [];

fetch('https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json')
    .then(response =>response.json())
    .then(data => {
        allProducts = data.categories;
        displayProducts(allProducts);
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });

document.getElementById('all').addEventListener('click', () => {
    highlightButton('all');
    displayProducts(allProducts);
});
document.getElementById('men').addEventListener('click', () => {
    highlightButton('men');
    filterProducts('Men');
});
document.getElementById('women').addEventListener('click', () => {
    highlightButton('women');
    filterProducts('Women');
});
document.getElementById('kids').addEventListener('click', () => {
    highlightButton('kids');
    filterProducts('Kids');
});

document.getElementById('search-btn').addEventListener('click', searchProducts);

function searchProducts() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const filteredCategories = allProducts.map(category => ({
        ...category,
        category_products: category.category_products.filter(product =>
            product.title.toLowerCase().includes(searchTerm) ||
            product.vendor.toLowerCase().includes(searchTerm) 
            
        )
    })).filter(category => category.category_products.length > 0);

    displayProducts(filteredCategories);
}

function displayProducts(categories) {
    const outputDiv = document.getElementById('json-output');
    outputDiv.innerHTML = '';

    categories.forEach(category => {
        category.category_products.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('product');

            const productImage = document.createElement('img');
            productImage.src = product.image;
            productImage.alt = product.title; // Add alt attribute for accessibility
            productImage.onerror = () => {
                console.error('Error loading image:', product.image); // Debug log
            };
            productDiv.appendChild(productImage);

            const productTitle = document.createElement('h3');
            productTitle.textContent = product.title;
            productDiv.appendChild(productTitle);

            const productPrice = document.createElement('p');
            productPrice.textContent = `Price: ${product.price} (Compare at: ${product.compare_at_price})`;
            productDiv.appendChild(productPrice);

            const productVendor = document.createElement('p');
            productVendor.textContent = `Vendor: ${product.vendor}`;
            productDiv.appendChild(productVendor);

            if (product.badge_text) {
                const productBadge = document.createElement('p');
                productBadge.textContent = `Badge: ${product.badge_text}`;
                productDiv.appendChild(productBadge);
            }

            const addButton = document.createElement('button');
            addButton.textContent = 'Add to Basket';
            addButton.classList.add('add-to-basket-btn');
            addButton.addEventListener('click', () => addToBasket(product));
            productDiv.appendChild(addButton);

            // Add "Buy Now" button
            const buyButton = document.createElement('button');
            buyButton.textContent = 'Buy Now';
            buyButton.classList.add('buy-now-btn');
            buyButton.addEventListener('click', () => buyNow(product));
            productDiv.appendChild(buyButton);

            productDiv.addEventListener('mouseover', () => {
                productDiv.classList.add('active');
            });

            productDiv.addEventListener('mouseout', () => {
                productDiv.classList.remove('active');
            });

            productDiv.addEventListener('click', () => {
                document.querySelectorAll('.product').forEach(div => {
                    div.classList.remove('active');
                });
                productDiv.classList.add('active');
            });

            outputDiv.appendChild(productDiv);
        });
    });
}

// Function to handle "Buy Now" action
function buyNow(product) {
    // Clear the basket
    basket = [];
    // Add the product to the basket
    product.quantity = 1;
    basket.push(product);
    // Update the basket in localStorage
    localStorage.setItem('basket', JSON.stringify(basket));
    // Redirect to the basket page
    window.location.href = 'basket.html';
}

function filterProducts(categoryName) {
    const filteredCategories = allProducts.filter(category => category.category_name === categoryName);
    displayProducts(filteredCategories);
}



function highlightButton(activeButtonId) {
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.classList.remove('active');
    });
    document.getElementById(activeButtonId).classList.add('active');
}

function addToBasket(product) {
    basket.push(product);
    updateBasketCount();
    localStorage.setItem('basket', JSON.stringify(basket));
}

function updateBasketCount() {
    const basketCount = document.getElementById('basket-count');
    basketCount.textContent = basket.length;
}

window.onload = function() {
    updateBasketCount();
}



