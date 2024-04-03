import axios from "axios";

export async function generateIdAndCreateRoutine() {
    // Generate a new ID
    const newRoutineID = crypto.randomUUID().slice(0, 6);

    try {
        // Attempt to create a new routine with the generated ID
        const response = await axios.post(`http://localhost:3002/routine/create/${newRoutineID}`);
        return newRoutineID;
    } catch (error) {
        if (error.response && error.response.status === 400) {
            // If the error is that a routine with this ID already exists, try again with a new ID
            return generateIdAndCreateRoutine();
        } else {
            console.error(error);
        }
    }
}

export async function fetchRoutine(routineID) {
    try {
        const response = await axios.get(`http://localhost:3002/routine/${routineID}`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}