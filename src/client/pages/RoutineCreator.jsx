import {Helmet} from "react-helmet";

function RoutineCreator() {
  return (
    <div>
        <Helmet>
            <title>Routine Creator | Skingredients</title>
        </Helmet>

      <h1>Routine Creator</h1>

        <button className="btn btn-lg  rounded-2xl">✨Recommended Routines</button>
    </div>
  );
}

export default RoutineCreator;