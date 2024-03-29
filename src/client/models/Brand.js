export default class Brand {
    constructor(brandID, brandName, productCount) {
        this.brandID = brandID;
        this.brandName = brandName;
        this.productCount = productCount;
    }

    static CreateBrand(data) {
        return new Brand(data.brandID, data.brandName, data.productCount);
    }

}