class Routine {
    constructor(name, description, steps) {
        this.name = name;
        this.description = description;
        this.steps = steps;
    }

    addStep(step) {
        this.steps.push(step);
    }

    removeStep(step) {
        this.steps = this.steps.filter(s => s !== step);
    }

    grabProducts()
    {
        let products = [];
        this.steps.forEach(step => {
            products = products.concat(step.products);
        });
        return products;
    }
}

export default Routine;