import Brand from "../models/Brand.js";


function CreateBrandList(data) {
    return data.map((brand) => {
        return new Brand(brand.BrandID, brand.BrandName, brand.ProductCount);
    });
}

export default CreateBrandList;