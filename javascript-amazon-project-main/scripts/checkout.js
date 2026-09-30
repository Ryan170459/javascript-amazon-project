import { cart, saveToStorage, removeFromCart } from '../data/cart.js';
import { products } from '../data/products.js';
import { formatCurrency } from './utils/money.js';


// Delivery options
const deliveryOptions = [
  {
    id: '1',
    deliveryDays: 7,
    priceCents: 0
  },
  {
    id: '2',
    deliveryDays: 3,
    priceCents: 499
  },
  {
    id: '3',
    deliveryDays: 1,
    priceCents: 999
  }
];


// Function to calculate the delivery date
function calculateDeliveryDate(deliveryDays) {

  // Get today's date
  const today = new Date();

  // Add the number of delivery days
  today.setDate(today.getDate() + deliveryDays);

  // Get the day of the week
  const day = today.toLocaleDateString('en-US', {
    weekday: 'long'
  });

  // Get the month
  const month = today.toLocaleDateString('en-US', {
    month: 'long'
  });

  // Get the day number
  const date = today.toLocaleDateString('en-US', {
    day: 'numeric'
  });

  // Return the formatted date
  return `${day}, ${month} ${date}`;
}


// Function used to display the checkout items
function renderOrderSummary() {

  // Create an empty string for the HTML
  let cartSummary = '';


  // Loop through every item in the cart
  cart.forEach((cartItem, cartIndex) => {

    // Get the product ID
    const productId = cartItem.productId;


    // Find the matching product
    const matchingProduct = products.find((product) => {
      return product.id === productId;
    });


    // Check whether the product exists
    if (!matchingProduct) {
      console.log('Product not found:', productId);
      return;
    }


    // Find the selected delivery option
    let selectedDeliveryOption = deliveryOptions.find((option) => {
      return option.id === cartItem.deliveryOptionId;
    });


    // If no delivery option has been selected,
    // use the first option as the default
    if (!selectedDeliveryOption) {

      selectedDeliveryOption = deliveryOptions[0];

      // Save the default delivery option to the cart
      cartItem.deliveryOptionId = selectedDeliveryOption.id;
    }


    // Calculate the delivery date
    const deliveryDate = calculateDeliveryDate(
      selectedDeliveryOption.deliveryDays
    );


    // Create the HTML for this cart item
    cartSummary += `
      <div class="cart-item-container">

        <!-- Display the selected delivery date -->
        <div class="delivery-date">
          Delivery date: ${deliveryDate}
        </div>


        <div class="cart-item-details-grid">

          <!-- Product image -->
          <img class="product-image"
            src="${matchingProduct.image}">


          <div class="cart-item-details">

            <!-- Product name -->
            <div class="product-name">
              ${matchingProduct.name}
            </div>


            <!-- Product price -->
            <div class="product-price">
              $${formatCurrency(matchingProduct.priceCents)}
            </div>


            <!-- Quantity -->
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

              <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
                Delete
              </span>

            </div>

          </div>

        </div>


        <!-- Delivery options -->
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


  // Display the generated HTML on the webpage
  document.querySelector('.js-order-summary')
    .innerHTML = cartSummary;


  // Save the cart after setting default delivery options
  saveToStorage();
}


// Function that generates the delivery options HTML
function deliveryOptionsHTML(cartItem, cartIndex) {

  // Create an empty string
  let html = '';


  // Loop through every delivery option
  deliveryOptions.forEach((option) => {

    // Calculate the delivery date
    const deliveryDate = calculateDeliveryDate(
      option.deliveryDays
    );


    // Check whether this option is currently selected
    const isChecked =
      option.id === cartItem.deliveryOptionId;


    // Display the shipping price
    let shippingPrice = '';

    if (option.priceCents === 0) {
      shippingPrice = 'FREE Shipping';
    } else {
      shippingPrice =
        `$${formatCurrency(option.priceCents)} - Shipping`;
    }


    // Add the option to the HTML
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


// Display the order summary
renderOrderSummary();


// Listen for changes to the delivery radio buttons
document.addEventListener('change', (event) => {

  // Check if the changed element is a delivery option
  if (!event.target.classList.contains('delivery-option-input')) {
    return;
  }


  // Get the cart item's index
  const cartIndex =
    event.target.dataset.cartIndex;


  // Get the selected delivery option
  const deliveryOptionId =
    event.target.dataset.deliveryOptionId;


  // Save the selected delivery option
  cart[cartIndex].deliveryOptionId =
    deliveryOptionId;


  // Save the updated cart
  saveToStorage();


  // Re-render the checkout page
  renderOrderSummary();
});

document.querySelectorAll('.js-delete-link')
  .forEach((link) => {

    link.addEventListener('click', () => {

      // Get the product ID from the data-product-id attribute
      const productId = link.dataset.productId;

      removeFromCart(productId);
      
    });
  });