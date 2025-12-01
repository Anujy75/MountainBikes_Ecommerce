// Catalog filtering, sorting, and product rendering
const catalog = {
  products: [],
  filters: {
    type: [],
    wheelSize: [],
    priceRange: [0, 5000],
    brand: [],
  },
  currentSort: "newest",

  async init() {
    await this.loadProducts()
    this.setupFilterListeners()
    this.render()
  },

  async loadProducts() {
    try {
      const response = await fetch("/data/products.json")
      this.products = await response.json()
    } catch (error) {
      console.error("[v0] Error loading products:", error)
    }
  },

  setupFilterListeners() {
    const filterButtons = document.querySelectorAll("[data-filter]")
    filterButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const filterType = e.target.dataset.filter
        const filterValue = e.target.dataset.value

        if (this.filters[filterType].includes(filterValue)) {
          this.filters[filterType] = this.filters[filterType].filter((v) => v !== filterValue)
        } else {
          this.filters[filterType].push(filterValue)
        }

        this.render()
      })
    })

    const sortSelect = document.querySelector("[data-sort]")
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        this.currentSort = e.target.value
        this.render()
      })
    }
  },

  getFilteredProducts() {
    return this.products.filter((product) => {
      // Type filter
      if (this.filters.type.length > 0 && !this.filters.type.includes(product.type)) {
        return false
      }

      // Wheel size filter
      if (this.filters.wheelSize.length > 0 && !this.filters.wheelSize.includes(String(product.wheel_size))) {
        return false
      }

      // Price range filter
      if (product.price < this.filters.priceRange[0] || product.price > this.filters.priceRange[1]) {
        return false
      }

      // Brand filter
      if (this.filters.brand.length > 0 && !this.filters.brand.includes(product.brand)) {
        return false
      }

      return true
    })
  },

  getSortedProducts(products) {
    const sorted = [...products]

    switch (this.currentSort) {
      case "price-low":
        sorted.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        sorted.sort((a, b) => b.price - a.price)
        break
      case "newest":
      default:
        // Keep original order (assumed newest first)
        break
    }

    return sorted
  },

  renderProductTile(product) {
    return `
      <div class="product-card">
        <div class="product-image">
          <img src="${product.images[0]}" alt="${product.name}" loading="lazy">
        </div>
        <div class="product-info">
          <span class="product-type">${product.type}</span>
          <h3 class="product-name">${product.name}</h3>
          <div class="product-price">$${product.price.toLocaleString()}</div>
          <div class="product-actions">
            <a href="/product.html?id=${product.id}" class="btn btn-secondary btn-small">Quick View</a>
            <a href="/customize.html?id=${product.id}" class="btn btn-small">Customize</a>
          </div>
        </div>
      </div>
    `
  },

  render() {
    const container = document.querySelector(".products-grid")
    if (!container) return

    const filtered = this.getFilteredProducts()
    const sorted = this.getSortedProducts(filtered)

    container.innerHTML = sorted.map((product) => this.renderProductTile(product)).join("")
  },
}

// Initialize catalog on page load
document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector(".products-grid")) {
    catalog.init()
  }
})
