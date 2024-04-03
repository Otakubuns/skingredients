import {Fragment, useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {Helmet} from "react-helmet";
import BreadCrumbs from "../components/BreadCrumbs.jsx";
import {generateIdAndCreateRoutine} from "../utils/RoutineHelper.js";
import SkinTypeBadge from "../components/SkinTypeBadge.jsx";
import IngredientBadge from "../components/IngredientBadge.jsx";

function Product() {
    let [product, setProduct] = useState({});
    let [ingredients, setIngredients] = useState([{}]);
    let [selectedPrice, setSelectedPrice] = useState(null);
    let [selectedVariant, setSelectedVariant] = useState(null);
    const [timePeriod, setTimePeriod] = useState('');
    let {id} = useParams();
    const navigate = useNavigate();

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

                setSelectedVariant(data[0].Variants[0]);
                setSelectedPrice(data[0].Variants[0].Price);
            });
    }, [id]);

    const addProductToRoutine = async () => {
        if(timePeriod === '') return;
        product.Price = selectedPrice !== null ? selectedPrice : product.Variants[0].Price;

        const productData = {
            id: product.ProductID,
            name: product.ProductName,
            price: product.Price,
            brand: product.BrandName,
            category: product.ProductTypeName,
            photo: product.ProductPhoto,
            skinType: product.SkinType,
            ingredients: ingredients,
        };

        // check first is there any routine in local storage
        let routine = JSON.parse(localStorage.getItem('routine'));

        if (routine === null) {
            // if no routine, create a new routine
            const newRoutineID = await generateIdAndCreateRoutine();
            routine = {id: newRoutineID, name: 'Default Routine', description: 'Just a default routine to get you started. Feel free to edit it to your liking.', steps: [], products: [], AM: {products: []}, PM: {products: []}};
            localStorage.setItem('routine', JSON.stringify(routine));
        }

        // add product to the correct routine (AM or PM) based on the timePeriod state
        if (timePeriod === 'AM') {
            routine.AM.products.push(productData);
        } else if (timePeriod === 'PM') {
            routine.PM.products.push(productData);
        }

        localStorage.setItem('routine', JSON.stringify(routine));

        // redirect to routine page
        navigate('/routine/' + routine.id);
    }

    const handleInputChange = (event) => {
        setTimePeriod(event.target.value);
    };

    return (
        <div className="p-10">
            {Object.keys(product).length === 0 ? (
                <span className="loading loading-ring loading-lg align-middle"/>
            ) : (
                <>
                    <div className="pl-4">
                        <BreadCrumbs productType={product.ProductTypeName}/>
                    </div>
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
                                    <div className="flex flex-row gap-2 justify-left">
                                        {product.Variants.map((variant, index) => {
                                            return (
                                                <button key={index} className={`flex items-center gap-2 border rounded 
                                                mt-2 p-1 hover:bg-gray-100 ${variant === selectedVariant ? 'bg-gray-200 border-primary border-2' : ''}`}
                                                        onClick={() => {
                                                            setSelectedPrice(variant.Price);
                                                            setSelectedVariant(variant);
                                                        }}>
                                                    <p className="font-bold text-gray-800">${variant.Price}</p>
                                                    <p className="text-gray-500 text-sm">{variant.Amount}</p>
                                                </button>
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
                                <div className="flex flex-col">
                                    <select name="timePeriod" onChange={handleInputChange}
                                            className="text-sm font-light w-40 text-center my-2 bg-gray-100 border-b-2 border-primary p-2 rounded-md">
                                        <option value="" defaultValue="AM">Select Time Period</option>
                                        <option value="AM">AM</option>
                                        <option value="PM">PM</option>
                                    </select>
                                    <button className="btn btn-neutral mr-auto"
                                            onClick={() => addProductToRoutine()}>
                                        <i className="fa-solid fa-plus"/>Add to Routine
                                    </button>
                                </div>


                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}


export default Product;