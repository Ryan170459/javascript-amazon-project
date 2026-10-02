import { cart } from '../../data/cart.js';

import { getProduct } from '../../data/products.js';

import { formatCurrency } from '../utils/money.js';

import { deliveryOptions } from '../../data/deliveryOptions.js';


// Render payment summary
export function renderPaymentSummary() {

  let productPriceCents = 0;

  let shippingPriceCents = 0;


  // Calculate product prices
  cart.forEach((cartItem) => {

    const product =
      getProduct(cartItem.productId);


    if (!product) {

      console.log(
        'Product not found:',
        cartItem.productId
      );

      return;
    }


    productPriceCents +=
      product.priceCents *
      cartItem.quantity;


    // Find selected delivery option
    const deliveryOption =
      deliveryOptions.find((option) => {

        return option.id ===
          cartItem.deliveryOptionId;

      });


    if (deliveryOption) {

      // Shipping is charged once
      // for each cart item
      shippingPriceCents +=
        deliveryOption.priceCents;
    }

  });


  // Calculate totals
  const totalBeforeTaxCents =
    productPriceCents +
    shippingPriceCents;


  const taxCents =
    totalBeforeTaxCents * 0.10;


  const orderTotalCents =
    totalBeforeTaxCents +
    taxCents;


  // Display the payment summary
  document.querySelector('.js-payment-summary')
    .innerHTML = `

      <div class="payment-summary-title">
        Order Summary
      </div>


      <div class="payment-summary-row">

        <div>
          Items (${cart.reduce((total, cartItem) => {
            return total + cartItem.quantity;
          }, 0)}):
        </div>

        <div class="payment-summary-money">
          $${formatCurrency(productPriceCents)}
        </div>

      </div>


      <div class="payment-summary-row">

        <div>
          Shipping &amp; handling:
        </div>

        <div class="payment-summary-money">
          $${formatCurrency(shippingPriceCents)}
        </div>

      </div>


      <div class="payment-summary-row subtotal-row">

        <div>
          Total before tax:
        </div>

        <div class="payment-summary-money">
          $${formatCurrency(totalBeforeTaxCents)}
        </div>

      </div>


      <div class="payment-summary-row">

        <div>
          Estimated tax (10%):
        </div>

        <div class="payment-summary-money">
          $${formatCurrency(taxCents)}
        </div>

      </div>


      <div class="payment-summary-row total-row">

        <div>
          Order total:
        </div>

        <div class="payment-summary-money">
          $${formatCurrency(orderTotalCents)}
        </div>

      </div>


      <button class="place-order-button button-primary">
        Place your order
      </button>

    `;
}