// Shopping cart management with localStorage persistence
const cart = {
  storageKey: "peakride_cart",

  getCart() {
    const stored = localStorage.getItem(this.storageKey)
    return stored ? JSON.parse(stored) : { items: [], currency: "USD" }
  },

  setCart(cartData) {
    localStorage.setItem(this.storageKey, JSON.stringify(cartData))
  },

  addItem(product, customizations = {}) {
    const cartData = this.getCart()

    // Check if item with same customizations already exists
    const existingItem = cartData.items.find(
      (item) => item.id === product.id && JSON.stringify(item.custom) === JSON.stringify(customizations),
    )

    if (existingItem) {
      existingItem.qty += 1
    } else {
      cartData.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        qty: 1,
        custom: customizations,
        images: product.images,
      })
    }

    this.setCart(cartData)
    this.updateBadge()
  },

  removeItem(productId, customizations) {
    const cartData = this.getCart()
    cartData.items = cartData.items.filter(
      (item) => !(item.id === productId && JSON.stringify(item.custom) === JSON.stringify(customizations)),
    )
    this.setCart(cartData)
    this.updateBadge()
  },

  updateQuantity(index, qty) {
    const cartData = this.getCart()
    if (qty <= 0) {
      cartData.items.splice(index, 1)
    } else {
      cartData.items[index].qty = qty
    }
    this.setCart(cartData)
    this.updateBadge()
  },

  getCount() {
    const cartData = this.getCart()
    return cartData.items.reduce((total, item) => total + item.qty, 0)
  },

  getSubtotal() {
    const cartData = this.getCart()
    return cartData.items.reduce((total, item) => total + item.price * item.qty, 0)
  },

  updateBadge() {
    const badge = document.querySelector(".cart-badge")
    const count = this.getCount()
    if (badge) {
      badge.textContent = count
      badge.style.display = count > 0 ? "flex" : "none"
    }
  },

  clear() {
    this.setCart({ items: [], currency: "USD" })
    this.updateBadge()
  },
}

// Initialize cart badge on page load
document.addEventListener("DOMContentLoaded", () => {
  cart.updateBadge()
})
