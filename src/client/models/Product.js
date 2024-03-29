export default class Product {
    constructor(productID, productName, productType, brandName, MinPrice, MaxPrice, PhotoURL) {
        this.productID = productID;
        this.productName = productName;
        this.brandName = brandName;
        this.productType = productType;
        if(PhotoURL !== " ") {
            this.PhotoURL = "./images/" + PhotoURL;
        }
        else {
            this.PhotoURL = "https://www.vocaleurope.eu/wp-content/uploads/no-image.jpg";
        }

        this.Price = MinPrice === MaxPrice ? MinPrice.toFixed(2) : `${MinPrice.toFixed(2)} - \$${MaxPrice.toFixed(2)}`;
    }

    static CreateProduct(data) {
        return new Product(data.productID, data.productName, data.productType, data.brandName, data.MinPrice, data.MaxPrice, data.PhotoURL);
    }

    AddVariants(variants) {
        this.variants = variants;
    }
}