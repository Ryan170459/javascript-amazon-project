// Get the cart from localStorage
export let cart = JSON.parse(localStorage.getItem('cart'));


// If there is no cart saved in localStorage,
// create the default cart
if (!cart) {

  cart = [
    {
      productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
      quantity: 2
    },
    {
      productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
      quantity: 1
    }
  ];

  // Save the default cart to localStorage
  saveToStorage();
}


// Function used to save the cart to localStorage
export function saveToStorage() {

  localStorage.setItem(
    'cart',
    JSON.stringify(cart)
  );
}


// Function to add a product to the cart
export function addToCart(productId) {

  // Store the matching cart item
  let matchingItem;


  // Search for the product in the cart
  cart.forEach((cartItem) => {

    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }

  });


  // If the product already exists,
  // increase its quantity
  if (matchingItem) {

    matchingItem.quantity += 1;

  } else {

    // If the product doesn't exist,
    // add it to the cart
    cart.push({
      productId: productId,
      quantity: 1
    });

  }


  // Save the updated cart
  saveToStorage();
}


// Function used to remove a product from the cart
export function removeFromCart(productId) {

  // Create a new empty array
  const newCart = [];


  // Go through every item in the cart
  cart.forEach((cartItem) => {

    // Keep the item if its product ID
    // does NOT match the product we want to delete
    if (cartItem.productId !== productId) {

      newCart.push(cartItem);

    }

  });


  // Replace the old cart with the new cart
  cart = newCart;


  // Save the updated cart to localStorage
  saveToStorage();
}