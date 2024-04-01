import Product from "../models/Product.js";

function CreateProductList(data)
{
    let productList = data.map((product) => {
        return new Product(product.ProductID, product.ProductName, "", product.ProductType, product.BrandName,
            product.MinPrice, product.MaxPrice, product.ProductPhoto);
    });

    return productList;
}

export default CreateProductList;