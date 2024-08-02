const axios = require('axios');

const get_prayer_times = async () => {
    try { 
        const api_prayer_time_data = await axios.get('http://api.aladhan.com/v1/timingsByCity/:date', {
            params: {
                city: "Ypsilanti",
                country: "US",
                method: 2,
                school: 1
            }
        });
        const prayer_times = api_prayer_time_data.data.data.timings;
        display_prayer_times(prayer_times);
    } catch (error) {
        console.error("Error getting prayer times: ", error);
    }
};

const display_prayer_times = (prayer_times) => {
    if (!prayer_times) {
        console.error("No prayer times data available");
        return;
    }
    document.getElementById("fajr_prayer_time").innerText = prayer_times.Fajr || 'N/A';
    document.getElementById("dhuhr_prayer_time").innerText = prayer_times.Dhuhr || 'N/A';
    document.getElementById("asr_prayer_time").innerText = prayer_times.Asr || 'N/A';
    document.getElementById("maghrib_prayer_time").innerText = prayer_times.Maghrib || 'N/A';
    document.getElementById("isha_prayer_time").innerText = prayer_times.Isha || 'N/A';
};

get_prayer_times();

function button_click(button_id) {
    const button_background = (window.getComputedStyle(document.getElementById(button_id)).background);
    document.body.style.background = button_background;
}
