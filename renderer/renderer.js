const axios = require('axios');

/*--------------------------To Do List--------------------------------
-DONE - FIX SCREEN FLASHING DUE TO TIMER
-ADD SETTINGS AND LOCAL STORAGE
    settings ideas, obv diff parameters, colors of bg, notifications of adhans
-DONE CHECK LIVE TIMER SWITCHING AND SEND NOTIFICATIONS
-add minimize button that shrinks screen to only show current 
    timing and the next timing, possibility to make it fully transparent
-make each screen have small details in the background
-Randomly throughout the day, grab the next days prayer times and save it
    Change it and make it grab the whole calendar year?
----------------------------------------------------------------------*/



const city = "Ypsilanti";
const country = "US";
const method = 2;
const school = 1;

let prayerTimes;

let fajrAdhanTime, sunriseTime, dhuhrAdhanTime, 
    asrAdhanTime, maghribAdhanTime, ishaAdhanTime;

let initialButton;

let sentFajrNotifFlag, sentSunriseNotifFlag, sentDhuhrNotifFlag, 
    sentAsrNotifFlag, sentMaghribNotifFlag, sentIshaNotifFlag;

let mouseEnterFlag = false;

let defaultTimer;
let backgroundIntervalId;

let now;;
let millisecondsToNextSecond;
let millisecondsToNextMinute;

let toSettingsButtonClicked;

const fajrButton = document.getElementById("fajrButton");
const fajrTitle = document.getElementById("fajrTitle");

const sunriseButton = document.getElementById("sunriseButton");
const sunriseTitle = document.getElementById("sunriseTitle");

const dhuhrButton = document.getElementById("dhuhrButton");
const dhuhrTitle = document.getElementById("dhuhrTitle");

const asrButton = document.getElementById("asrButton");
const asrTitle = document.getElementById("asrTitle");

const maghribButton = document.getElementById("maghribButton")
const maghribTitle = document.getElementById("maghribTitle");

const ishaButton = document.getElementById("ishaButton")
const ishaTitle = document.getElementById("ishaTitle");

var tempButton;


const getPrayerTimes = async () => {
    try { 
        let apiPrayerTimeData = await axios.get(
            `http://api.aladhan.com/v1/timingsByCity`, 
            {
            params: {
                city: city,
                country: country,
                method: method,
                school: school
            }
        });

        prayerTimes = apiPrayerTimeData.data.data.timings;

        fajrAdhanTime = prayerTimes.Fajr;
        sunriseTime = prayerTimes.Sunrise;
        dhuhrAdhanTime = prayerTimes.Dhuhr;
        asrAdhanTime = prayerTimes.Asr;
        maghribAdhanTime = prayerTimes.Maghrib;
        ishaAdhanTime = prayerTimes.Isha;

        changeBackgroundByTiming()
        displayPrayerTimes();

        //still need a system to reset the sentNotifFlags to false upon new day

    } catch (error) {
        console.error("Error getting prayer times: ", error);
    }
};



const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function toStandardTime(militaryTime) {
    let [hours, minutes, seconds] = militaryTime.split(':').map(Number);

    const period = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12 || 12;

    return seconds == null ? `${hours}:${minutes.toString().padStart(2, '0')} ${period}` : 
    `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${period}`;
}

const displayPrayerTimes = () => {

    if (!prayerTimes) {
        console.error("No prayer times data available");
        return;
    }

    document.getElementById("fajrAdhanTimeTitle").innerText = String(
        toStandardTime(fajrAdhanTime)).charAt(0) == "0" ? 
        toStandardTime(fajrAdhanTime).substring(1, 
            toStandardTime(fajrAdhanTime).length) : 
            toStandardTime(fajrAdhanTime);

    document.getElementById("sunriseTimeTitle").innerText = String(
        toStandardTime(sunriseTime)).charAt(0) == "0" ? 
        toStandardTime(sunriseTime).substring(1, 
            toStandardTime(sunriseTime).length) : 
            toStandardTime(sunriseTime);

    document.getElementById("dhuhrAdhanTimeTitle").innerText = String(
        toStandardTime(dhuhrAdhanTime)).charAt(0) == "0" ? 
        toStandardTime(dhuhrAdhanTime).substring(1, 
            toStandardTime(dhuhrAdhanTime).length) : 
            toStandardTime(dhuhrAdhanTime);

    document.getElementById("asrAdhanTimeTitle").innerText = String(
        toStandardTime(asrAdhanTime)).charAt(0) == "0" ? 
        toStandardTime(asrAdhanTime).substring(1, 
            toStandardTime(asrAdhanTime).length) : 
            toStandardTime(asrAdhanTime);

    document.getElementById("maghribAdhanTimeTitle").innerText = String(
        toStandardTime(maghribAdhanTime)).charAt(0) == "0" ? 
        toStandardTime(maghribAdhanTime).substring(1, 
            toStandardTime(maghribAdhanTime).length) : 
            toStandardTime(maghribAdhanTime);

    document.getElementById("ishaAdhanTimeTitle").innerText = String(
        toStandardTime(ishaAdhanTime)).charAt(0) == "0" ? 
        toStandardTime(ishaAdhanTime).substring(1, 
            toStandardTime(ishaAdhanTime).length) : 
            toStandardTime(ishaAdhanTime);
};

