class Routine {
  constructor(name, description, steps = "", products) {
    this.name = name;
    this.description = description;
    this.steps = steps;
    this.products = products;
  }
}

export default Routine;