import {useState} from "react";
import recommendedRoutines from "../utils/routines.json";
import {Helmet} from "react-helmet";
import {Link} from "react-router-dom";

function Routines() {
    const [routines, setRoutines] = useState([]);

    const handleRecommendedRoutines = () => {
        // fetch recommended routines from JSON
        let routines = recommendedRoutines.recommendedRoutines;
        setRoutines(routines);
    }

    function EditRoutine(routine){
    }

    return (
        <div>
            <Helmet>
                <title>Routine Creator | Skingredients</title>
            </Helmet>

            <button className="btn btn-lg rounded-2xl flex flex-col items-center justify-center border-primary"
                    onClick={handleRecommendedRoutines}>
                <div>✨Recommended Routines</div>
                <div className="font-light text-gray-500 text-xs">For a basic routine or new to skincare</div>
            </button>
            <button className="btn btn-lg  rounded-2xl">🔍Search</button>
            <Link to={"/routine/" + crypto.randomUUID().slice(0, 6)} className="btn btn-lg  rounded-2xl">📝Create New Routine</Link>

            <ul>
                {routines.map((routine, index) => (
                    <button key={index} onClick={() => EditRoutine(routine)}>
                        <div className="card w-96 bg-base-100 shadow-xl">
                            <div className="card-body">
                                <h2>{routine.name}</h2>
                                <p>{routine.description}</p>
                            </div>
                        </div>
                    </button>
                ))}
            </ul>
        </div>
    );
}

export default Routines;