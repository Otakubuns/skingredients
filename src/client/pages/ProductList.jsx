import {useEffect, useState} from "react";
import CreateProductList from "../utils/ProductsCreate.js";
import {Helmet} from "react-helmet";
import {useParams} from "react-router-dom";
import ProductItems from "../components/ProductItems.jsx";
import Sidebar from "../components/Sidebar.jsx";
import CreateBrands from "../utils/BrandsCreate.js";

function ProductList() {
    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [offset, setOffset] = useState(0);
    const [filters, setFilters] = useState({priceRange: '', skinType: '', brand: '', category: '', sort: ''});
    const [productCount, setProductCount] = useState(0);
    let {brand, category} = useParams();
    const [currentCategory, setCurrentCategory] = useState(category);
    const [currentBrand, setCurrentBrand] = useState(brand);
    const [isLoading, setIsLoading] = useState(true);

    const fetchProducts = async () => {
        console.log("Bonjour")
        const params = new URLSearchParams();
        params.append('limit', 30);
        params.append('offset', offset.toString());

        console.log(filters)
        Object.keys(filters).forEach(key => {
            if (filters[key]) {
                params.append(key, filters[key]);
            }
        });

        const apiUrl = `http://localhost:3002/products?${params.toString()}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        if(data.data.length === 0) return;

        const newProducts = CreateProductList(data.data);
        const combinedProducts = [...products, ...newProducts];

        const uniqueProducts = combinedProducts.filter((product, index, self) =>
            index === self.findIndex((p) => p.productID === product.productID)
        );

        setProducts(uniqueProducts);
        setProductCount(data.count);
    };

    useEffect(() => {
        if (category !== currentCategory) {
            console.log("Resetting")
            setCurrentCategory(category);
            setFilters(prevFilters => ({...prevFilters, category: category}));
            setOffset(0);
            setProducts([]);
        }
        if (brand !== currentBrand) {
            console.log("Resetting")
            setCurrentBrand(brand);
            setFilters(prevFilters => ({...prevFilters, brand: brand}));
            setOffset(0);
            setProducts([]);
        }
    }, [category, brand, filters]);

    useEffect(() => {
        if (!isLoading) { // Only fetch products if not loading
            fetchProducts();
        }
    }, [filters, offset, isLoading]);

    useEffect(() => {
        if (category) {
            setFilters(prevFilters => ({...prevFilters, category: category}));
        }
        if (brand) {
            setFilters(prevFilters => ({...prevFilters, brand: brand}));
        }
        setIsLoading(false); // Set loading to false after initial filters have been set
    }, []);

    useEffect(() => {
        fetch('http://localhost:3002/brands')
            .then(response => response.json())
            .then(data => {
                setBrands(CreateBrands(data));
            });
    }, []);

    const handleLoadMore = () => {
        setOffset(offset + 30); // Increase offset
    };

    const handleSortChange = (event) => {
        if (event.target.value === 'Sort by:') return;
        let selectedValue = event.target.value;
        handleFilterChange(selectedValue, 'sort')
    }

    function handleFilterChange(value, filterType) {
        setFilters(prevFilters => {
            return {...prevFilters, [filterType]: value};
        });
        setOffset(0);
        setProducts([]);
    }

    const pageTitle = category ? `${category}` : brand ? `${brand}` : 'All Products';

    return (
        <div className="flex w-full">
            <Helmet>
                <title>{pageTitle} | Skingredients</title>
            </Helmet>
            <Sidebar brands={brands} onFilterChange={handleFilterChange} currentCategory={currentCategory}/>
            <ProductItems products={products} handleLoadMore={handleLoadMore} productCount={productCount}
                          handleSortChange={handleSortChange}/>
        </div>
    );
}

export default ProductList