import {Helmet} from "react-helmet";
import {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faPlus, faSave, faTimes, faTrash} from "@fortawesome/free-solid-svg-icons";
import SearchBar from "../components/SearchBar.jsx";
import InputField from "../components/InputField.jsx";
import IngredientBadge from "../components/IngredientBadge.jsx";
import activeIngredients from "../utils/activeingredients.json";


function RoutineCreator() {
    const routineID = useParams().id;
    const [isEditing, setIsEditing] = useState(false);
    const [currentProductIndex, setCurrentProductIndex] = useState(null);
    const [editingProduct, setEditingProduct] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState({});
    const [isAddingProduct, setIsAddingProduct] = useState(false);
    const [currentRoutine, setCurrentRoutine] = useState('AM');
    const [isAMNoticesOpen, setIsAMNoticesOpen] = useState(true);
    const [isPMNoticesOpen, setIsPMNoticesOpen] = useState(true);
    const AM_SKINCARE_ORDER = ["cleanser", "toner", "brightening", "serum", "eye cream", "spot treatments", "moisturizer", "face oil", "sunscreen"];
    const PM_SKINCARE_ORDER = ["cleanser", "exfoliator", "toner", "serum", "eye cream", "spot treatments", "anti-aging", "moisturizer", "retinol", "face oil"];
    const [AMNotices, setAMNotices] = useState([]);
    const [PMNotices, setPMNotices] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    function checkIfRoutineExists(routineID) {
        // return fetch('src/client/utils/routines.json')
        //     .then(response => response.json())
        //     .then(data => {
        //         // Check if the routine with the given ID exists in the data(if it does, return the routine)
        //         const routine = data.routines.find(routine => routine.id === routineID);
        //         if (routine) {
        //             setRoutine(routine);
        //             return true;
        //         } else {
        //             return false;
        //         }
        //     })
        //     .catch(error => {
        //         console.error('An error occurred while fetching the routines:', error);
        //         return false;
        //     });
    }

    // useEffect(() => {
    //     checkIfRoutineExists(routineID).then();
    // }, []);

    useEffect(() => {
        const modal = document.getElementById('searchModal');

        const handleModalClose = () => {
            setIsAddingProduct(false);
        };

        modal.addEventListener('close', handleModalClose);

        // Clean up the event listener when the component is unmounted
        return () => {
            modal.removeEventListener('close', handleModalClose);
        };
    }, []);

    useEffect(() => {
        const savedRoutine = localStorage.getItem('routine');
        if (savedRoutine) {
            setRoutine(JSON.parse(savedRoutine));
        }
    }, []);

    const [routine, setRoutine] = useState({
        id: routineID,
        name: 'Default Routine',
        description: 'Just a default routine to get you started. Feel free to edit it to your liking.',
        AM: {
            products: []
        },
        PM: {
            products: []
        },
        notes: ''
    });

    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        ingredients: [],
        price: ''
    });


    const handleInputChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        if (!formData.name || !formData.brand || !formData.price) return;
        let ingredients = []
        if (typeof formData.ingredients === 'string' && formData.ingredients.includes(',') && formData.ingredients.length > 1) {
            ingredients = formData.ingredients.split(',').map(ingredient => ingredient.trim());
        }
        if (!formData.ingredients) ingredients = [];
        setFormData({
            ...formData,
            ingredients: ingredients,
            photo: '',
            customProduct: true
        });

        const newProduct = {...formData, customID: Date.now()};

        setRoutine({
            ...routine,
            [currentRoutine]: {
                ...routine[currentRoutine],
                products: [...routine[currentRoutine].products, newProduct]
            }
        });

        setFormData({
            name: '',
            brand: '',
            ingredients: [],
            price: '',
            category: ''
        });

        setIsAddingProduct(false);
        document.getElementById('searchModal').close();
    };

    const handleDeleteProduct = (customID) => {
        setRoutine(prevRoutine => {
            const updatedAMProducts = prevRoutine.AM.products.filter(product => product.customID !== customID);
            const updatedPMProducts = prevRoutine.PM.products.filter(product => product.customID !== customID);
            return {
                ...prevRoutine,
                AM: {
                    ...prevRoutine.AM,
                    products: updatedAMProducts
                },
                PM: {
                    ...prevRoutine.PM,
                    products: updatedPMProducts
                }
            };
        });

        // Reset editing state
        setCurrentProductIndex(null);
        setEditingProduct(null);
    };

    const handleEditProduct = (productId) => {
        const product = routine.products[productId];
        setIsEditing(true);
        setCurrentProductIndex(productId);
        setEditingProduct(product);
    };

    const handleUpdateProduct = () => {
        setRoutine(prevRoutine => {
            const updatedProducts = [...prevRoutine.products];
            updatedProducts[currentProductIndex] = editingProduct;
            return {...prevRoutine, products: updatedProducts};
        });

        // Reset editing state
        setIsEditing(false);
        setCurrentProductIndex(null);
        setEditingProduct(null);
    };

    const handleSelectedProductChange = (selectedProduct) => {
        const newProduct = {
            name: selectedProduct.ProductName,
            brand: selectedProduct.BrandName,
            ingredients: selectedProduct.Ingredients,
            price: selectedProduct.Variants[0].Price,
            category: selectedProduct.ProductTypeName,
            id: selectedProduct.ProductID,
            photo: selectedProduct.ProductPhoto,
            customID: Date.now(),
            customProduct: false
        }

        const productExists = routine[currentRoutine].products.some(product => product.id === newProduct.id);

        if (!productExists) {
            setRoutine({
                ...routine,
                [currentRoutine]: {
                    ...routine[currentRoutine],
                    products: [...routine[currentRoutine].products, newProduct]
                }
            });
        }
        else{
            alert('This product already exists in routine');
        }

        document.getElementById('searchModal').close();
    };

    const handleRoutineChange = (event) => {
        setRoutine({
            ...routine,
            [event.target.name]: event.target.value
        });
    }

    useEffect(() => {
        // Set the total price of the routine
        let totalPrice = 0;
        let addedProducts = [];

        routine.AM.products.concat(routine.PM.products).forEach(product => {
            if (!addedProducts.includes(product.name)) {
                totalPrice += parseFloat(product.price);
                addedProducts.push(product.name);
            }
        });

        setTotalPrice(totalPrice);

        setAMNotices([]);
        setPMNotices([]);

        // Checking for common skincare routine mistakes or missing products
        const hasSunscreen = routine.AM.products.some(product => product.category.toLowerCase().includes('sunscreen'));

        if (!hasSunscreen) {
            addNotice('AM', createStyledNotice('☀️ Make sure to add sunscreen to your morning routine. Sunscreen is essential for protecting your skin from UV damage.', '.'));
        }

        const hasCleanser = routine.PM.products.some(product => product.category.toLowerCase().includes('cleanser'));

        if (!hasCleanser) {
            addNotice('PM', createStyledNotice('🧼 Make sure to add a cleanser to your night routine. Cleansing your skin is essential for removing dirt, oil, and makeup.', '.'));
        }

        const hasAMMoisturizer = routine.AM.products.some(product => product.category.toLowerCase().includes('moisturizer'));
        if(!hasAMMoisturizer){
            addNotice('AM', createStyledNotice('💧 Make sure to add a moisturizer to your morning routine. Moisturizing your skin helps keep it hydrated and healthy.', '.'));
        }

        const hasPMMoisturizer = routine.PM.products.some(product => product.category.toLowerCase().includes('moisturizer'));
        if(!hasPMMoisturizer){
            addNotice('PM', createStyledNotice('💧 Make sure to add a moisturizer to your night routine. Moisturizing your skin helps keep it hydrated and healthy.', '.'));
        }

        // Check for active cleansers
        checkAndAddNotice('PM', ingredient => ['salicylic acid', 'glycolic acid', 'lactic acid', 'mandelic acid', 'benzoyl peroxide'].includes(ingredient), createStyledNotice('🧼 Your cleanser has active ingredients. Leaving it on your skin for a minute or two can help them work better.', '.'));

        // Check for active AM cleansers
        checkAndAddNotice('AM', ingredient => ['salicylic acid', 'glycolic acid', 'lactic acid', 'mandelic acid', 'benzoyl peroxide'].includes(ingredient), createStyledNotice('🧼 Your morning cleanser has active ingredients. Leaving it on your skin for a minute allows the actives to activate.', '.'));

        // Check for retinol
        checkAndAddNotice('PM', ingredient => ingredient.includes('retinol', 'retinoid', 'Vitamin A'), '🧴 Retinol can increase your skin\'s sensitivity to the sun, so be sure to apply sunscreen during the day. If you\'re new to retinol, start by using it once a week and gradually increase the frequency to give your skin time to adjust.');

        CheckForIngredientConflicts();

    }, [routine]);

    function CheckForIngredientConflicts() {
        const AMProducts = routine.AM.products;
        const PMProducts = routine.PM.products;

        const AMIngredients = AMProducts.map(product => [].concat(...product.ingredients));
        const PMIngredients = PMProducts.map(product => [].concat(...product.ingredients));

        const activeIngredientsList = activeIngredients.activeIngredients;

    }

    function checkAndAddNotice(routineType, checkCondition, noticeMessage) {
        const hasCondition = routine[routineType].products.some(product => {
            // Flatten the ingredients array
            const ingredients = [].concat(...product.ingredients);
            return ingredients.some(ingredient => checkCondition(ingredient.toLowerCase()));
        });
        if (hasCondition) {
            addNotice(routineType, noticeMessage);
        }
    }

    function createStyledNotice(notice, split) {
        const noticeParts = notice.split(split);

        return (
            <>
                {noticeParts.map((part, index) => index === 0 ? <strong key={index}>{part}</strong> : split + part)}
            </>
        );
    }

    function addNotice(routineType, notice) {
        if (routineType === 'AM') {
            setAMNotices(prevNotices => {
                if (!prevNotices.includes(notice)) {
                    return [...prevNotices, notice];
                } else {
                    return prevNotices;
                }
            });
        } else if (routineType === 'PM') {
            setPMNotices(prevNotices => {
                if (!prevNotices.includes(notice)) {
                    return [...prevNotices, notice];
                } else {
                    return prevNotices;
                }
            });
        }
    }

    function sortProductsBySkincareOrder(products, time) {
        const SKINCARE_ORDER = time === 'AM' ? AM_SKINCARE_ORDER : PM_SKINCARE_ORDER;

        return products.sort((a, b) => {
            const orderOfA = SKINCARE_ORDER.findIndex(order => a.category.toLowerCase().includes(order));
            const orderOfB = SKINCARE_ORDER.findIndex(order => b.category.toLowerCase().includes(order));

            if (orderOfA < orderOfB) {
                return -1;
            }
            if (orderOfA > orderOfB) {
                return 1;
            }
            return 0;
        });
    }


    function saveRecommendedRoutine() {
        fetch('http://localhost:3002/saveRoutine', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(routine),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // clear the routine
                    setRoutine({
                        id: routineID,
                        name: 'Default Routine',
                        description: 'Just a default routine to get you started. Feel free to edit it to your liking.',
                        AM: {
                            products: []
                        },
                        PM: {
                            products: []
                        },
                        notes: ''
                    });
                    // clear notices and memory
                    setAMNotices([]);
                    setPMNotices([]);
                    localStorage.removeItem('routine');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    useEffect(() => {
        localStorage.setItem('routine', JSON.stringify(routine));
    }, [routine]);

    return (
        <div className="p-10 mx-auto my-auto">
            <Helmet>
                <title>{routine.name || 'Routine Creator'} | Skingredients</title>
            </Helmet>


            {isEditing ? (
                <div className="flex flex-col">
                    <input type="text" value={routine.name} onChange={handleRoutineChange} name="name"
                           className="text-5xl text-gray-400 font-light focus:outline-none text-center underline"/>
                    <input type="text" value={routine.description} onChange={handleRoutineChange} name="description"
                           className="text-2xl focus:outline-none font-light text-center my-4 underline"/>
                </div>
            ) : (
                <div>
                    <h1 className="text-5xl font-bold text-center">{routine.name || 'Create Routine'}</h1>
                    <h2 className="text-2xl font-light text-center my-4">{routine.description}</h2>
                </div>
            )}

            <div className="flex items-end justify-between -my-4">
                <div className="text-left">
                    <h3 className="font-bold text-2xl">Total: ${totalPrice.toFixed(2)}</h3>
                </div>
                <div className="text-right">
                    {!isEditing ? (
                        <button className="btn btn-ghost border-primary border-2 rounded-2xl text-right"
                                onClick={() => {
                                    setIsEditing(true);
                                }}>
                            <FontAwesomeIcon icon={faEdit}/>Edit
                        </button>
                    ) : (
                        <button className="btn btn-ghost border-primary border-2 rounded-2xl text-right"
                                onClick={() => {
                                    setIsEditing(false);
                                }}>
                            <FontAwesomeIcon icon={faSave}/>Save
                        </button>
                    )}

                    {/*<button className="btn btn-primary text-right" onClick={() => {*/}
                    {/*    saveRecommendedRoutine();*/}
                    {/*}}>*/}
                    {/*    Save Routine*/}
                    {/*</button>*/}
                </div>
            </div>

            <div className="divider divider-primary"/>
            <div className="mb-10">
                <div className="flex items-center">
                    <h2 className="text-4xl font-bold">Morning Routine</h2>
                    <button className="pl-2 tooltip tooltip-secondary" data-tip="Add Product" onClick={() => {
                        setCurrentRoutine('AM');
                        document.getElementById('searchModal').showModal()
                    }}>
                        <FontAwesomeIcon icon={faPlus}/>
                    </button>
                    <Modal handleFormSubmit={handleFormSubmit} handleInputChange={handleInputChange}
                           isAddingProduct={isAddingProduct}
                           setIsAddingProduct={setIsAddingProduct} setSelectedProduct={handleSelectedProductChange}/>

                </div>
                {AMNotices.length > 0 ? (
                    <div className="collapse collapse-arrow mt-1 mb-3" style={{backgroundColor: '#f3f0f5'}}>
                        <input type="checkbox" checked={isAMNoticesOpen} onChange={() => setIsAMNoticesOpen(!isAMNoticesOpen)}/>
                        <div className="collapse-title text-xl font-medium">
                            Notices/Tips
                        </div>
                        <div className="collapse-content">
                            <ul className="font-light">
                                {AMNotices.map((notice, index) => (
                                    <li key={index} className="text-lg">- {notice}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ) : null}
                {sortProductsBySkincareOrder(routine.AM.products, 'AM').map((product, index) => (
                    <Product
                        key={product.id || index}
                        product={product}
                        index={index}
                        handleDeleteProduct={handleDeleteProduct}
                        handleEditProduct={handleEditProduct}
                        isEditing={isEditing}
                    />
                ))}
            </div>

            <div className="mb-10">
                <div className="flex items-center">
                    <h2 className="text-4xl font-bold">Night Routine</h2>
                    <button className="pl-2 tooltip tooltip-secondary" data-tip="Add Product" onClick={() => {
                        setCurrentRoutine('PM');
                        document.getElementById('searchModal').showModal()
                    }}>
                        <FontAwesomeIcon icon={faPlus}/>
                    </button>
                    <Modal handleFormSubmit={handleFormSubmit} handleInputChange={handleInputChange}
                           isAddingProduct={isAddingProduct} setIsAddingProduct={handleSelectedProductChange}
                           setSelectedProduct={setSelectedProduct}/>
                </div>
                {PMNotices.length > 0 ? (
                    <div className="collapse collapse-arrow mb-3 mt-1" style={{backgroundColor: '#f3f0f5'}}>
                        <input type="checkbox" checked={isPMNoticesOpen} onChange={() => setIsPMNoticesOpen(!isPMNoticesOpen)}/>
                        <div className="collapse-title text-xl font-medium">
                            Notices/Tips
                        </div>
                        <div className="collapse-content">
                            <ul className="font-light">
                                {PMNotices.map((notice, index) => (
                                    <li key={index} className="text-lg">- {notice}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ) : null}
                {sortProductsBySkincareOrder(routine.PM.products, 'PM').map((product, index) => (
                    <Product
                        key={product.id || index}
                        product={product}
                        index={index}
                        handleDeleteProduct={handleDeleteProduct}
                        handleEditProduct={handleEditProduct}
                        isEditing={isEditing}
                    />
                ))}
            </div>
        </div>

    );
}

function Product({product, index, handleDeleteProduct, handleEditProduct, isEditing}) {
    return (
        <div className="card card-side bg-base-100 shadow-xl m-2 w-2/3 mx-auto flex p-2 pl-4">
            <figure className="">
                {product.photo ? (
                    <Link to={"/product/" + product.id}>
                        <img src={`${import.meta.env.BASE_URL}images/${product.photo}`} alt={product.name}
                             className="w-40 h-40 object-stretch"/>
                    </Link>
                ) : (
                    <img src="https://via.placeholder.com/150" alt={product.name}
                         className="w-full h-full object-cover"/>
                )}
            </figure>
            <div className="card-body">
                <h2 className="card-title">{product.name}</h2>
                <h3 className="text-lg text-neutral">{product.brand}</h3>
                {product.ingredients ? (
                    <IngredientBadge ingredients={product.ingredients}/>
                ) : null}
                <p className="text-lg">${product.price}</p>
                {isEditing ? (
                    <div className="card-actions justify-end">
                        {product.customProduct ? (
                            <button onClick={handleEditProduct(index)} className="btn btn-primary">
                                <FontAwesomeIcon icon={faEdit}/>
                            </button>
                        ) : null}
                        <button onClick={() => handleDeleteProduct(product.customID)} className="btn btn-error">
                            <FontAwesomeIcon icon={faTrash}/>
                        </button>
                    </div>
                ) : null}
            </div>
        </div>
    );
}

function Modal({handleInputChange, handleFormSubmit, isAddingProduct, setIsAddingProduct, setSelectedProduct}) {
    return (
        <dialog id="searchModal" className="modal modal-bottom sm:modal-middle">
            <div className="modal-box">
                <div className="text-right -mt-3">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-ghost">
                            <FontAwesomeIcon icon={faTimes}/>
                        </button>
                    </form>
                </div>
                {!isAddingProduct ? (
                    <>
                        <h3 className="font-bold text-lg">Add a product</h3>
                        <div className="py-4">
                            <div className="text-center">
                                <SearchBar selectedItem={setSelectedProduct}/>
                                <p>Product not here? <button className="hover:underline text-neutral"
                                                             onClick={() => setIsAddingProduct(true)}> Add
                                    it to
                                    your routine</button></p>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <form id="form" className="w-2/3 mx-auto">
                            <InputField name="name" type="text" placeholder=" " onInput={handleInputChange}
                                        label="Product Name"/>
                            <InputField name="brand" type="text" placeholder=" " onInput={handleInputChange}
                                        label="Brand"/>
                            <InputField name="category" type="text" placeholder=" " onInput={handleInputChange}
                                        label="Category"/>
                            <InputField name="ingredients" type="textarea" placeholder=" " onInput={handleInputChange}
                                        label="Ingredients" isRequired={false}/>
                            <InputField name="price" type="number" placeholder=" " onInput={handleInputChange}
                                        label="Price"/>

                            <button
                                onClick={handleFormSubmit}
                                id="button"
                                type="button"
                                className="w-full px-6 py-3 mt-3 text-lg text-white transition-all duration-150 ease-linear rounded-lg shadow outline-none bg-secondary hover:bg-pink-300 hover:shadow-lg focus:outline-none"
                            >
                                Save
                            </button>
                        </form>
                    </>
                )}
            </div>
        </dialog>
    );
}


export default RoutineCreator;