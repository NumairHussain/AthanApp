console.log("PRELOAD SCRIPT STARTED"); 

const { contextBridge } = require('electron');
const axios = require('axios');

// Expose only the axios.get method to the renderer
contextBridge.exposeInMainWorld('api', {
  axiosGet: async (url, config) => {
    // Only expose the data, not the full response object
    const response = await axios.get(url, config);
    return response.data;
  }
});