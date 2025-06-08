
let cart = {};

function showTab(tabId) {
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => tab.style.display = 'none');
  document.getElementById(tabId).style.display = 'block';
}

function addToCart(product) {
  const productDiv = [...document.querySelectorAll('.product')].find(p => p.getAttribute('data-name') === product);
  const price = parseInt(productDiv.getAttribute('data-price'), 10);
  cart[product] = { qty: 1, price };
  updateCart();
  renderProductControls(product);
}

function changeQuantity(product, delta) {
  if (!cart[product]) return;
  cart[product].qty += delta;
  if (cart[product].qty <= 0) {
    delete cart[product];
  }
  updateCart();
  renderProductControls(product);
}

function updateCart() {
  const cartList = document.getElementById('cart-items');
  const emptyMsg = document.getElementById('empty-cart');
  const cartCount = document.getElementById('cart-count');
  cartList.innerHTML = '';

  const items = Object.entries(cart);
  let totalItems = 0;

  if (items.length === 0) {
    emptyMsg.style.display = 'block';
    cartCount.textContent = '0';
  } else {
    emptyMsg.style.display = 'none';
    items.forEach(([item, { qty, price }]) => {
      const card = document.createElement('div');
      card.className = 'cart-card';

      const info = document.createElement('div');
      info.innerHTML = `<strong>${item}</strong><br>Цена: ${price}₽<br>Количество: ${qty}<br>Итого: ${qty * price}₽`;

      const controls = document.createElement('div');
      controls.style.marginTop = '10px';
      controls.style.display = 'flex';
      controls.style.flexDirection = 'column';
      controls.style.gap = '8px';
      const minusBtn = document.createElement('button');
      minusBtn.textContent = '−';
      minusBtn.onclick = () => changeQuantity(item, -1);

      const qtySpan = document.createElement('span');
      qtySpan.textContent = ` ${qty} `;
      qtySpan.style.margin = '0 10px';

      const plusBtn = document.createElement('button');
      plusBtn.textContent = '+';
      plusBtn.onclick = () => changeQuantity(item, 1);

      const removeBtn = document.createElement('button');
      removeBtn.textContent = 'Удалить';
      removeBtn.onclick = () => {
        delete cart[item];
        updateCart();
        renderProductControls(item);
      };

      const qtyControls = document.createElement('div');
      qtyControls.style.display = 'flex';
      qtyControls.style.alignItems = 'center';
      qtyControls.appendChild(minusBtn);
      qtyControls.appendChild(qtySpan);
      qtyControls.appendChild(plusBtn);
      controls.appendChild(qtyControls);
      controls.appendChild(removeBtn);

      card.appendChild(info);
      card.appendChild(controls);
      cartList.appendChild(card);

      totalItems += qty;
    });
    cartCount.textContent = totalItems.toString();
  }
}

function renderProductControls(productName) {
  const productDiv = [...document.querySelectorAll('.product')].find(p => p.getAttribute('data-name') === productName);
  const controlArea = productDiv.querySelector('.control-area');

  controlArea.innerHTML = '';

  if (cart[productName]) {
    const minusBtn = document.createElement('button');
    minusBtn.textContent = '−';
    minusBtn.onclick = () => changeQuantity(productName, -1);

    const qtyText = document.createElement('span');
    qtyText.textContent = `В корзине: ${cart[productName].qty}`;
    qtyText.style.margin = '0 10px';
    qtyText.style.fontWeight = 'bold';

    const plusBtn = document.createElement('button');
    plusBtn.textContent = '+';
    plusBtn.onclick = () => changeQuantity(productName, 1);

    controlArea.appendChild(minusBtn);
    controlArea.appendChild(qtyText);
    controlArea.appendChild(plusBtn);
  } else {
    const addButton = document.createElement('button');
    addButton.textContent = 'Добавить в корзину';
    addButton.onclick = () => addToCart(productName);
    controlArea.appendChild(addButton);
  }
}

function searchProducts() {
  const query = document.getElementById('search-input').value.toLowerCase();
  const products = document.querySelectorAll('#product-list .product');
  products.forEach(product => {
    const name = product.getAttribute('data-name').toLowerCase();
    product.style.display = name.includes(query) ? '' : 'none';
  });
}

window.addEventListener('DOMContentLoaded', () => {
  updateCart();
  document.querySelectorAll('.product').forEach(product => {
    const name = product.getAttribute('data-name');
    renderProductControls(name);
  });
});
