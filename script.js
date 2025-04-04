import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getDatabase, ref, set, child, get, onValue } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js"; 

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBF3i9A4RZauk1moZnfVrVXtYPQjmQqS2I",
  authDomain: "we-make-anything.firebaseapp.com",
  projectId: "we-make-anything",
  storageBucket: "we-make-anything.firebasestorage.app",
  messagingSenderId: "1016752402421",
  appId: "1:1016752402421:web:2543ceb386628bfe31fabc",
  measurementId: "G-DWFVDQQN3Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Prices for the items
const prices = {
  "SPRINGS": 2000,
  "PIPE_PARTS": 2500,
  "RIFLE_PARTS": 1000,
  "SNIPER_PARTS": 1500,
  "SHOTGUN_PARTS": 1000,
  "PISTOL_PARTS": 500,
  "SMG_PARTS": 2000,
  "IRON": 500,
  "GOLD": 550,
  "DIAMOND": 700,
  "REINFORCED_DRILL_BITS": 7000,
  "GOLDEN_DRILL_BITS": 14000,
  "MONITOR": 8500,
  "MILL_SAW": 25000,
  "POWERCORE": 2500,
  "LARGE_DRILL": 35000,
  "SMALL_DRILL": 30000
};

// List of items per category
const itemsByCategory = {
  "gun-parts": [
    { name: "SPRINGS", price: prices["SPRINGS"] },
    { name: "PIPE_PARTS", price: prices["PIPE_PARTS"] },
    { name: "RIFLE_PARTS", price: prices["RIFLE_PARTS"] },
    { name: "SNIPER_PARTS", price: prices["SNIPER_PARTS"] },
    { name: "SHOTGUN_PARTS", price: prices["SHOTGUN_PARTS"] },
    { name: "PISTOL_PARTS", price: prices["PISTOL_PARTS"] },
    { name: "SMG_PARTS", price: prices["SMG_PARTS"] },
  ],
  "ores-bars": [
    { name: "IRON", price: prices["IRON"] },
    { name: "GOLD", price: prices["GOLD"] },
    { name: "DIAMOND", price: prices["DIAMOND"] },
  ],
  "hesit-gear": [
    { name: "REINFORCED_DRILL_BITS", price: prices["REINFORCED_DRILL_BITS"] },
    { name: "GOLDEN_DRILL_BITS", price: prices["GOLDEN_DRILL_BITS"] },
    { name: "MONITOR", price: prices["MONITOR"] },
    { name: "MILL_SAW", price: prices["MILL_SAW"] },
    { name: "POWERCORE", price: prices["POWERCORE"] },
    { name: "LARGE_DRILL", price: prices["LARGE_DRILL"] },
    { name: "SMALL_DRILL", price: prices["SMALL_DRILL"] }
  ]
};

// Function to update items based on the selected category
document.getElementById("category").addEventListener("change", function() {
  const selectedCategory = this.value;
  const itemSelect = document.getElementById("item");
  itemSelect.innerHTML = ""; // Clear previous items

  itemsByCategory[selectedCategory].forEach(item => {
    const option = document.createElement("option");
    option.value = item.name;
    option.textContent = `${item.name} - $${item.price}`;
    itemSelect.appendChild(option);
  });
});

// Initialize item options based on the default category
document.getElementById("category").dispatchEvent(new Event("change"));

// Listen for order submissions
document.getElementById("order-form-content").addEventListener("submit", function(e) {
  e.preventDefault();

  // Get order details
  const item = document.getElementById("item").value;
  const quantity = document.getElementById("quantity").value;
  const customJob = document.getElementById("custom-job").value;
  
  // Get the price of the selected item
  const price = prices[item];
  
  // Create the order object
  const order = {
    item,
    quantity,
    customJob,
    totalPrice: price * quantity,
    timestamp: new Date().toLocaleString(),
  };

  // Save the order to Firebase
  const newOrderRef = ref(db, 'orders/' + new Date().getTime());
  set(newOrderRef, order);

  // Optionally, update the local orders array for immediate display (if needed)
  updateLiveOrders();
});

// Function to listen for live updates of orders in the Firebase database
function listenForLiveOrders() {
  const ordersRef = ref(db, 'orders');
  onValue(ordersRef, function(snapshot) {
    const data = snapshot.val();
    if (data) {
      const orders = Object.values(data);
      updateLiveOrders(orders);
    }
  });
}

// Function to update live orders on the admin panel
function updateLiveOrders(orders = []) {
  const ordersList = document.getElementById("orders-list");
  ordersList.innerHTML = ''; // Clear current list

  orders.forEach(order => {
    const orderDiv = document.createElement("div");
    orderDiv.innerHTML = `
      <p><strong>Item:</strong> ${order.item} | <strong>Quantity:</strong> ${order.quantity} | <strong>Total Price:</strong> $${order.totalPrice} | <strong>Timestamp:</strong> ${order.timestamp}</p>
      <p><strong>Custom Request:</strong> ${order.customJob ? order.customJob : 'None'}</p>
    `;
    ordersList.appendChild(orderDiv);
  });
}

// Search for admin access
document.getElementById("search").addEventListener("input", function() {
  if (this.value === "JOHNWICK-AC-ANYTHING") {
    alert("Admin Access Granted! You can now view live orders.");
    listenForLiveOrders();  // Start listening for live orders once admin accesses
  }
});
