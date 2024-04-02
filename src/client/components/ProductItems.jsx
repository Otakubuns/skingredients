import {Link, NavLink} from "react-router-dom";
import {useEffect, useState} from "react";

function ProductItems({products, handleLoadMore, productCount, handleSortChange}) {
    const [isMoreProducts, setIsMoreProducts] = useState(true);
    const [imagesLoaded, setImagesLoaded] = useState(false);

    useEffect(() => {
        if(products.length === productCount && productCount !== 0 || productCount === 0 || products.length > productCount)
        {
            setIsMoreProducts(false);
        }
        else
        {
            setIsMoreProducts(true);
        }

        let imagesLoadedCount = 0;
        products.forEach(product => {
            const img = new Image();
            img.src = `${import.meta.env.BASE_URL}images/${product.PhotoURL}`;
            img.onload = () => {
                imagesLoadedCount++;
                if (imagesLoadedCount === products.length) {
                    setImagesLoaded(true);
                }
            };
        });
    }, [products, productCount]);

    return (
        <div className="pt-10 pb-10 min-w-[0] relative">
            <select className="select select-ghost max-w-xs" onChange={handleSortChange} defaultValue="Sort by:">
                <option disabled>Sort by:</option>
                <option>Price (Low - High)</option>
                <option>Price (High - Low)</option>
                <option>Alphabetical (A - Z)</option>
                <option>Alphabetical (Z - A)</option>
            </select>
            <div className="flex flex-wrap gap-3.5 p-6">
                {imagesLoaded && products.map((product, index) => (
                    <div className="card card-compact w-56 bg-base-100" key={index}>
                        <NavLink to={`/product/${product.productID}`}>
                            <figure>
                                <img src={`${import.meta.env.BASE_URL}images/${product.PhotoURL}`} alt="photo" />
                            </figure>
                        </NavLink>
                        <div className="card-body">
                            <Link to={`/brand/${product.brandName}`} className="text-neutral hover:underline">
                                <p><b>{product.brandName}</b></p>
                            </Link>
                            <Link to={`/product/${product.productID}`} className="group">
                                <p className="product-name pb-2 -mt-1">{product.productName}</p>
                                <p><b>${product.Price}</b></p>
                            </Link>
                        </div>
                    </div>
                ))}
                {imagesLoaded && products.length > 0 &&(
                <div className="w-60 m-auto px-5">
                    {products.length === 0 && (
                        <p className="text-gray-500 text-center">Sorry, no products found :(</p>
                    )}
                    {products.length > 0 && (
                        <p className="text-gray-500 text-center">1 - {products.length} of {productCount} Results</p>
                    )}
                    {isMoreProducts && (
                        <button className="btn btn-primary btn-block" onClick={handleLoadMore}>Load More</button>
                    )}
                </div>
                )}
                {!imagesLoaded && (
                    <div className="w-60 m-auto px-5">
                        <span className="loading loading-spinner text-primary"/>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProductItems;