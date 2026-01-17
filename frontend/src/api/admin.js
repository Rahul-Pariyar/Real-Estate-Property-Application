import axios from "axios";

const BASE_URL = "http://localhost:3000";

export async function fetchAllProperties() {
  try {
    const res = await axios.get(`${BASE_URL}/property/getAll`, { withCredentials: true });
    return res.data;
  } catch (error) {
    console.error("Error fetching properties:", error);
    return [];
  }
}

export async function deleteProperty(id) {
  try {
    await axios.delete(`${BASE_URL}/property/delete/${id}`, { withCredentials: true });
    return true;
  } catch (error) {
    console.error("Error deleting property:", error);
    return false;
  }
}

export async function fetchAllUsers() {
  try {
    const res = await axios.get(`${BASE_URL}/user/all`, { withCredentials: true });
    return res.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

// Admin user operations
export async function createUser(formData) {
  try {
    const res = await axios.post(`${BASE_URL}/auth/signup`, formData, { withCredentials: true });
    return res.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

export async function updateAdmin(id, data) {
  try {
    // Validate ID is present (should be provided from Redux state)
    if (!id) {
      throw new Error('User ID is required for update. Make sure you are logged in and Redux state is correct.');
    }
    
    console.log('Updating user with ID:', id);
    console.log('Update data:', data);
    
    const res = await axios.put(`${BASE_URL}/admin/edit/${id}`, data, { 
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Update response:', res.data);
    return res.data;
  } catch (error) {
    console.error('Error updating user:', error);
    
    // Enhanced error logging
    if (error.response) {
      console.error('Server response error:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
      
      // Return a more descriptive error message based on the response
      const serverMessage = error.response.data?.message || 'Unknown server error';
      throw new Error(serverMessage);
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received:', error.request);
      throw new Error('No response from server. Please check your connection.');
    } else {
      // Error in setting up the request
      console.error('Request setup error:', error.message);
      throw new Error(error.message || 'Failed to make request');
    }
  }
}

export async function getCurrentAdmin() {
  try {
    const res = await axios.get(`${BASE_URL}/admin/me`, { withCredentials: true });
    return res.data;
  } catch (error) {
    console.error("Error fetching current admin:", error);
    throw error;
  }
}



export async function updateUserByAdmin(id, data) {
  try {
    // Validate ID is present (should be provided from Redux state)
    if (!id) {
      throw new Error('User ID is required for update. Make sure you are logged in and Redux state is correct.');
    }
    
    console.log('Updating user with ID:', id);
    console.log('Update data:', data);
    
    const res = await axios.put(`${BASE_URL}/user/edit/${id}`, data, { 
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Update response:', res.data);
    return res.data;
  } catch (error) {
    console.error('Error updating user:', error);
    
    // Enhanced error logging
    if (error.response) {
      console.error('Server response error:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
      
      // Return a more descriptive error message based on the response
      const serverMessage = error.response.data?.message || 'Unknown server error';
      throw new Error(serverMessage);
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received:', error.request);
      throw new Error('No response from server. Please check your connection.');
    } else {
      // Error in setting up the request
      console.error('Request setup error:', error.message);
      throw new Error(error.message || 'Failed to make request');
    }
  }
}


export async function updateUser(id, data) {
  try {
    // Validate ID is present (should be provided from Redux state)
    if (!id) {
      throw new Error('User ID is required for update. Make sure you are logged in and Redux state is correct.');
    }
    
    console.log('Updating user with ID:', id);
    console.log('Update data:', data);
    
    const res = await axios.put(`${BASE_URL}/user/profile/${id}`, data, { 
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Update response:', res.data);
    return res.data;
  } catch (error) {
    console.error('Error updating user:', error);
    
    // Enhanced error logging
    if (error.response) {
      console.error('Server response error:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
      
      // Return a more descriptive error message based on the response
      const serverMessage = error.response.data?.message || 'Unknown server error';
      throw new Error(serverMessage);
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received:', error.request);
      throw new Error('No response from server. Please check your connection.');
    } else {
      // Error in setting up the request
      console.error('Request setup error:', error.message);
      throw new Error(error.message || 'Failed to make request');
    }
  }
}


export async function getCurrentUser() {
  try {
    const res = await axios.get(`${BASE_URL}/user/me`, { withCredentials: true });
    return res.data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
}

export async function deleteUser(id) {
  try {
    const res = await axios.delete(`${BASE_URL}/user/delete/${id}`, { withCredentials: true });
    return res.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}
