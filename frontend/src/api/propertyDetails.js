import axios from "axios";

const property = "http://localhost:3000/property";

export async function fetchPropertyDetails(id) {
  try {
    const response = await axios.get(`${property}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching property details:", error);
    return null;
  }
}
