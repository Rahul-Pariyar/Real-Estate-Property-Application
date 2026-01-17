import axios from "axios";

const property = "http://localhost:3000/property"

async function fetchingData(params) {
  try {
    const response = await axios.get(`${property}/getAll${params ? `?${params}` : ''}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching all properties:', error);
    return [];
  }
}

export default fetchingData;