export function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}
export const cart=[{
    productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
    quantity:2,
},{
    productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
    quantity:1
}];

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