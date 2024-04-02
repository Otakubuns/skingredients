import {Helmet} from "react-helmet";
import {useEffect, useState} from "react";

function RoutineCreator() {
    const [products, setProducts] = useState([]);
    const [routine, setRoutine] = useState({
        name: '',
        description: '',
        steps: [],
    });


    useEffect(() => {
        const savedProducts = localStorage.getItem('routineProducts');
        if (savedProducts) {
            setProducts(JSON.parse(savedProducts));
        }
    }, []);

    // Save products to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('routineProducts', JSON.stringify(products));
    }, [products]);

    return (
        <div className="p-10">
            <Helmet>
                <title>Routine Creator | Skingredients</title>
            </Helmet>


            <h1 className="text-3xl font-bold">Create Routine</h1>


        </div>
    );
}

export default RoutineCreator;