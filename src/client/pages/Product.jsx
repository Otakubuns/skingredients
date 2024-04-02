import {Fragment, useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {Helmet} from "react-helmet";
import BreadCrumbs from "../components/BreadCrumbs.jsx";
import activeIngredients from "../utils/activeingredients.json";

function Product() {
    let [product, setProduct] = useState({});
    let [ingredients, setIngredients] = useState([{}]);
    let {id} = useParams();

    useEffect(() => {
        fetch('http://localhost:3002/product/' + id)
            .then(response => response.json())
            .then(data => {
                data[0].ProductDescription = data[0].ProductDescription.replace(/<[^>]*>?/gm, '');


                if (data[0].Variants.length === 1) {
                    setProduct({...data[0], Price: data[0].Variants[0].Price})
                    setIngredients(data[0].Ingredients);
                    return;
                }

                setProduct(data[0]);
                setIngredients(data[0].Ingredients)
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

                        <div className="bg-white p-6 border rounded-lg relative flex">
                            <img src={`${import.meta.env.BASE_URL}images/${product.ProductPhoto}`}
                                 className="w-80 no-stretch object-top" alt="photo"/>
                            <div className="ml-6">
                                <Link to={"/brand/" + product.BrandName}
                                      className="text-neutral hover:underline">{product.BrandName}</Link>
                                <h1 className="text-2xl font-semibold mb-2">{product.ProductName}</h1>
                                <SkinTypeBadge SkinType={product.SkinType}/>
                                <IngredientBadge ingredients={ingredients}/>

                                {product.Variants.length > 1 && (
                                    // Display variants(with price and amount)
                                    <div className="flex flex-row gap-2 justify-left">
                                        {product.Variants.map((variant, index) => {
                                            return (
                                                <div key={index} className="flex items-center gap-2 border rounded mt-2 p-1">
                                                    <p className="font-bold text-gray-800">${variant.Price}</p>
                                                    <p className="text-gray-500 text-sm">{variant.Amount}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                                {product.Variants.length === 1 && (
                                    <div className="flex items-center gap-2 mt-2 p-1 ">
                                        <p className="font-bold text-gray-800">${product.Price}</p>
                                        <p className="text-gray-500 text-sm">{product.Variants[0].Amount}</p>
                                    </div>
                                )}
                                <div className="divider"/>
                                <div className="collapse collapse-arrow border-b-2">
                                    <input type="checkbox"/>
                                    <div className="collapse-title text-xl font-medium">
                                        Description
                                    </div>
                                    <div className="collapse-content">
                                        <p>{product.ProductDescription}</p>
                                    </div>
                                </div>
                                <div className="collapse collapse-arrow border-b-2">
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
                                {/*<button*/}
                                {/*    className="btn m-3 btn-primary text-right ml-auto">*/}
                                {/*    <i className="fa-solid fa-plus"/>Add to Routine*/}
                                {/*</button>*/}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

function SkinTypeBadge({SkinType}) {
    // split by comma
    const SkinTypes = SkinType.trim().split(",");
    //Trim the whitespace
    SkinTypes.forEach((type, index) => {
        SkinTypes[index] = type.trim();
    });

    return (
        <div className="space-x-2 pb-1">
            {SkinTypes.includes("Oily") && <div className="badge badge-lg badge-error">Oily</div>}
            {SkinTypes.includes("Dry") && <div className="badge badge-lg badge-success">Dry</div>}
            {SkinTypes.includes("Combination") && <div className="badge badge-lg badge-warning">Combination</div>}
            {SkinTypes.includes("Normal") && <div className="badge badge-lg badge-primary">Normal</div>}
            {SkinTypes.includes("Sensitive") && <div className="badge badge-lg badge-accent">Sensitive</div>}
        </div>
    );
}

function IngredientBadge({ingredients}) {
    const lowerCaseIngredients = ingredients.map(ingredient => ingredient.toString().toLowerCase());

    const matchedIngredients = activeIngredients.activeIngredients.filter(ingredient => {
        const lowerCaseName = ingredient.name.toLowerCase();
        const lowerCaseAssociatedIngredients = ingredient.associated_ingredients.map(ingredient => ingredient.toString().toLowerCase());

        return lowerCaseIngredients.some(productIngredient => productIngredient.includes(lowerCaseName)) ||
            lowerCaseAssociatedIngredients.some(associatedIngredient => lowerCaseIngredients.some(productIngredient => productIngredient.includes(associatedIngredient)));
    });

    return (
        <div className="flex gap-3">
            {matchedIngredients.map((ingredient, index) => {
                return (
                    <div className="tooltip" data-tip={ingredient.benefits} key={index}>
                        <div className="badge badge-lg badge-primary">
                            {ingredient.name}
                        </div>
                    </div>
                );
            })}
        </div>
    );

}


export default Product;