import { renderCartItemCount } from './checkout/checkoutHeader.js';
import { renderOrderSummary } from './checkout/orderSummary.js';
import { renderPaymentSummary } from './checkout/paymentSummary.js';


// Display the number of items in the cart
renderCartItemCount();

// Display the products in the order
renderOrderSummary();

// Display the payment summary
renderPaymentSummary();