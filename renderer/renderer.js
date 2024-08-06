const axios = require('axios');

/*--------------------------To Do List--------------------------------
-need to create a first page that recognized whether location (city  
    and location) is empty and request to get that information
-make colors change based on time
-make colors transition neatly
-make settings page that changes method, school, can change location
-send notifications and can toggle them, probably 
    check box on the right of the time
-finish top and bottom div
-add minimize button that shrinks screen to only show current 
    prayer time and the next prayer time
-make application when closed to only go into the tray
----------------------------------------------------------------------*/

const city = "Ypsilanti"
const country = "US"
const method = 2;
const school = 1

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getPrayerTimes = async () => {
    try { 
        const api_prayer_time_data = await axios.get(
            'http://api.aladhan.com/v1/timingsByCity/:date', 
            {
            params: {
                city: city,
                country: country,
                method: method,
                school: school
            }
        });
        const prayer_times = api_prayer_time_data.data.data.timings;
        changeBackgroundByTiming(prayer_times)
        displayPrayerTimes(prayer_times);
    } catch (error) {
        console.error("Error getting prayer times: ", error);
    }
};

function toStandardTime(militaryTime) {
    var final_hour = String(militaryTime).substring(0, 2);
    var final_min = String(militaryTime).substring(3, 5);
    var final_string = "";
    if (parseInt(final_hour) > 12)
    {
        final_hour = final_hour % 12;
        final_min += " PM";
    }
    else
    {
        final_min += " AM";
    }
    return final_string = final_string.concat(final_hour, ":", final_min);
}

const displayPrayerTimes = (prayer_times) => {

    if (!prayer_times) {
        console.error("No prayer times data available");
        return;
    }

    document.getElementById("fajr_prayer_time").innerText = String(
        toStandardTime(prayer_times.Fajr)).charAt(0) == "0" ? 
        toStandardTime(prayer_times.Fajr).substring(1, 
            toStandardTime(prayer_times.Fajr).length) : 
            toStandardTime(prayer_times.Fajr);

    document.getElementById("dhuhr_prayer_time").innerText = String(
        toStandardTime(prayer_times.Dhuhr)).charAt(0) == "0" ? 
        toStandardTime(prayer_times.Dhuhr).substring(1, 
            toStandardTime(prayer_times.Dhuhr).length) : 
            toStandardTime(prayer_times.Dhuhr);

    document.getElementById("asr_prayer_time").innerText = String(
        toStandardTime(prayer_times.Asr)).charAt(0) == "0" ? 
        toStandardTime(prayer_times.Asr).substring(1, 
            toStandardTime(prayer_times.Asr).length) : 
            toStandardTime(prayer_times.Asr);

    document.getElementById("maghrib_prayer_time").innerText = String(
        toStandardTime(prayer_times.Maghrib)).charAt(0) == "0" ? 
        toStandardTime(prayer_times.Maghrib).substring(1, 
            toStandardTime(prayer_times.Maghrib).length) : 
            toStandardTime(prayer_times.Maghrib);

    document.getElementById("isha_prayer_time").innerText = String(
        toStandardTime(prayer_times.Isha)).charAt(0) == "0" ? 
        toStandardTime(prayer_times.Isha).substring(1, 
            toStandardTime(prayer_times.Isha).length) : 
            toStandardTime(prayer_times.Isha);
};

let initial_color;

let fajr_button = document.getElementById("fajr_button");
let dhuhr_button = document.getElementById("dhuhr_button");
let asr_button = document.getElementById("asr_button");
let maghrib_button = document.getElementById("maghrib_button")
let isha_button = document.getElementById("isha_button")

function changeBackgroundByTiming(prayer_times) {

    const current_time = new Date().toLocaleTimeString(
        ['it-IT'], {hour: '2-digit', minute: '2-digit'}
    );
    
    const fajr_time = prayer_times.Fajr
    const dhuhr_time = prayer_times.Dhuhr;
    const asr_time = prayer_times.Asr;
    const maghrib_time = prayer_times.Maghrib;
    const isha_time = prayer_times.Isha;

    if (current_time >= fajr_time && current_time < dhuhr_time) {

        document.getElementById

        document.documentElement.style.setProperty(
            "--bg_color_new", 
            window.getComputedStyle(fajr_button).backgroundImage
        );

        document.documentElement.style.setProperty("--bg_opacity", 1);

        sleep(250).then(() => {document.documentElement.style.setProperty(
            "--bg_color_old", 
            document.documentElement.style.getPropertyValue("--bg_color_new"));
        });

        sleep(250).then(() => {document.documentElement.style.setProperty(
            "--bg_opacity", 0);
        });

        initial_color = window.getComputedStyle(fajr_button).backgroundImage;
        
    } else if (current_time >= dhuhr_time && current_time < asr_time) {

        document.documentElement.style.setProperty(
            "--bg_color_new", 
            window.getComputedStyle(dhuhr_button).backgroundImage
        );

        document.documentElement.style.setProperty("--bg_opacity", 1);

        sleep(250).then(() => {document.documentElement.style.setProperty(
            "--bg_color_old", 
            document.documentElement.style.getPropertyValue("--bg_color_new"));
        });

        sleep(250).then(() => {document.documentElement.style.setProperty(
            "--bg_opacity", 0);
        });

        initial_color = window.getComputedStyle(dhuhr_button).backgroundImage;

    } else if (current_time >= asr_time && current_time < maghrib_time) {

        document.documentElement.style.setProperty(
            "--bg_color_new", 
            window.getComputedStyle(asr_button).backgroundImage
        );

        document.documentElement.style.setProperty("--bg_opacity", 1);

        sleep(250).then(() => {document.documentElement.style.setProperty(
            "--bg_color_old", 
            document.documentElement.style.getPropertyValue("--bg_color_new"));
        });

        sleep(250).then(() => {document.documentElement.style.setProperty(
            "--bg_opacity", 0);
        });

        initial_color = window.getComputedStyle(asr_button).backgroundImage;

    } else if (current_time >= maghrib_time && current_time < isha_time) {

        document.documentElement.style.setProperty(
            "--bg_color_new", 
            window.getComputedStyle(maghrib_button).backgroundImage
        );

        document.documentElement.style.setProperty("--bg_opacity", 1);

        sleep(250).then(() => {document.documentElement.style.setProperty(
            "--bg_color_old", 
            document.documentElement.style.getPropertyValue("--bg_color_new"));
        });

        sleep(250).then(() => {document.documentElement.style.setProperty(
            "--bg_opacity", 0);
        });

        initial_color = window.getComputedStyle(maghrib_button).backgroundImage;

    } else {

        document.documentElement.style.setProperty(
            "--bg_color_new", 
            window.getComputedStyle(isha_button).backgroundImage
        );

        document.documentElement.style.setProperty("--bg_opacity", 1);

        sleep(250).then(() => {document.documentElement.style.setProperty(
            "--bg_color_old", 
            document.documentElement.style.getPropertyValue("--bg_color_new"));
        });

        sleep(250).then(() => {document.documentElement.style.setProperty(
            "--bg_opacity", 0);
        });

        initial_color = window.getComputedStyle(isha_button).backgroundImage;

    }
}

