import {useEffect, useMemo, useState} from "react";
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
    const [filters, setFilters] = useState({ priceRange: '', skinType: '', brand: '', category: ''});
    const [productCount, setProductCount] = useState(0);
    let { brand, category } = useParams();
    
    useEffect(() => {
        if(category)
        {
            setFilters((prevFilters) => ({...prevFilters, [category]: category}));
        }
        
        if(brand)
        {
            setFilters((prevFilters) => ({...prevFilters, [brand]: brand}));
        }
    },[brand, category]);


    useEffect(() => {
        // Construct the API URL

        const params = new URLSearchParams();
        params.append('limit', 15);
        params.append('offset', offset.toString());
        params.append('category', filters.category);
        params.append('brand', filters.brand );
        params.append('priceRange', filters.priceRange);
        params.append('skinType', filters.skinType);

        const apiUrl = `http://localhost:3002/products?${params.toString()}`;
        console.log("API URL", apiUrl)
        // Fetch products from the API
        fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => {
                setProducts((prevProducts) => [...prevProducts, ...CreateProductList(data.data)]);
                setProductCount(data.count);
            })
            .catch((error) => {
                console.error('Error fetching products:', error);
            });
    }, [offset, filters]);

    useEffect(() => {
        if(filters.priceRange || filters.skinType || offset === 0 || brand || category)
        {
            console.log("Filters changed")
            setProducts([]);
            setOffset(0);
        }
    }, [offset, filters, category, brand]);

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
       // TODO: implement removing filters(like unclicking a checkbox)
       console.log("CUTIE" + value, filterType)

        //setFilters((prevFilters) => ({...prevFilters, [filterType]: value}));
        //setOffset(0); // Reset offset
    }

    const pageTitle = category ? `${category}` : brand ? `${brand}` : 'All Products';

    return (
        <div className="flex">
            <Helmet>
                <title>{pageTitle} | Skingredients</title>
            </Helmet>
            <Sidebar brands={brands} onFilterChange={tester} />
            <ProductItems products={products} handleLoadMore={handleLoadMore} productCount={productCount} />
        </div>
    );
}




export default ProductList