import axios from "axios";

// const BASE_URL = "https://moveo-server-z2xn.onrender.com"
const BASE_URL = "https://moveo-task-production.up.railway.app"
export const getCodeTitles = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/codes/get-titles`);
        return response.data;

    } catch (e) {
        throw (e);
    }
}

export const getCodeByTitle = async (title) => {
    try {
        const response = await axios.get(`${BASE_URL}/codes/title/${title}`);
        return response.data;
    } catch (e) {
        throw (e);
    }
}