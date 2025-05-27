console.log("PRELOAD SCRIPT STARTED");

try {
  const { contextBridge } = require('electron');
  const axios = require('axios');

  contextBridge.exposeInMainWorld('api', {
    axiosGet: async (url, config) => {
      const response = await axios.get(url, config);
      return response.data;
    }
  });

} catch (err) {
  console.error("Error in preload:", err);
}