const sendNotification = (salahName) => {
    var title = "Athan App";
    var body = `It's ${salahName} Time!`;

    // new Notification("Athan App", {
    //     icon: "../assets/white mosque.png",
    //     title: title,
    //     body: body
    // })
}

function changeBackgroundAndButtons(thisButton, thisTitle) {

    document.querySelectorAll(".prayerButton").forEach(button => {
        button.style.opacity = .25;
    })

    document.querySelectorAll(".prayerTitle").forEach(button => {
        if (button.innerText.charAt(0) == "\u2022") {
            button.innerText = button.innerText.substring(1, button.innerText.length)
        }
    })

    thisButton.style.opacity = 1;

    thisTitle.innerText = String(thisTitle.innerText).charAt(0) != "\u2022" ? "\u2022 " + thisTitle.innerText : thisTitle.innerText;

    document.documentElement.style.setProperty(
        "--bgColorNew", 
        window.getComputedStyle(thisButton).backgroundImage
    );

    document.documentElement.style.setProperty("--bgOpacity", 1);

    sleep(250).then(() => {document.documentElement.style.setProperty(
        "--bgColorOld", 
        document.documentElement.style.getPropertyValue("--bgColorNew"));
    });

    sleep(250).then(() => {document.documentElement.style.setProperty(
        "--bgOpacity", 0);
    });

    initialButton = thisButton;
}

function changeBackgroundOnly(thisButton) {

    document.documentElement.style.setProperty(
        "--bgColorNew", 
        window.getComputedStyle(thisButton).backgroundImage
    );

    document.documentElement.style.setProperty("--bgOpacity", 1);

    sleep(250).then(() => {document.documentElement.style.setProperty(
        "--bgColorOld", 
        document.documentElement.style.getPropertyValue("--bgColorNew"));
    });

    sleep(250).then(() => {document.documentElement.style.setProperty(
        "--bgOpacity", 0);
    });

    initialButton = thisButton;
}

function hoverOpacity() {

    document.querySelectorAll(".prayerButton").forEach(button => {
        button.style.opacity = .25;
    })

    this.style.opacity = 1
    
    document.documentElement.style.setProperty(
        "--bgColorNew", 
        window.getComputedStyle(this).backgroundImage
    );

    document.documentElement.style.setProperty("--bgOpacity", 1);

    sleep(250).then(() => {document.documentElement.style.setProperty(
        "--bgColorOld", 
        document.documentElement.style.getPropertyValue("--bgColorNew"));
    });

    sleep(250).then(() => {document.documentElement.style.setProperty(
        "--bgOpacity", 0);
    });
}

function changeBackgroundByTiming() {

    var currentTime = new Date().toLocaleTimeString(
        ['it-IT'], {hour: '2-digit', minute: '2-digit'}
    );

    if (currentTime >= fajrAdhanTime && currentTime < sunriseTime) {

        if (toSettingsButtonClicked) {
            changeBackgroundOnly(fajrButton)
        } else {
            changeBackgroundAndButtons(fajrButton, fajrTitle)
        }

        if (!sentFajrNotifFlag) {
            sendNotification("Fajr");
            sentFajrNotifFlag = true;
        }

    } else if (currentTime >= sunriseTime && currentTime < dhuhrAdhanTime) {

        if (toSettingsButtonClicked) {
            changeBackgroundOnly(sunriseButton)
        } else {
            changeBackgroundAndButtons(sunriseButton, sunriseTitle)
        }

        if (!sentSunriseNotifFlag) {
            sendNotification("Sunrise");
            sentSunriseNotifFlag = true;
        }
        
    } else if (currentTime >= dhuhrAdhanTime && currentTime < asrAdhanTime) {

        if (toSettingsButtonClicked) {
            changeBackgroundOnly(dhuhrButton)
        } else {
            changeBackgroundAndButtons(dhuhrButton, dhuhrTitle)
        }

        if (!sentDhuhrNotifFlag) {
            sendNotification("Dhuhr");
            sentDhuhrNotifFlag = true;
        }
        
    } else if (currentTime >= asrAdhanTime && currentTime < maghribAdhanTime) {

        if (toSettingsButtonClicked) {
            changeBackgroundOnly(asrButton)
        } else {
            changeBackgroundAndButtons(asrButton, asrTitle)
        }

        if (!sentAsrNotifFlag) {
            sendNotification("Asr");
            sentAsrNotifFlag = true;
        }

    } else if (currentTime >= maghribAdhanTime && currentTime < ishaAdhanTime) {

        if (toSettingsButtonClicked) {
            changeBackgroundOnly(maghribButton)
        } else {
            changeBackgroundAndButtons(maghribButton, maghribTitle)
        }

        if (!sentMaghribNotifFlag) {
            sendNotification("Maghrib");
            sentMaghribNotifFlag = true;
        }
        
    } else {

        if (toSettingsButtonClicked) {
            changeBackgroundOnly(ishaButton)
        } else {
            changeBackgroundAndButtons(ishaButton, ishaTitle)
        }

        if (!sentIshaNotifFlag) {
            sendNotification("Isha");
            sentIshaNotifFlag = true;
        }
    }
}

