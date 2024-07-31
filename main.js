//do "npm start" in terminal to run 

const axios = require('axios');
const path = require('path');
const { app, BrowserWindow} = require ('electron')

const isMac = process.platform === 'darwin';

let mainWindow;

function createMainWindow() {
    mainWindow = new BrowserWindow({
        title: 'Athan App',
        // minHeight: 600,
        // minWidth: 400,
        height: 700,
        width: 500,
        // maxHeight: 1000,
        // maxWidth: 800,
        transparent: true,
        autoHideMenuBar: true,
        resizable: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    mainWindow.loadFile(path.join(__dirname, './renderer/index.html'));
}

app.whenReady().then(() => {
    createMainWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
          createMainWindow()

        }
      })
});


app.on('window-all-closed', () => {
    if (!isMac) {
      app.quit()
    }
  })

const get_location = async () => {
    try {
        const location_data = await axios.get('https://api.ipbase.com/v2/info', {
            params: {
                apikey: 'ipb_live_sdOheN2iL31vnP7MPc9J5uS3jagnkWcy2psyt3iv'
            }
        });
        
        const latitude = location_data.data.data.location.latitude;
        const longitude = location_data.data.data.location.longitude;

        const date = new Date();
        const current_year = date.getFullYear();
        const current_month = date.getMonth() + 1

        get_prayer_times(latitude, longitude, current_year, current_month)
    } catch (error) {
        console.error("Error fetching location", error)
    }
};

const get_prayer_times = async (latitude, longitude, year, month) =>{
    try {
        const prayer_time_data = await axios.get(`http://api.aladhan.com/v1/calendar/${year}/${month}`, {
            params: {
                latitude: latitude,
                longitude: longitude,
                method: 2,
                school: 1
            }
        });
        const prayer_times = prayer_time_data.data.data.timings;
        display_prayer_times(prayer_times);
    } catch (error) {
        console.error("Error getting prayer times: ", error);
    }
};

const display_prayer_times = (prayer_times) => {
    const fajr_prayer_time_id = document.getElementById("fajr_prayer_time");
    fajr_prayer_time_id.innerHTML = '';
    for (const [key, value] of Object.entries(prayer_times)) {
        const p = document.createElement("p")
        p.textContent = '${key}: ${value}';
        fajr_prayer_time_id.appendChild(p)
    }
}

get_location();