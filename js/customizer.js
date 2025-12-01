// Bike customizer with stepper UI and live price calculation
const customizer = {
  currentStep: 1,
  steps: ["Frame", "Wheels", "Suspension", "Brakes", "Extras"],
  basePrice: 0,
  customOptions: {},

  priceModifiers: {
    frame: {
      "Alloy Standard": 0,
      "Alloy Premium": 200,
      Carbon: 800,
    },
    wheels: {
      "26in": 0,
      "27.5in": 150,
      "29in": 150,
      "650c": 100,
      "Upgraded Carbon": 600,
    },
    suspension: {
      "90mm": 0,
      "120mm": 300,
      "160mm": 600,
      "200mm": 1000,
    },
    brakes: {
      "Mechanical Disc": 0,
      "Hydraulic Disc": 400,
      "Premium Hydraulic": 800,
    },
    extras: {
      "Dropper Post": 250,
      "Flat Pedals": 100,
      "Grips Upgrade": 50,
      "Lights Package": 120,
    },
  },

  init(basePrice) {
    this.basePrice = basePrice
    this.customOptions = {
      frame: "",
      wheels: "",
      suspension: "",
      brakes: "",
      extras: [],
    }
    this.renderStepper()
  },

  renderStepper() {
    const stepperContainer = document.querySelector(".stepper-steps")
    if (!stepperContainer) return

    stepperContainer.innerHTML = this.steps
      .map(
        (step, i) => `
      <div class="stepper-step ${i + 1 === this.currentStep ? "active" : ""} ${i + 1 < this.currentStep ? "completed" : ""}">
        <div class="stepper-number">${i + 1}</div>
        <div class="stepper-label">${step}</div>
      </div>
    `,
      )
      .join("")
  },

  renderStepContent() {
    const contentContainer = document.querySelector(".stepper-content")
    if (!contentContainer) return

    let content = ""
    const step = this.steps[this.currentStep - 1]

    switch (step) {
      case "Frame":
        content = this.renderFrameOptions()
        break
      case "Wheels":
        content = this.renderWheelsOptions()
        break
      case "Suspension":
        content = this.renderSuspensionOptions()
        break
      case "Brakes":
        content = this.renderBrakesOptions()
        break
      case "Extras":
        content = this.renderExtrasOptions()
        break
    }

    contentContainer.innerHTML = content
    this.attachOptionListeners()
  },

  renderFrameOptions() {
    return `
      <h3>Select Frame Material</h3>
      <div class="options-grid">
        ${Object.keys(this.priceModifiers.frame)
          .map(
            (option) => `
          <label class="option-label">
            <input type="radio" name="frame" value="${option}" ${this.customOptions.frame === option ? "checked" : ""}>
            <span>${option}</span>
            <span class="price-delta">+$${this.priceModifiers.frame[option]}</span>
          </label>
        `,
          )
          .join("")}
      </div>
    `
  },

  renderWheelsOptions() {
    return `
      <h3>Select Wheel Size</h3>
      <div class="options-grid">
        ${Object.keys(this.priceModifiers.wheels)
          .map(
            (option) => `
          <label class="option-label">
            <input type="radio" name="wheels" value="${option}" ${this.customOptions.wheels === option ? "checked" : ""}>
            <span>${option}</span>
            <span class="price-delta">+$${this.priceModifiers.wheels[option]}</span>
          </label>
        `,
          )
          .join("")}
      </div>
    `
  },

  renderSuspensionOptions() {
    return `
      <h3>Select Suspension Travel</h3>
      <div class="options-grid">
        ${Object.keys(this.priceModifiers.suspension)
          .map(
            (option) => `
          <label class="option-label">
            <input type="radio" name="suspension" value="${option}" ${this.customOptions.suspension === option ? "checked" : ""}>
            <span>${option}</span>
            <span class="price-delta">+$${this.priceModifiers.suspension[option]}</span>
          </label>
        `,
          )
          .join("")}
      </div>
    `
  },

  renderBrakesOptions() {
    return `
      <h3>Select Brake Type</h3>
      <div class="options-grid">
        ${Object.keys(this.priceModifiers.brakes)
          .map(
            (option) => `
          <label class="option-label">
            <input type="radio" name="brakes" value="${option}" ${this.customOptions.brakes === option ? "checked" : ""}>
            <span>${option}</span>
            <span class="price-delta">+$${this.priceModifiers.brakes[option]}</span>
          </label>
        `,
          )
          .join("")}
      </div>
    `
  },

  renderExtrasOptions() {
    return `
      <h3>Add Extras</h3>
      <div class="options-grid">
        ${Object.keys(this.priceModifiers.extras)
          .map(
            (option) => `
          <label class="option-label">
            <input type="checkbox" name="extras" value="${option}" ${this.customOptions.extras.includes(option) ? "checked" : ""}>
            <span>${option}</span>
            <span class="price-delta">+$${this.priceModifiers.extras[option]}</span>
          </label>
        `,
          )
          .join("")}
      </div>
    `
  },

  attachOptionListeners() {
    const radios = document.querySelectorAll('input[type="radio"]')
    const checkboxes = document.querySelectorAll('input[type="checkbox"]')

    radios.forEach((radio) => {
      radio.addEventListener("change", (e) => {
        const step = this.steps[this.currentStep - 1].toLowerCase()
        this.customOptions[step] = e.target.value
        this.updatePrice()
      })
    })

    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", (e) => {
        if (e.target.checked) {
          this.customOptions.extras.push(e.target.value)
        } else {
          this.customOptions.extras = this.customOptions.extras.filter((item) => item !== e.target.value)
        }
        this.updatePrice()
      })
    })
  },

  updatePrice() {
    let total = this.basePrice

    total += this.priceModifiers.frame[this.customOptions.frame] || 0
    total += this.priceModifiers.wheels[this.customOptions.wheels] || 0
    total += this.priceModifiers.suspension[this.customOptions.suspension] || 0
    total += this.priceModifiers.brakes[this.customOptions.brakes] || 0

    this.customOptions.extras.forEach((extra) => {
      total += this.priceModifiers.extras[extra] || 0
    })

    const priceDisplay = document.querySelector(".customizer-price")
    if (priceDisplay) {
      priceDisplay.textContent = `$${total.toLocaleString()}`
    }
  },

  nextStep() {
    if (this.currentStep < this.steps.length) {
      this.currentStep++
      this.renderStepper()
      this.renderStepContent()
    }
  },

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--
      this.renderStepper()
      this.renderStepContent()
    }
  },

  getCustomizationData() {
    return {
      ...this.customOptions,
      totalPrice: this.basePrice + this.calculatePriceModifier(),
    }
  },

  calculatePriceModifier() {
    let modifier = 0
    modifier += this.priceModifiers.frame[this.customOptions.frame] || 0
    modifier += this.priceModifiers.wheels[this.customOptions.wheels] || 0
    modifier += this.priceModifiers.suspension[this.customOptions.suspension] || 0
    modifier += this.priceModifiers.brakes[this.customOptions.brakes] || 0
    this.customOptions.extras.forEach((extra) => {
      modifier += this.priceModifiers.extras[extra] || 0
    })
    return modifier
  },
}
