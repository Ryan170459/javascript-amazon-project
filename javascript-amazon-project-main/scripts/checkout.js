import { cart } from '../data/cart.js';
import { products } from '../data/products.js';

// Create an empty string to store all the cart HTML
let cartSummary = '';

// Loop through each item in the cart
cart.forEach((cartItem) => {

  // Get the product ID from the cart
  const productId = cartItem.productId;

  // Find the product that matches the product ID
  const matchingProduct = products.find((product) => {
    return product.id === productId;
  });

  // Check if the product was found
  if (!matchingProduct) {
    console.log('Product not found:', productId);
    return;
  }

  // Add the product HTML to cartSummary
  cartSummary += `
    <div class="cart-item-container">

      <div class="delivery-date">
        Delivery date: Tuesday, June 21
      </div>

      <div class="cart-item-details-grid">

        <img class="product-image"
          src="${matchingProduct.image}">

        <div class="cart-item-details">

          <div class="product-name">
            ${matchingProduct.name}
          </div>

          <div class="product-price">
            $${(matchingProduct.priceCents / 100).toFixed(2)}
          </div>

          <div class="product-quantity">

            <span>
              Quantity:
              <span class="quantity-label">
                ${cartItem.quantity}
              </span>
            </span>

            <span class="update-quantity-link link-primary">
              Update
            </span>

            <span class="delete-quantity-link link-primary">
              Delete
            </span>

          </div>

        </div>

      </div>

    </div>
  `;
});

// Find the order-summary element
// and insert the generated cart HTML into it
document.querySelector('.js-order-summary')
  .innerHTML = cartSummary;