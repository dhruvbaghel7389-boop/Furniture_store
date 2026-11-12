
// shopping cart state
let cart = [];
let toastTimer = null;
let detailQuantity = 1;
let detailProduct = null;

// render dynamic products if container is present
function displayProducts(products) {
  const productGrid = document.getElementById("productGrid");
  if (!productGrid) return;

  productGrid.innerHTML = "";

  if (!products || products.length === 0) {
    productGrid.innerHTML = `
      <div class="col-12 text-center py-5">
        <h3 class="text-muted">No Products Found</h3>
        <p class="text-secondary">Sorry, no products available in this category.</p>
      </div>
    `;
    return;
  }

  products.forEach(function (product) {
    const col = document.createElement("div");
    col.className = "col";

    col.innerHTML = `
      <article class="product-card h-100" data-product-id="${product.id}">
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}" loading="lazy">
        </div>
        <div class="product-info">
          <p class="category">${product.category}</p>
          <h3>${product.name}</h3>
          <div class="product-bottom d-flex align-items-center justify-content-between mt-2">
            <span class="price">£${product.price.toFixed(2)}</span>
            <button class="add-cart btn btn-sm" type="button" data-product-id="${product.id}">
              Add to Cart
            </button>
          </div>
        </div>
      </article>
    `;
    productGrid.appendChild(col);
  });
}

// add product to cart
function addToCart(productId) {
  const product = productData.find(function (item) {
    return item.id === productId;
  });

  if (!product) {
    console.error("Product not found:", productId);
    return;
  }

  const existingProduct = cart.find(function (item) {
    return item.id === productId;
  });

  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    cart.push({
      ...product,
      quantity: 1
    });
  }

  updateCart();
  showToast(`${product.name} added to cart ✓`);
}

// update cart count badge and total price
function updateCart() {
  let totalItems = 0;
  let totalPrice = 0;

  cart.forEach(function (product) {
    totalItems += product.quantity;
    totalPrice += product.price * product.quantity;
  });

  const cartCountElements = document.querySelectorAll("#cartCount");
  cartCountElements.forEach(function (el) {
    el.textContent = totalItems;
  });

  const totalPriceElements = document.querySelectorAll("#totalPrice");
  totalPriceElements.forEach(function (el) {
    el.textContent = totalPrice.toFixed(2);
  });
}

// show toast message popup
function showToast(message) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () {
    toast.classList.remove("show");
  }, 2200);
}

// open shopping cart drawer
function showCart() {
  let drawer = document.getElementById("cartDrawer");
  let overlay = document.getElementById("cartOverlay");

  if (!drawer) {
    overlay = document.createElement("div");
    overlay.id = "cartOverlay";
    overlay.className = "cart-overlay";

    drawer = document.createElement("div");
    drawer.id = "cartDrawer";
    drawer.className = "cart-drawer";

    drawer.innerHTML = `
      <div class="cart-header">
        <h2>Shopping Cart</h2>
        <button class="cart-close" onclick="closeCart()" aria-label="Close cart">×</button>
      </div>
      <div id="cartItems" class="cart-items"></div>
      <div class="cart-bottom">
        <div class="cart-subtotal">
          <strong>Subtotal:</strong>
          <span>£<span id="drawerTotal">0.00</span></span>
        </div>
        <button class="cart-action" onclick="viewCart()">View Cart</button>
        <button class="cart-action" onclick="checkoutCart()">Checkout</button>
      </div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(drawer);

    overlay.onclick = closeCart;
  }

  renderCart();
  drawer.classList.add("active");
  overlay.classList.add("active");
}

// render cart items inside drawer
function renderCart() {
  const items = document.getElementById("cartItems");
  const total = document.getElementById("drawerTotal");

  if (!items || !total) return;

  if (cart.length === 0) {
    items.innerHTML = `
      <div class="empty-cart text-center py-5">
        <i class="fa-solid fa-cart-shopping fs-1 mb-3"></i>
        <h3>Your cart is empty</h3>
        <p class="text-muted">Add products to your cart.</p>
      </div>
    `;
    total.textContent = "0.00";
    return;
  }

  let subtotal = 0;
  items.innerHTML = "";

  cart.forEach(function (product) {
    const itemTotal = product.price * product.quantity;
    subtotal += itemTotal;

    const itemEl = document.createElement("div");
    itemEl.className = "cart-item";
    itemEl.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <div class="cart-product-info">
        <h3>${product.name}</h3>
        <div class="cart-quantity">
          <button type="button" onclick="changeQuantity('${product.id}', -1)">−</button>
          <span>${product.quantity}</span>
          <button type="button" onclick="changeQuantity('${product.id}', 1)">+</button>
        </div>
      </div>
      <button class="cart-remove" onclick="removeCartItem('${product.id}')" aria-label="Remove item">×</button>
      <div class="cart-price-item">£${itemTotal.toFixed(2)}</div>
    `;
    items.appendChild(itemEl);
  });

  total.textContent = subtotal.toFixed(2);
}

