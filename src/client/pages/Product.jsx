import {Fragment, useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {Helmet} from "react-helmet";
import BreadCrumbs from "../components/BreadCrumbs.jsx";

function Product() {
    let [product, setProduct] = useState({});
    let [ingredients, setIngredients] = useState([{}]);
    let {id} = useParams();

    useEffect(() => {
        fetch('http://localhost:3002/product/' + id)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setProduct(data[0])
            });
    }, [id]);

    useEffect(() => {
        fetch('http://localhost:3002/product/' + id + '/ingredients')
            .then(response => response.json())
            .then(data => {
                setIngredients(data);
            });
    }, [id]);

    return (
        <div className="p-10">
            {Object.keys(product).length === 0 ? (
                <span className="loading loading-ring loading-lg align-middle"/>
            ) : (
                <>
                <BreadCrumbs productType={product.ProductTypeName}/>
                <div className="flex container mx-auto p-4">
                    <Helmet>
                        <title>{product.ProductName + " | Skingredients"}</title>
                    </Helmet>
                    <img src={product.ProductPhoto} className="w-80 rounded-lg shadow-lg mb-4" alt="photo"/>

                    <div className="bg-white p-6 rounded-lg shadow-md relative">
                        <Link to={"/brand/" + product.BrandName}
                              className="text-neutral hover:underline">{product.BrandName}</Link>
                        <h1 className="text-2xl font-semibold mb-2">{product.ProductName}</h1>
                        <SkinTypeBadge SkinType={product.SkinType}/>
                        <IngredientBadge ingredients={ingredients}/>
                        <div className="collapse collapse-arrow">
                            <input type="checkbox"/>
                            <div className="collapse-title text-xl font-medium">
                                Ingredients
                            </div>
                            <div className="collapse-content">
                                <div className="">
                                    {ingredients.map((ingredient, index) => {
                                        return (
                                            <Fragment key={index}>
                                                {ingredient[0]},&nbsp;
                                            </Fragment>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                        <button
                            className="absolute top-10 right-10 btn btn-primary"><i className="fa-solid fa-plus"/>Add to Routine
                        </button>
                        <p className="text-lg font-bold text-gray-800 mb-2">${product.Price}</p>
                    </div>
                </div>
                </>
            )}
        </div>
    );
}

function SkinTypeBadge({SkinType})
{
    // split by comma
    const SkinTypes = SkinType.trim().split(",");
    //Trim the whitespace
    SkinTypes.forEach((type, index) => {
        SkinTypes[index] = type.trim();
    });

    return (
        <div className="space-x-2">
            {SkinTypes.includes("Oily") && <div className="badge badge-lg badge-error">Oily</div>}
            {SkinTypes.includes("Dry") && <div className="badge badge-lg badge-success">Dry</div>}
            {SkinTypes.includes("Combination") && <div className="badge badge-lg badge-warning">Combination</div>}
            {SkinTypes.includes("Normal") && <div className="badge badge-lg badge-primary">Normal</div>}
        </div>
    );
}

function IngredientBadge({ingredients}) {
    const importantIngredients = {
        "Retinol": "Retinol",
        "Hyaluronic Acid": "Hyaluronic Acid",
        "Vitamin C": ["Vitamin C", "Ascorbic Acid"],
        "Salicylic Acid": "Salicylic Acid",
        "Niacinamide": "Niacinamide",
        "Ceramides": "Ceramides",
        "Benzoyl Peroxide": "Benzoyl Peroxide",
        "Azelaic Acid": "Azelaic Acid",
        "Glycolic acid": "Glycolic acid",
        "Sulfur": "Sulfur",
        "Lactic acid": "Lactic acid",
        "Vitamin E": "Vitamin E",
    };

    const filteredIngredients = ingredients.filter((ingredient) => {
        for (const [key, value] of Object.entries(importantIngredients)) {
            if (ingredient === key || (Array.isArray(value) && value.includes(ingredient))) {
                return true;
            }
        }
        return false;
    });

    return (
        <>
            {filteredIngredients.map((ingredient, index) => (
                <div key={index} className="badge badge-secondary">
                    {ingredient}
                </div>
            ))}
        </>
    );
}



export default Product;