import {Link, NavLink} from "react-router-dom";
import {useEffect, useState} from "react";

function ProductItems({products, handleLoadMore, productCount}) {
    const [isMoreProducts, setIsMoreProducts] = useState(true);

    useEffect(() => {
        if(products.length === productCount && productCount !== 0 || productCount === 0)
        {
            setIsMoreProducts(false);
        }
        else
        {
            setIsMoreProducts(true);
        }
    }, [products, productCount]);

    return (
        <div className="pt-10 pb-10">
            <div className="flex flex-wrap gap-4 p-8">
                {products.map((product, index) => (
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
                                <p className="product-name pb-2">{product.productName}</p>
                                <p><b>${product.Price}</b></p>
                            </Link>
                        </div>
                    </div>
                ))}
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
            </div>
        </div>
    );
}

export default ProductItems;