fajr_button.addEventListener("mouseenter", () => {
    
    document.documentElement.style.setProperty(
        "--bg_color_new", 
        window.getComputedStyle(fajr_button).backgroundImage
    );

    document.documentElement.style.setProperty("--bg_opacity", 1);

    sleep(250).then(() => {document.documentElement.style.setProperty(
        "--bg_color_old", 
        document.documentElement.style.getPropertyValue("--bg_color_new"));
    });

    sleep(250).then(() => {document.documentElement.style.setProperty(
        "--bg_opacity", 0);
    });
})

dhuhr_button.addEventListener("mouseenter", () => {

    document.documentElement.style.setProperty(
        "--bg_color_new", 
        window.getComputedStyle(dhuhr_button).backgroundImage
    );

    document.documentElement.style.setProperty("--bg_opacity", 1);

    sleep(250).then(() => {document.documentElement.style.setProperty(
        "--bg_color_old", 
        document.documentElement.style.getPropertyValue("--bg_color_new"));
    });

    sleep(250).then(() => {document.documentElement.style.setProperty(
        "--bg_opacity", 0);
    });
})

asr_button.addEventListener("mouseenter", () => {

    document.documentElement.style.setProperty(
        "--bg_color_new", 
        window.getComputedStyle(asr_button).backgroundImage
    );

    document.documentElement.style.setProperty("--bg_opacity", 1);

    sleep(250).then(() => {document.documentElement.style.setProperty(
        "--bg_color_old", 
        document.documentElement.style.getPropertyValue("--bg_color_new"));
    });

    sleep(250).then(() => {document.documentElement.style.setProperty(
        "--bg_opacity", 0);
    });
})

maghrib_button.addEventListener("mouseenter", () => {

    document.documentElement.style.setProperty(
        "--bg_color_new", 
        window.getComputedStyle(maghrib_button).backgroundImage
    );

    document.documentElement.style.setProperty("--bg_opacity", 1);

    sleep(250).then(() => {document.documentElement.style.setProperty(
        "--bg_color_old", 
        document.documentElement.style.getPropertyValue("--bg_color_new"));
    });

    sleep(250).then(() => {document.documentElement.style.setProperty(
        "--bg_opacity", 0);
    });
    
})

isha_button.addEventListener("mouseenter", () => {

    document.documentElement.style.setProperty(
        "--bg_color_new", 
        window.getComputedStyle(isha_button).backgroundImage
    );

    document.documentElement.style.setProperty("--bg_opacity", 1);

    sleep(250).then(() => {document.documentElement.style.setProperty(
        "--bg_color_old", 
        document.documentElement.style.getPropertyValue("--bg_color_new"));
    });

    sleep(250).then(() => {document.documentElement.style.setProperty(
        "--bg_opacity", 0);
    });

})

let default_timer;

const start_default_bg_timer = () => {

    clearTimeout(default_timer);

    default_timer = setTimeout(() => {

        document.documentElement.style.setProperty(
            "--bg_color_new", initial_color
        );

        document.documentElement.style.setProperty("--bg_opacity", 1);

        sleep(250).then(() => {document.documentElement.style.setProperty(
            "--bg_color_old", 
            document.documentElement.style.getPropertyValue("--bg_color_new"));
        });
    
        sleep(250).then(() => {document.documentElement.style.setProperty(
            "--bg_opacity", 0);
        });

    }, 5000)
};

const stop_default_bg_timer = () => {
    clearTimeout(default_timer)
}

document.querySelectorAll('button').forEach(button => { 

    button.addEventListener('mouseenter', (event) => { 
        stop_default_bg_timer(); 
    });

    button.addEventListener('mouseleave', () => { 
        start_default_bg_timer();
    });
    
});

setInterval(getPrayerTimes(), 60000)