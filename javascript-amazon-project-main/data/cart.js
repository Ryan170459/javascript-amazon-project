export const cart=[];

// Function to add a product to the cart
export function addToCart(productId) {

  let matchingItem;

  // Check whether the product already exists in the cart
  cart.forEach((cartItem) => {

    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }

  });


  // If the product already exists, increase its quantity
  if (matchingItem) {

    matchingItem.quantity += 1;

  } else {

    // Otherwise, add a new product to the cart
    cart.push({
      productId: productId,
      quantity: 1
    });

  }
}