import {
  cart,
  saveToStorage,
  removeFromCart
} from '../../data/cart.js';

import {
  products
} from '../../data/products.js';

import {
  formatCurrency
} from '../utils/money.js';

import {
  deliveryOptions
} from '../../data/deliveryOptions.js';

import {
  renderCartItemCount
} from './checkoutHeader.js';

import {
  renderPaymentSummary
} from './paymentSummary.js';


// Calculate the delivery date
function calculateDeliveryDate(deliveryDays) {

  const today = new Date();

  today.setDate(today.getDate() + deliveryDays);

  const day = today.toLocaleDateString('en-US', {
    weekday: 'long'
  });

  const month = today.toLocaleDateString('en-US', {
    month: 'long'
  });

  const date = today.toLocaleDateString('en-US', {
    day: 'numeric'
  });

  return `${day}, ${month} ${date}`;
}


// Create the delivery options HTML
function deliveryOptionsHTML(cartItem, cartIndex) {

  let html = '';

  deliveryOptions.forEach((option) => {

    const deliveryDate =
      calculateDeliveryDate(option.deliveryDays);

    const isChecked =
      option.id === cartItem.deliveryOptionId;

    let shippingPrice = '';

    if (option.priceCents === 0) {

      shippingPrice = 'FREE Shipping';

    } else {

      shippingPrice =
        `$${formatCurrency(option.priceCents)} - Shipping`;
    }


    html += `
      <div class="delivery-option">

        <input
          type="radio"
          class="delivery-option-input"
          name="delivery-option-${cartIndex}"
          value="${option.id}"
          ${isChecked ? 'checked' : ''}
          data-cart-index="${cartIndex}"
          data-delivery-option-id="${option.id}"
        >

        <div>

          <div class="delivery-option-date">
            ${deliveryDate}
          </div>

          <div class="delivery-option-price">
            ${shippingPrice}
          </div>

        </div>

      </div>
    `;
  });

  return html;
}


// Render the order summary
export function renderOrderSummary() {

  let cartSummary = '';


  cart.forEach((cartItem, cartIndex) => {

    const productId = cartItem.productId;


    const matchingProduct = products.find((product) => {
      return product.id === productId;
    });


    if (!matchingProduct) {

      console.log(
        'Product not found:',
        productId
      );

      return;
    }


    // Find the selected delivery option
    let selectedDeliveryOption =
      deliveryOptions.find((option) => {
        return option.id === cartItem.deliveryOptionId;
      });


    // If no delivery option exists,
    // select the first option
    if (!selectedDeliveryOption) {

      selectedDeliveryOption =
        deliveryOptions[0];

      cartItem.deliveryOptionId =
        selectedDeliveryOption.id;
    }


    const deliveryDate =
      calculateDeliveryDate(
        selectedDeliveryOption.deliveryDays
      );


    cartSummary += `

      <div class="cart-item-container
        js-cart-item-container-${matchingProduct.id}">

        <div class="delivery-date">
          Delivery date: ${deliveryDate}
        </div>


        <div class="cart-item-details-grid">

          <img
            class="product-image"
            src="${matchingProduct.image}"
          >


          <div class="cart-item-details">

            <div class="product-name">
              ${matchingProduct.name}
            </div>


            <div class="product-price">
              $${formatCurrency(matchingProduct.priceCents)}
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


              <span
                class="delete-quantity-link link-primary js-delete-link"
                data-product-id="${matchingProduct.id}">
                Delete
              </span>

            </div>

          </div>

        </div>


        <div class="delivery-options">

          <div class="delivery-options-title">
            Choose a delivery option:
          </div>

          ${deliveryOptionsHTML(
            cartItem,
            cartIndex
          )}

        </div>

      </div>

    `;
  });


  document.querySelector('.js-order-summary')
    .innerHTML = cartSummary;


  // Save delivery option changes
  saveToStorage();
}


// Handle delivery option changes
document.addEventListener('change', (event) => {

  if (
    !event.target.classList.contains(
      'delivery-option-input'
    )
  ) {
    return;
  }


  const cartIndex =
    event.target.dataset.cartIndex;


  const deliveryOptionId =
    event.target.dataset.deliveryOptionId;


  cart[cartIndex].deliveryOptionId =
    deliveryOptionId;


  saveToStorage();


  // Update both summaries
  renderOrderSummary();

  renderPaymentSummary();
});


// Handle delete buttons
document.addEventListener('click', (event) => {

  if (
    !event.target.classList.contains(
      'js-delete-link'
    )
  ) {
    return;
  }


  const productId =
    event.target.dataset.productId;


  // Remove item from cart
  removeFromCart(productId);


  // Update order summary
  renderOrderSummary();


  // Update checkout item count
  renderCartItemCount();


  // Update payment summary
  renderPaymentSummary();
});