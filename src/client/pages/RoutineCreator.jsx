import {Helmet} from "react-helmet";

function RoutineCreator({ routine = null}) {
    return (
        <div className="p-10">
            <Helmet>
                <title>Routine Creator | Skingredients</title>
            </Helmet>


            <h1 className="text-3xl font-bold">Create Routine</h1>

            {routine !== null && (
                <div className="card w-96 bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h1>Hi</h1>
                    </div>
                </div>
            )}
        </div>
    );
}

export default RoutineCreator;