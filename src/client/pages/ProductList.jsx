import {useEffect, useMemo, useRef, useState} from "react";
import CreateProductList from "../utils/ProductsCreate.js";
import {Helmet} from "react-helmet";
import {Link, NavLink, useParams} from "react-router-dom";
import ProductItems from "../components/ProductItems.jsx";
import Sidebar from "../components/Sidebar.jsx";
import CreateBrands from "../utils/BrandsCreate.js";

function ProductList() {
    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [offset, setOffset] = useState(0);
    const [filters, setFilters] = useState({priceRange: '', skinType: '', brand: '', category: ''});
    const [productCount, setProductCount] = useState(0);
    let {brand, category} = useParams();
    const [currentCategory, setCurrentCategory] = useState(category);
    const [currentBrand, setCurrentBrand] = useState(brand);

// TODO: /category and /brand bring duplicate data so its being run twice, gotta fix dependencies
    useEffect(() => {
        if (filters.priceRange || filters.skinType || offset === 0 || category || brand) {
            console.log('resetting products')
            setProducts([]);
            setOffset(0);
        }

        const params = new URLSearchParams();
        params.append('limit', 15);
        params.append('offset', offset.toString());

        if (filters.category && category) params.append('category', filters.category);
        if (filters.brand) params.append('brand', filters.brand);
        if (category && !filters.category) params.append('category', category);
        if (brand && !filters.brand) params.append('brand', brand);
        if (filters.priceRange) params.append('priceRange', filters.priceRange);
        if (filters.skinType) params.append('skinType', filters.skinType);

        const apiUrl = `http://localhost:3002/products?${params.toString()}`;
        console.log(apiUrl)
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                setProducts((prevProducts) => {
                    return prevProducts.concat(CreateProductList(data.data));
                });
                setProductCount(data.count);
            })
            .catch((error) => {
                console.error('Error fetching products:', error);
            });
    }, [offset, filters, category, brand]);

    useEffect(() => {
        console.log("cate or brand changed")
        if (category !== currentCategory) setCurrentCategory(category);
        if (brand !== currentBrand) setCurrentBrand(brand);
    }, [category, brand]);

    useEffect(() => {
        fetch('http://localhost:3002/brands')
            .then(response => response.json())
            .then(data => {
                setBrands(CreateBrands(data));
            });
    }, []);

    const handleLoadMore = () => {
        setOffset(offset + 15); // Increase offset
    };

    function tester(value, filterType) {
        console.log(filterType, value)
        // TODO: implement removing filters(like unclicking a checkbox)

        setFilters((prevFilters) => ({...prevFilters, [filterType]: value}));
        setOffset(0); // Reset offset
    }

    useEffect(() => {
        console.log(filters)
    }, [filters])

    const pageTitle = category ? `${category}` : brand ? `${brand}` : 'All Products';

    return (
        <div className="flex">
            <Helmet>
                <title>{pageTitle} | Skingredients</title>
            </Helmet>
            <Sidebar brands={brands} onFilterChange={tester} currentCategory={currentCategory}/>
            <ProductItems products={products} handleLoadMore={handleLoadMore} productCount={productCount}/>
        </div>
    );
}


export default ProductList