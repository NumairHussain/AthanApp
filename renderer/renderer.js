const axios = require('axios');

/*--------------------------To Do List--------------------------------
-add minimize button that shrinks screen to only show current 
    timing and the next timing, possibility to make it fully transparent
    *Scrapped*
-make each screen have small details in the background
    *Scrapped*
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

let now;
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

const dropdowns = document.querySelectorAll('.dropdown');

var tempButton;

let sendFajrNotif;
let sendSunriseNotif;
let sendDhuhrNotif;
let sendAsrNotif;
let sendMaghribNotif;
let sendIshaNotif;

const homePageButtons = [
    fajrButton, sunriseButton, dhuhrButton, 
    asrButton, maghribButton, ishaButton
];

const settingsPageElements = [
    document.getElementById("calcMethodTitle"), 
    document.getElementById("calcMethodDropdown"), 
    document.getElementById("latitudeRuleTitle"),
    document.getElementById("latitudeRuleDropdown"),
    document.getElementById("madhabTitle"),
    document.getElementById("madhabSelect"),
    document.getElementById("notificationsDiv"),
    document.getElementById("doneDiv")
]

const notificationPageElements = [
    document.getElementById("notificationTitle"),
    document.getElementById("fajrNotificationDiv"),
    document.getElementById("sunriseNotificationDiv"),
    document.getElementById("dhuhrNotificationDiv"),
    document.getElementById("asrNotificationDiv"),
    document.getElementById("maghribNotificationDiv"),
    document.getElementById("ishaNotificationDiv"),
    document.getElementById("backToSettingsButton")
]

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

    new Notification("Athan App", {
        icon: "../assets/white mosque.png",
        title: title,
        body: body
    })
}

function changeBackgroundAndButtons(thisButton, thisTitle) {

    document.querySelectorAll(".prayerButton").forEach(button => {
        button.style.opacity = .12;
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
        button.style.opacity = .12;
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

        if (!sentFajrNotifFlag && sendFajrNotif == "true") {
            sendNotification("Fajr");
            sentFajrNotifFlag = true;
        }

    } else if (currentTime >= sunriseTime && currentTime < dhuhrAdhanTime) {

        if (toSettingsButtonClicked) {
            changeBackgroundOnly(sunriseButton)
        } else {
            changeBackgroundAndButtons(sunriseButton, sunriseTitle)
        }

        if (!sentSunriseNotifFlag && sendSunriseNotif == "true") {
            sendNotification("Sunrise");
            sentSunriseNotifFlag = true;
        }
        
    } else if (currentTime >= dhuhrAdhanTime && currentTime < asrAdhanTime) {

        if (toSettingsButtonClicked) {
            changeBackgroundOnly(dhuhrButton)
        } else {
            changeBackgroundAndButtons(dhuhrButton, dhuhrTitle)
        }

        if (!sentDhuhrNotifFlag && sendDhuhrNotif == "true") {
            sendNotification("Dhuhr");
            sentDhuhrNotifFlag = true;
        }
        
    } else if (currentTime >= asrAdhanTime && currentTime < maghribAdhanTime) {

        if (toSettingsButtonClicked) {
            changeBackgroundOnly(asrButton)
        } else {
            changeBackgroundAndButtons(asrButton, asrTitle)
        }

        if (!sentAsrNotifFlag && sendAsrNotif == "true") {
            sendNotification("Asr");
            sentAsrNotifFlag = true;
        }

    } else if (currentTime >= maghribAdhanTime && currentTime < ishaAdhanTime) {

        if (toSettingsButtonClicked) {
            changeBackgroundOnly(maghribButton)
        } else {
            changeBackgroundAndButtons(maghribButton, maghribTitle)
        }

        if (!sentMaghribNotifFlag && sendMaghribNotif == "true") {
            sendNotification("Maghrib");
            sentMaghribNotifFlag = true;
        }
        
    } else {

        if (toSettingsButtonClicked) {
            changeBackgroundOnly(ishaButton)
        } else {
            changeBackgroundAndButtons(ishaButton, ishaTitle)
        }
        
        if (!sentIshaNotifFlag && sendIshaNotif == "true") {
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

    }, 2000)
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

    homePageButtons.forEach((element, index) => {
        sleep(250 * (index + 1) + 250).then(() => {
            element.style.opacity = 0;
        })
    })

    sleep(2000).then(() => {document.getElementById("bottomDiv").style.opacity = 0})

    sleep(2250).then(() => {document.getElementById("settingsTitle").style.opacity = 1})

    settingsPageElements.forEach((element, index) => {
        sleep(250 * (index + 1) + 2500).then(() => {
            element.style.opacity = 1;
        })
    })

    document.documentElement.style.setProperty("--dropdownIndex", 10)

});

dropdowns.forEach(dropdown => {
    const select = dropdown.querySelector('.select');
    const caret = dropdown.querySelector('.caret');
    const menu = dropdown.querySelector('.menu');
    const options = dropdown.querySelectorAll('.menu li');
    const selected = dropdown.querySelector('.selected');

    select.addEventListener('click', () => {
        select.classList.toggle('select-clicked');
        caret.classList.toggle('caret-rotate');
        menu.classList.toggle('menu-open');
    });

    options.forEach(option => {
        option.addEventListener('click', () => {
            selected.innerText = option.innerText;
            selected.classList.add("text-fade-in");
            setTimeout (() => {
                selected.classList.remove("text-fade-in")
            }, 300);

            select.classList.remove('select-clicked')
            caret.classList.remove('caret-rotate');
            menu.classList.remove('menu-open');

            options.forEach(option => {
                option.classList.remove('active')
            })
            option.classList.add('active');
        });
        //add window.localstorage.setItem
    });
});

document.getElementById("doneButton").addEventListener("click", () => {

    document.getElementById("settingsTitle").style.opacity = 0;

    settingsPageElements.forEach((element, index) => {
        sleep(250 * (index + 1) + 250).then(() => {
            element.style.opacity = 0;
        })
    })

    sleep(2250).then(() => {
        document.getElementById("clock").style.opacity = 1;
    })

    homePageButtons.forEach((element, index) => {
        sleep(250 * (index + 1) + 2500).then(() => {
            element.style.opacity = .12;
        })
    })

    sleep(4000).then(() => {
        document.documentElement.style.setProperty("--dropdownIndex", -1);
        toSettingsButtonClicked = false;
        startDefaultBgTimer();
        document.querySelectorAll(".prayerButton").forEach(button => {
            button.addEventListener('mouseenter', hoverOpacity)
            button.addEventListener('mouseenter', stopDefaultBgTimer)
            button.addEventListener('mouseleave', startDefaultBgTimer)
        });
    });

    sleep(4500).then(() => {
        document.getElementById("bottomDiv").style.opacity = 1;
    })

    saveLocalInfo();

});



document.getElementById("notificationButton").addEventListener("click", () => {

    settingsPageElements.forEach((element, index) => {
        sleep(250 * (index + 1)).then(() => {
            element.style.opacity = 0;
        })
    })

    document.documentElement.style.setProperty("--dropdownIndex", -1)

    notificationPageElements.forEach((element, index) => {
        sleep(250 * (index + 1) + 2000).then(() => {
            element.style.opacity = 1;
            element.style.zIndex = 5;
        })
    })

})

document.getElementById("backToSettingsButton").addEventListener("click", () => {

    notificationPageElements.forEach((element, index) => {
        sleep(250 * (index + 1)).then(() => {
            element.style.opacity = 0;
            element.style.zIndex = -30;
        })
    })

    document.documentElement.style.setProperty("--dropdownIndex", 10)

    settingsPageElements.forEach((element, index) => {
        sleep(250 * (index + 1) + 2000).then(() => {
            element.style.opacity = 1;
        })
    })
})

function saveLocalInfo() {

    let calcMethodSelected = document.querySelectorAll(".selected")[0].innerText;
    let latitudeRuleSelected = document.querySelectorAll(".selected")[1].innerText;
    let madhabSelected;
    sendFajrNotif = document.getElementById("fajrCheck").checked;
    sendSunriseNotif = document.getElementById("sunriseCheck").checked;
    sendDhuhrNotif = document.getElementById("dhuhrCheck").checked;
    sendAsrNotif = document.getElementById("asrCheck").checked;
    sendMaghribNotif = document.getElementById("maghribCheck").checked;
    sendIshaNotif = document.getElementById("ishaCheck").checked;

    document.getElementsByName('toggle').forEach((element) => {
        if (element.checked)
        {
            madhabSelected = element.id;
        }
    });

    console.log(calcMethodSelected);
    console.log(latitudeRuleSelected);
    console.log(madhabSelected);
    console.log(sendFajrNotif);
    console.log(sendSunriseNotif);
    console.log(sendDhuhrNotif);
    console.log(sendAsrNotif);
    console.log(sendMaghribNotif);
    console.log(sendIshaNotif);

    window.localStorage.setItem("calcMethod", calcMethodSelected)
    window.localStorage.setItem("latRule", latitudeRuleSelected)
    window.localStorage.setItem("madhab", madhabSelected)
    window.localStorage.setItem("sendFajrNotif", sendFajrNotif)
    window.localStorage.setItem("sendSunriseNotif", sendSunriseNotif)
    window.localStorage.setItem("sendDhuhrNotif", sendDhuhrNotif)
    window.localStorage.setItem("sendAsrNotif", sendAsrNotif)
    window.localStorage.setItem("sendMaghribNotif", sendMaghribNotif)
    window.localStorage.setItem("sendIshaNotif", sendIshaNotif)
}



function loadLocalStorage() {

    let calcMethodSelected = window.localStorage.getItem("calcMethod");
    let latitudeRuleSelected = window.localStorage.getItem("latRule");
    let madhabSelected = window.localStorage.getItem("madhab");
    sendFajrNotif = window.localStorage.getItem("sendFajrNotif");
    sendSunriseNotif = window.localStorage.getItem("sendSunriseNotif");
    sendDhuhrNotif = window.localStorage.getItem("sendDhuhrNotif");
    sendAsrNotif = window.localStorage.getItem("sendAsrNotif");
    sendMaghribNotif = window.localStorage.getItem("sendMaghribNotif");
    sendIshaNotif = window.localStorage.getItem("sendIshaNotif");

    setDefaultDropdown("calcMethodDropdown", calcMethodSelected)
    setDefaultDropdown("latitudeRuleDropdown", latitudeRuleSelected)

    if (madhabSelected == "toggle-on")
    {
        document.getElementById("toggle-on").checked = true;
        document.getElementById("toggle-off").checked = false;
    }
    else
    {
        document.getElementById("toggle-on").checked = false;
        document.getElementById("toggle-off").checked = true;
    }

    document.getElementById("fajrCheck").checked = sendFajrNotif == "true" ? true : false;
    document.getElementById("sunriseCheck").checked =  sendSunriseNotif == "true" ? true : false;
    document.getElementById("dhuhrCheck").checked =  sendDhuhrNotif == "true" ? true : false;
    document.getElementById("asrCheck").checked =  sendAsrNotif == "true" ? true : false;
    document.getElementById("maghribCheck").checked =  sendMaghribNotif == "true" ? true : false;
    document.getElementById("ishaCheck").checked =  sendIshaNotif == "true" ? true : false;

    console.log("Retrieved from local storage")
    console.log(calcMethodSelected)
    console.log(latitudeRuleSelected)
    console.log(madhabSelected)
    console.log(sendFajrNotif)
    console.log(sendSunriseNotif)
    console.log(sendDhuhrNotif)
    console.log(sendAsrNotif)
    console.log(sendMaghribNotif)
    console.log(sendIshaNotif)
}

function setDefaultDropdown(dropdownId, defaultItem) {
    const dropdown = document.getElementById(dropdownId);
    const selected = dropdown.querySelector('.selected');
    const menuItems = dropdown.querySelectorAll('.menu li');

    menuItems.forEach(item => {
        if (item.textContent === defaultItem) {
            selected.textContent = defaultItem;
            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        }
    });
}

loadLocalStorage()