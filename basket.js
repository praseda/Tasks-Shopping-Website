document.addEventListener('DOMContentLoaded', () => {
    let basket = JSON.parse(localStorage.getItem('basket')) || [];
    const basketContainer = document.getElementById('basket-items');
    const totalPriceElement = document.getElementById('total-price');

    function renderBasket() {
        basketContainer.innerHTML = '';
        let totalPrice = 0;

        basket.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('basket-item');

            const itemImage = document.createElement('img');
            itemImage.src = item.image;
            itemImage.alt = item.title;

            const itemDetails = document.createElement('div');
            itemDetails.classList.add('basket-item-details');
            itemDetails.innerHTML = `
                <h4>${item.title}</h4>
                <p>Price: $${item.price}</p>
            `;

            const itemActions = document.createElement('div');
            itemActions.classList.add('basket-item-actions');

            const quantityDiv = document.createElement('div');
            quantityDiv.classList.add('quantity');
            const quantityInput = document.createElement('input');
            quantityInput.type = 'number';
            quantityInput.value = item.quantity;
            quantityInput.min = 1;
            quantityInput.addEventListener('change', (e) => {
                const newQuantity = parseInt(e.target.value);
                item.quantity = newQuantity;
                updateBasket();
            });
            quantityDiv.appendChild(quantityInput);

            const removeButton = document.createElement('button');
            removeButton.classList.add('remove-btn');
            removeButton.textContent = 'Remove';
            removeButton.addEventListener('click', () => {
                basket.splice(index, 1);
                updateBasket();
            });

            itemActions.appendChild(quantityDiv);
            itemActions.appendChild(removeButton);

            itemDiv.appendChild(itemImage);
            itemDiv.appendChild(itemDetails);
            itemDiv.appendChild(itemActions);

            basketContainer.appendChild(itemDiv);

            totalPrice += item.price * item.quantity;
        });

        totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
        localStorage.setItem('basket', JSON.stringify(basket));
    }

    function updateBasket() {
        renderBasket();
        updateBasketCount();
    }

    function updateBasketCount() {
        const basketCount = document.getElementById('basket-count');
        basketCount.textContent = basket.length;
    }

    renderBasket();
    updateBasketCount();
});
