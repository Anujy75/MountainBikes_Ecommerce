// Main app initialization and utilities
const app = {
  init() {
    this.setupMobileNav()
    this.setupSearch()
    this.setupCartBadge()
    this.loadProductData()
  },

  setupMobileNav() {
    const navToggle = document.querySelector(".nav-toggle")
    const navMain = document.querySelector(".nav-main")

    if (navToggle) {
      navToggle.addEventListener("click", () => {
        navMain.classList.toggle("active")
      })
    }

    // Close mobile nav on link click
    const navLinks = document.querySelectorAll(".nav-main a")
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navMain.classList.remove("active")
      })
    })
  },

  setupSearch() {
    const searchIcon = document.querySelector(".search-icon")
    if (searchIcon) {
      searchIcon.addEventListener("click", () => {
        console.log("[v0] Search opened")
      })
    }
  },

  setupCartBadge() {
    const cart = { getCount: () => 0 } // Placeholder for cart object
    const cartCount = cart.getCount()
    const badge = document.querySelector(".cart-badge")
    if (badge && cartCount > 0) {
      badge.textContent = cartCount
    }
  },

  async loadProductData() {
    try {
      const response = await fetch("/data/products.json")
      const products = await response.json()
      window.productsData = products
    } catch (error) {
      console.error("[v0] Error loading products:", error)
    }
  },
}

// Initialize app on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  app.init()
})
