const { contextBridge } = require('electron');
const axios = require('axios');

// Expose only the axios.get method to the renderer
contextBridge.exposeInMainWorld('api', {
  axiosGet: (url, config) => axios.get(url, config)
});