// change quantity inside cart
function changeQuantity(productId, change) {
  const product = cart.find(function (item) {
    return String(item.id) === String(productId);
  });

  if (!product) return;

  product.quantity += change;

  if (product.quantity <= 0) {
    removeCartItem(productId);
    return;
  }

  updateCart();
  renderCart();
}

// remove item from cart
function removeCartItem(productId) {
  cart = cart.filter(function (item) {
    return String(item.id) !== String(productId);
  });

  updateCart();
  renderCart();
}

// close shopping cart drawer
function closeCart() {
  const drawer = document.getElementById("cartDrawer");
  const overlay = document.getElementById("cartOverlay");

  if (drawer) drawer.classList.remove("active");
  if (overlay) overlay.classList.remove("active");
}

function viewCart() {
  showToast("View Cart selected");
}

function checkoutCart() {
  showToast("Checkout selected");
}

function customize() {
  showToast("Customize option selected 🎨");
}

// scroll to products section
function scrollToProducts() {
  const productsSection = document.getElementById("products");
  if (productsSection) {
    productsSection.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  } else {
    window.location.href = "all-products.html";
  }
}

// filter products by category
function filterProducts(category) {
  const allProductCards = document.querySelectorAll(".all-product-card");
  if (allProductCards.length > 0) {
    applyCategoryFilter(category);
  } else {
    window.location.href = `all-products.html?category=${encodeURIComponent(category.toLowerCase())}`;
  }
}

// apply category filter to cards on all-products page
function applyCategoryFilter(category) {
  const products = document.querySelectorAll(".all-product-card");
  if (!products.length) return;

  const normalizedCategory = category ? category.toLowerCase().trim() : "all";

  products.forEach(function (product) {
    const productCategory = (product.dataset.category || "").toLowerCase().trim();
    const productCol = product.closest(".col") || product;

    if (!normalizedCategory || normalizedCategory === "all" || productCategory === normalizedCategory) {
      productCol.style.display = "";
    } else {
      productCol.style.display = "none";
    }
  });
}

// parse url parameters and set up product details page
function initProductDetailsPage() {
  const detailNameEl = document.getElementById("detailName");
  if (!detailNameEl) return;

  const params = new URLSearchParams(window.location.search);
  const name = params.get("name") || "Modern Furniture Piece";
  const category = params.get("category") || "Furniture";
  const price = params.get("price") || "£149.00";
  const image = params.get("image") || "img/chair-300x258.jpg";

  detailProduct = {
    id: "detail-" + encodeURIComponent(name),
    name: name,
    category: category,
    price: price,
    image: image
  };

  const nameTop = document.getElementById("detailProductName");
  const catEl = document.getElementById("detailCategory");
  const catTop = document.getElementById("detailCategoryTop");
  const catBottom = document.getElementById("detailCategoryBottom");
  const priceEl = document.getElementById("detailPrice");
  const imageEl = document.getElementById("detailImage");

  if (nameTop) nameTop.textContent = name;
  if (detailNameEl) detailNameEl.textContent = name;
  if (catEl) catEl.textContent = category;
  if (catTop) catTop.textContent = category;
  if (catBottom) catBottom.textContent = category;
  if (priceEl) priceEl.textContent = price.startsWith("£") ? price : `£${price}`;
  if (imageEl) {
    imageEl.src = image;
    imageEl.alt = name;
  }

  // description tabs toggle
  const tabs = document.querySelectorAll(".description-tab");
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) {
        t.classList.remove("active");
      });
      tab.classList.add("active");
    });
  });
}

