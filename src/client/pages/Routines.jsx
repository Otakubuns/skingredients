import {useState} from "react";
import recommendedRoutines from "../utils/routines.json";
import {Helmet} from "react-helmet";
import {Link, Navigate, useNavigate} from "react-router-dom";
import axios from "axios";
import {generateIdAndCreateRoutine} from "../utils/RoutineHelper.js";

function Routines() {
    const [routines, setRoutines] = useState([]);
    const [routine, setRoutine] = useState({});
    const navigate = useNavigate();

    const handleRecommendedRoutines = () => {
        // fetch recommended routines from JSON
        let routines = recommendedRoutines.recommendedRoutines;
        console.log(routines)
        setRoutines(routines);
    }

    function EditRoutine(routine) {
    }

    async function CreateRoutine() {
        const ID = await generateIdAndCreateRoutine();

        navigate(`/routine/${ID}`);
    }

    return (
        <div className="text-center align-top p-10">
            <Helmet>
                <title>Routine Creator | Skingredients</title>
            </Helmet>

            <div className="flex items-center justify-center gap-3 top-auto">
                <button className="btn btn-lg rounded-2xl border-primary"
                        onClick={handleRecommendedRoutines}>
                    <div className="flex flex-col items-center justify-center">
                        <div>✨Recommended Routines</div>
                        <div className="font-light text-gray-500 text-xs">For a basic routine or new to skincare</div>
                    </div>
                </button>
                {/*<button className="btn btn-lg  rounded-2xl">🔍Search</button>*/}
                <button onClick={CreateRoutine} className="btn btn-lg  rounded-2xl">📝Create New Routine</button>
            </div>

            <ul className="p-5">
                {routines.map((routine, index) => (
                    <button key={index} onClick={() => EditRoutine(routine)}>
                        <Link to={"/routine/" + routine.id} className="card bg-base-100 shadow-md">
                            <div className="card-body">
                                <h2>{routine.name}</h2>
                                <p>{routine.description}</p>
                            </div>
                        </Link>
                    </button>
                ))}
            </ul>
        </div>
    );
}

export default Routines;