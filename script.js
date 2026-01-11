function goToCategory(category) {
  window.location.href = `category.html?cat=${category}`;
}
function goBack() {
  window.history.back();
}
function goToCart() {
  window.location.href = "cart.html";
}
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}
function addToCart(product) {
  let cart = getCart();
  cart.push(product);
  saveCart(cart);
  showToast(`${product.name} added to cart ✅`);
}
function showToast(message) {
  let toast = document.createElement("div");
  toast.className = "toast";
  toast.innerText = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 50);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}
function updateCartCount() {
  let cart = getCart();
  const countEl = document.getElementById("cartCount");
  if (countEl) countEl.textContent = cart.length;
}
function removeFromCart(index) {
  let cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  loadCartPage();
}
function clearCart() {
  localStorage.removeItem("cart");
  loadCartPage();
}
function checkout() {
  const cart = getCart();
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  let total = cart.reduce((sum, item) => sum + item.price, 0);
  localStorage.setItem("lastTotal", total);
  localStorage.setItem("lastCart", JSON.stringify(cart)); // ✅ Save cart items
  localStorage.removeItem("cart"); // clear active cart
  window.location.href = "thankyou.html";
}
const productsData = {
  notes: [
    { name: "Classmate Notebook", price: 50 },
    { name: "A4 Writing Pad", price: 70 }
  ],
  pen: [
    { name: "Ball Pen", price: 10 },
    { name: "Gel Pen", price: 20 }
  ],
  pencil: [
    { name: "HB Pencil", price: 5 },
    { name: "2B Drawing Pencil", price: 15 }
  ],
  sketch: [
    { name: "Sketch Pen Set", price: 120 }
  ],
  crayon: [
    { name: "Wax Crayons", price: 60 }
  ],
  marker: [
    { name: "Permanent Marker", price: 25 }
  ],
  highlighter: [
    { name: "Fluorescent Highlighter", price: 30 }
  ],
  whitener: [
    { name: "Correction Pen", price: 25 }
  ]
};
if (window.location.pathname.includes("category.html")) {
  const params = new URLSearchParams(window.location.search);
  const category = params.get("cat");
  const title = document.getElementById("categoryTitle");
  const container = document.getElementById("productsContainer");

  if (category && productsData[category]) {
    title.textContent = category.charAt(0).toUpperCase() + category.slice(1);

    productsData[category].forEach(prod => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <h3>${prod.name}</h3>
        <p>Price: ₹${prod.price}</p>
        <button onclick='addToCart(${JSON.stringify(prod)})'>Add to Cart</button>
      `;
      container.appendChild(card);
    });
  }
  updateCartCount();
}

function loadCartPage() {
  if (window.location.pathname.includes("cart.html")) {
    const cart = getCart();
    const container = document.getElementById("cartContainer");
    const totalBox = document.getElementById("cartTotal");

    container.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
      container.innerHTML = "<p>Your cart is empty 🛒</p>";
      totalBox.textContent = "";
      return;
    }

    cart.forEach((item, index) => {
      total += item.price;
      const div = document.createElement("div");
      div.className = "cart-item";
      div.innerHTML = `
        <div class="cart-info">
          <h3>${item.name}</h3>
          <p>₹${item.price}</p>
        </div>
        <button onclick="removeFromCart(${index})">Remove</button>
      `;
      container.appendChild(div);
    });
    totalBox.textContent = "Total: ₹" + total;
  }
}
loadCartPage();
updateCartCount();
if (window.location.pathname.includes("thankyou.html")) {
  const billItemsContainer = document.getElementById("billItems");
  const billTotal = document.getElementById("billTotal");

  const lastCart = JSON.parse(localStorage.getItem("lastCart")) || [];
  const lastTotal = localStorage.getItem("lastTotal") || 0;

  if (billItemsContainer && billTotal) {
    if (lastCart.length === 0) {
      billItemsContainer.innerHTML = "<p>No items found. Please shop again.</p>";
      billTotal.textContent = "Total: ₹0";
    } else {
      billItemsContainer.innerHTML = lastCart
        .map(item => `<p>${item.name} - ₹${item.price}</p>`)
        .join("");
      billTotal.textContent = lastTotal;
    }
  }
}
function backToLogin() {
  window.location.href = "login.html";
}