// detail page quantity counter
function changeDetailQuantity(change) {
  detailQuantity += change;
  if (detailQuantity < 1) {
    detailQuantity = 1;
  }
  const qtyEl = document.getElementById("detailQuantity");
  if (qtyEl) {
    qtyEl.textContent = detailQuantity;
  }
}

// add current detail item to cart
function addDetailProductToCart() {
  if (!detailProduct) return;

  const numericPrice = parseFloat(detailProduct.price.replace(/[^\d.]/g, "")) || 0;

  const product = {
    id: detailProduct.id,
    name: detailProduct.name,
    category: detailProduct.category,
    price: numericPrice,
    image: detailProduct.image,
    quantity: detailQuantity
  };

  const existingProduct = cart.find(function (item) {
    return item.id === product.id;
  });

  if (existingProduct) {
    existingProduct.quantity += detailQuantity;
  } else {
    cart.push(product);
  }

  updateCart();
  showToast(`${detailProduct.name} added to cart ✓`);
}

// navigate to product details on card click
function openProductDetails(card) {
  if (!card) return;

  const imageElement = card.querySelector(".product-image img, .all-product-image img");
  const categoryElement = card.querySelector(".category, .all-product-category");
  const nameElement = card.querySelector("h3, h2");
  const priceElement = card.querySelector(".price, .all-product-price");

  if (!imageElement || !nameElement || !priceElement) return;

  const image = imageElement.getAttribute("src");
  const name = nameElement.textContent.trim();
  const category = categoryElement ? categoryElement.textContent.trim() : "Furniture";

  let priceText = priceElement.textContent.trim();
  const oldPriceEl = priceElement.querySelector(".old-price");
  if (oldPriceEl) {
    priceText = priceText.replace(oldPriceEl.textContent, "").trim();
  }

  const cleanPrice = priceText.replace(/\s+/g, " ").trim();

  const url =
    "product-details.html" +
    "?name=" + encodeURIComponent(name) +
    "&category=" + encodeURIComponent(category) +
    "&price=" + encodeURIComponent(cleanPrice) +
    "&image=" + encodeURIComponent(image);

  window.location.href = url;
}

// testimonials slider
let currentSlide = 0;

function showTestimonial(index) {
  const testimonials = document.querySelectorAll(".testimonial");
  const dots = document.querySelectorAll(".dot");
  if (testimonials.length === 0) return;

  if (index < 0) index = testimonials.length - 1;
  if (index >= testimonials.length) index = 0;

  testimonials.forEach(function (t, i) {
    t.classList.toggle("active", i === index);
  });

  dots.forEach(function (dot, i) {
    dot.classList.toggle("active-dot", i === index);
  });

  currentSlide = index;
}

function nextTestimonial() {
  const testimonials = document.querySelectorAll(".testimonial");
  if (testimonials.length === 0) return;
  currentSlide = (currentSlide + 1) % testimonials.length;
  showTestimonial(currentSlide);
}

function previousTestimonial() {
  const testimonials = document.querySelectorAll(".testimonial");
  if (testimonials.length === 0) return;
  currentSlide = (currentSlide - 1 + testimonials.length) % testimonials.length;
  showTestimonial(currentSlide);
}