function addButtonEventListener() {

    fajrButton.addEventListener("mouseenter", hoverOpacity)

    sunriseButton.addEventListener("mouseenter", hoverOpacity)

    dhuhrButton.addEventListener("mouseenter", hoverOpacity)

    asrButton.addEventListener("mouseenter", hoverOpacity)

    maghribButton.addEventListener("mouseenter", hoverOpacity)

    ishaButton.addEventListener("mouseenter", hoverOpacity)
}



const startDefaultBgTimer = () => {

    if (mouseEnterFlag) {
        mouseEnterFlag = false;
    } else {
        return
    }

    clearTimeout(defaultTimer);

    defaultTimer = setTimeout(() => {

        document.querySelectorAll(".prayerButton").forEach(button => {
            button.style.opacity = .25;
        })

        initialButton.style.opacity = 1

        document.documentElement.style.setProperty(
            "--bgColorNew", window.getComputedStyle(initialButton).backgroundImage
        );

        document.documentElement.style.setProperty("--bgOpacity", 1);6

        sleep(250).then(() => {document.documentElement.style.setProperty(
            "--bgColorOld", 
            document.documentElement.style.getPropertyValue("--bgColorNew"));
        });
    
        sleep(250).then(() => {document.documentElement.style.setProperty(
            "--bgOpacity", 0);
        });

    }, 5000)
};

const stopDefaultBgTimer = () => {
    clearTimeout(defaultTimer)
    mouseEnterFlag = true;
}

document.querySelectorAll('.prayerButton').forEach(button => { 
    
    button.addEventListener('mouseenter', stopDefaultBgTimer);

    button.addEventListener('mouseleave', startDefaultBgTimer);
    
});

function updateLiveTime() {

    const now = new Date();
    const hours = String(now.getHours());
    const minutes = String(now.getMinutes());
    const seconds = String(now.getSeconds());
    const formattedTime = `${hours}:${minutes}:${seconds}`;
    document.getElementById('clock').innerText = toStandardTime(formattedTime);
}

function startLiveTime() {
    updateLiveTime();
    getPrayerTimes();
    addButtonEventListener();

    now = new Date();
    millisecondsToNextSecond = 1000 - now.getMilliseconds();
    millisecondsToNextMinute = ((60 - now.getSeconds()) * 1000) + millisecondsToNextSecond;

    setTimeout(() => {
        updateLiveTime();

        setInterval(updateLiveTime, 1000);
    }, millisecondsToNextSecond);

    setTimeout(() => {
        changeBackgroundByTiming();
    
        setInterval(changeBackgroundByTiming, 60000);
    }, millisecondsToNextMinute);
}

function backgroundMiddleChecker() {
    if (toSettingsButtonClicked) {
        clearInterval(defaultTimer)
    } else {
        startDefaultBgTimer()
    }
}

startLiveTime();

document.getElementById("toSettingsButton").addEventListener("click", () => {

    toSettingsButtonClicked = true;

    stopDefaultBgTimer();

    document.querySelectorAll(".prayerButton").forEach(button => {
        button.removeEventListener('mouseenter', hoverOpacity)
        button.removeEventListener('mouseenter', stopDefaultBgTimer)
        button.removeEventListener('mouseleave', startDefaultBgTimer)
    });

    document.getElementById("clock").style.opacity = 0;

    document.querySelectorAll(".prayerButton").forEach((button, index) => {
        sleep(250 * (index + 1)).then(() => {button.style.opacity = 0;})
    });

    // sleep(1750).then(() => {document.getElementById("bottomDiv").style.opacity = 0})

    sleep(2000).then(() => {document.getElementById("settingsTitle").style.opacity = 1});
    sleep(2250).then(() => {document.getElementById("calcMethodTitle").style.opacity = 1});
    sleep(2500).then(() => {document.getElementById("calcMethodSelect").style.opacity = 1});
    document.documentElement.style.setProperty("--dropdownIndex", 10)
    
});