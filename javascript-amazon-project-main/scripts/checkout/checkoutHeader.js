import { cart } from '../../data/cart.js';

// Calculate and display the number of items in the cart
export function renderCartItemCount() {

  let itemCount = 0;

  cart.forEach((cartItem) => {
    itemCount += cartItem.quantity;
  });

  document.querySelector('.js-checkout-item-count')
    .textContent = itemCount;
}