// page load initialization
document.addEventListener("DOMContentLoaded", function () {
  const productGrid = document.getElementById("productGrid");
  if (productGrid) {
    displayProducts(productData);
  }

  initProductDetailsPage();

  const params = new URLSearchParams(window.location.search);
  const categoryParam = params.get("category");
  if (categoryParam) {
    applyCategoryFilter(categoryParam);
  }

  const shopBtn = document.getElementById("shopBtn");
  if (shopBtn) {
    shopBtn.addEventListener("click", scrollToProducts);
  }

  const buyBtn = document.getElementById("buyBtn");
  if (buyBtn) {
    buyBtn.addEventListener("click", function () {
      if (cart.length === 0) {
        showToast("Please add a product first 🛒");
      } else {
        showToast("Proceeding to checkout...");
      }
    });
  }

  const customizeBtn = document.getElementById("customizeBtn");
  if (customizeBtn) {
    customizeBtn.addEventListener("click", customize);
  }

  const dots = document.querySelectorAll(".dot");
  dots.forEach(function (dot, index) {
    dot.addEventListener("click", function () {
      showTestimonial(index);
    });
  });

  const testimonials = document.querySelectorAll(".testimonial");
  if (testimonials.length > 1) {
    setInterval(nextTestimonial, 4000);
  }
});

// card click delegation
document.addEventListener("click", function (event) {
  const addCartBtn = event.target.closest(".add-cart");
  if (addCartBtn) {
    const id = Number(addCartBtn.dataset.productId);
    if (id) addToCart(id);
    return;
  }

  const card = event.target.closest(".product-card, .all-product-card");
  if (!card) return;

  if (event.target.closest("button") || event.target.closest("a")) {
    return;
  }

  openProductDetails(card);
});

// expose functions for html events
window.showCart = showCart;
window.closeCart = closeCart;
window.filterProducts = filterProducts;
window.scrollToProducts = scrollToProducts;
window.changeQuantity = changeQuantity;
window.removeCartItem = removeCartItem;
window.viewCart = viewCart;
window.checkoutCart = checkoutCart;
window.changeDetailQuantity = changeDetailQuantity;
window.addDetailProductToCart = addDetailProductToCart;
window.addToCart = addToCart;

let products = [];

async function loadProducts() {
    try {
        const response = await fetch("products.json");

        if (!response.ok) {
            throw new Error("Products load nahi hue");
        }

        products = await response.json();

        displayProducts(products);

    } catch (error) {
        console.error(error);

        document.getElementById("productGrid").innerHTML =
            "<p>Products load nahi ho paaye.</p>";
    }
}


// Display products using map()
function displayProducts(productList) {
    const productGrid = document.getElementById("productGrid");

    productGrid.innerHTML = productList.map(product => `
        <div class="col">

            <article class="all-product-card" data-category="${product.category}">

                <div class="all-product-image product-image-wrapper">

                    ${product.oldPrice
                        ? '<span class="product-sale">Sale!</span>'
                        : ""
                    }

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                        loading="lazy"
                    >

                    <div class="product-actions">

                        <button
                            class="add-cart-btn"
                            onclick="addProductToCart(${product.id})">
                            Add to Cart
                        </button>

                        <button
                            class="view-product-btn"
                            onclick="showProductDetails(${product.id})"
                            aria-label="View ${product.name}">
                            <i class="fa-solid fa-eye"></i>
                        </button>

                    </div>

                </div>

                <div class="all-product-info">

                    <p class="all-product-category">
                        ${product.displayCategory}
                    </p>

                    <h2>${product.name}</h2>

                    <p class="all-product-price">
                        ${product.oldPrice
                            ? `<span class="old-price">£${product.oldPrice.toFixed(2)}</span> `
                            : ""
                        }
                        £${product.price.toFixed(2)}
                    </p>

                </div>

            </article>

        </div>
    `).join("");
}


// Load JSON data
loadProducts();