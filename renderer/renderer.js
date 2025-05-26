// Copyright (c) 2025 Numair Hussain
// Licensed under the MIT License. See LICENSE file in the project root for full license information.

console.log("window.api is", window.api);

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
let millisecondsToNextDay;

let toSettingsButtonClicked;

var tempButton;

let sendFajrNotif;
let sendSunriseNotif;
let sendDhuhrNotif;
let sendAsrNotif;
let sendMaghribNotif;
let sendIshaNotif;

let sendNotifFlags = [
    sendFajrNotif, 
    sendSunriseNotif, 
    sendDhuhrNotif, 
    sendAsrNotif, 
    sendMaghribNotif, 
    sendIshaNotif
];

let geolocationData;
let geolocationCity;
let geolocationRegion;
let geolocationCountry;

let locationName

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

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

//IT FUCKING WORKS FINALLLYYYY
//API Call to GEOJS to get location data, unable to do geolocation.navigator for some reason
//This will be called every time the app is opened and when the button for the location is clicked
const getLocation = async () => {
    console.log("Fetching geolocation data...");
    geolocationData = await window.api.axiosGet(`https://get.geojs.io/v1/ip/geo.json`);
    
    //Assigning the data to variables
    geolocationCity = geolocationData.city;
    geolocationRegion = geolocationData.region;
    geolocationCountry = geolocationData.country;

    //Setting the location data to local storage
    window.localStorage.setItem("geolocationCity", geolocationCity);
    window.localStorage.setItem("geolocationRegion", geolocationRegion);
    window.localStorage.setItem("geolocationCountry", geolocationCountry);

    //Creating a variable for the whole location name
    locationName = "\u00A0" + geolocationCity + ", " + geolocationRegion;

    //Setting the location name to the button to show user
    document.getElementById("locationButtonName").innerText = locationName;

    //Calling the getPrayerTimes function to get the prayer times for the location
    console.log("Location data fetched successfully");
    console.log("City: " + geolocationCity);
    getPrayerTimes();
}

let calcMethodSelected;
let latitudeRuleSelected;
let madhabSelected;

const getPrayerTimes = async () => {

    //Getting the method number, midnight mode, and the school from the local storage
    let methodNumberParameter = getMethodNumber(calcMethodSelected);
    let schoolParameter = madhabSelected == "toggle-on" ? 1 : 0;
    let latitudeRuleParameter = getLatitudeNumber(latitudeRuleSelected);

    // http://api.aladhan.com/v1/timingsByCity/11-11-2024?city=ypsilanti&country=us&school=1&method=2&latitudeAdjustmentMethod=1
    // https://api.aladhan.com/v1/calendarByCity/2024/12?city=ypsilanti&country=US&method=2&school=1


    try {
        //API call to get the prayer times for the location and the query parameters
        console.log("Fetching prayer times for: " + geolocationCity + ", " + geolocationCountry);
        let apiPrayerTimeData = await window.api.axiosGet(
            `http://api.aladhan.com/v1/timingsByCity`, 
            {
            params: {
                city: geolocationCity,
                country: geolocationCountry,
                method: methodNumberParameter, //ranges from 0-23
                school: schoolParameter, // ranges from 0-1
                latitudeAdjustmentMethod: latitudeRuleParameter // ranges from 1-3
            }
        });

        //Assigning the prayer times to the prayerTimes variable
        prayerTimes = apiPrayerTimeData.data.timings;

        //Assigning the prayer times to the variables
        fajrAdhanTime = prayerTimes.Fajr;
        sunriseTime = prayerTimes.Sunrise;
        dhuhrAdhanTime = prayerTimes.Dhuhr;
        asrAdhanTime = prayerTimes.Asr;
        maghribAdhanTime = prayerTimes.Maghrib;
        ishaAdhanTime = prayerTimes.Isha;

        //Calling the displayPrayerTimes function to display the prayer times
        changeBackgroundByTiming()
        displayPrayerTimes();

        //still need a system to reset the sentNotifFlags to false upon new day

    } catch (error) {
        console.error("Error getting prayer times: ", error);
    }
};

//A function to convert military time to standard time
function toStandardTime(militaryTime) {
    //Splitting the military time into hours, minutes, and seconds
    let [hours, minutes, seconds] = militaryTime.split(':').map(Number);

    //Setting the period to AM or PM
    const period = hours >= 12 ? 'PM' : 'AM';

    //Converting the hours to standard time
    hours = hours % 12 || 12;

    //Returning the standard time
    return seconds == null ? `${hours}:${minutes.toString().padStart(2, '0')} ${period}` : 
    `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${period}`;
}

const displayPrayerTimes = () => {

    //Checking if the prayer times are available
    if (!prayerTimes) {
        console.error("No prayer times data available");
        return;
    }

    //This is to display the Fajr time on the screen, it defaults to having a 0 in front of the hour if it is less than 10, removing that 0
    document.getElementById("fajrAdhanTimeTitle").innerText = String(
        toStandardTime(fajrAdhanTime)).charAt(0) == "0" ? 
        toStandardTime(fajrAdhanTime).substring(1, 
            toStandardTime(fajrAdhanTime).length) : 
            toStandardTime(fajrAdhanTime);

    //This is to display the Sunrise time on the screen, it defaults to having a 0 in front of the hour if it is less than 10, removing that 0
    document.getElementById("sunriseTimeTitle").innerText = String(
        toStandardTime(sunriseTime)).charAt(0) == "0" ? 
        toStandardTime(sunriseTime).substring(1, 
            toStandardTime(sunriseTime).length) : 
            toStandardTime(sunriseTime);

    //This is to display the Dhuhr time on the screen, it defaults to having a 0 in front of the hour if it is less than 10, removing that 0
    document.getElementById("dhuhrAdhanTimeTitle").innerText = String(
        toStandardTime(dhuhrAdhanTime)).charAt(0) == "0" ? 
        toStandardTime(dhuhrAdhanTime).substring(1, 
            toStandardTime(dhuhrAdhanTime).length) : 
            toStandardTime(dhuhrAdhanTime);

    //This is to display the Asr time on the screen, it defaults to having a 0 in front of the hour if it is less than 10, removing that 0
    document.getElementById("asrAdhanTimeTitle").innerText = String(
        toStandardTime(asrAdhanTime)).charAt(0) == "0" ? 
        toStandardTime(asrAdhanTime).substring(1, 
            toStandardTime(asrAdhanTime).length) : 
            toStandardTime(asrAdhanTime);

    //This is to display the Maghrib time on the screen, it defaults to having a 0 in front of the hour if it is less than 10, removing that 0
    document.getElementById("maghribAdhanTimeTitle").innerText = String(
        toStandardTime(maghribAdhanTime)).charAt(0) == "0" ? 
        toStandardTime(maghribAdhanTime).substring(1, 
            toStandardTime(maghribAdhanTime).length) : 
            toStandardTime(maghribAdhanTime);

    //This is to display the Isha time on the screen, it defaults to having a 0 in front of the hour if it is less than 10, removing that 0
    document.getElementById("ishaAdhanTimeTitle").innerText = String(
        toStandardTime(ishaAdhanTime)).charAt(0) == "0" ? 
        toStandardTime(ishaAdhanTime).substring(1, 
            toStandardTime(ishaAdhanTime).length) : 
            toStandardTime(ishaAdhanTime);
};

//Function to send a notification to the user with the prayer name, icon, and title
const sendNotification = (salahName) => {
    var title = "Athan App";
    var body = `It's ${salahName} Time!`;

    new Notification("Athan App", {
        icon: "../assets/white mosque.png",
        title: title,
        body: body
    })
}

//Function to change the background and the buttons based on the time, 
// setting background color to the button color
// setting the correct buttons opacity to 1 and the rest to .12
function changeBackgroundAndButtons(thisButton, thisTitle) {

    //Setting all the buttons to an opacity of .12
    document.querySelectorAll(".prayerButton").forEach(button => {
        button.style.opacity = .12;
    })

    //Checks every title for the extra character thats added when its the current time, then sets that to nothing to remove that character
    document.querySelectorAll(".prayerTitle").forEach(button => {
        if (button.innerText.charAt(0) == "\u2022") {
            button.innerText = button.innerText.substring(1, button.innerText.length)
        }
    })

    //Sets the current button to an opacity of 1
    thisButton.style.opacity = 1;

    //Adds the extra character to the title to show that it is the current time
    thisTitle.innerText = String(thisTitle.innerText).charAt(0) != "\u2022" ? "\u2022 " + thisTitle.innerText : thisTitle.innerText;

    //Sets the background color to the button color
    document.documentElement.style.setProperty(
        "--bgColorNew", 
        window.getComputedStyle(thisButton).backgroundImage
    );

    //Sets the background opacity to 1
    document.documentElement.style.setProperty("--bgOpacity", 1);

    //Sets the CSS variable to the new background color after 250ms
    sleep(250).then(() => {document.documentElement.style.setProperty(
        "--bgColorOld", 
        document.documentElement.style.getPropertyValue("--bgColorNew"));
    });

    //Sets the CSS variable background opacity to 0 after 250ms
    sleep(250).then(() => {document.documentElement.style.setProperty(
        "--bgOpacity", 0);
    });

    //sets the button and prayer time thats the current prayer time as initial
    initialButton = thisButton;
}

//Function to change the background only, used when the user hovers over a button
function changeBackgroundOnly(thisButton) {

    //Setting the CSS variable to the background color of the button hovered over
    document.documentElement.style.setProperty(
        "--bgColorNew", 
        window.getComputedStyle(thisButton).backgroundImage
    );

    //Setting the CSS variable background opacity to 1
    document.documentElement.style.setProperty("--bgOpacity", 1);

    //Setting the CSS variable background color to the new background color after 250ms
    sleep(250).then(() => {document.documentElement.style.setProperty(
        "--bgColorOld", 
        document.documentElement.style.getPropertyValue("--bgColorNew"));
    });

    //Setting the CSS variable background opacity to 0 after 250ms
    sleep(250).then(() => {document.documentElement.style.setProperty(
        "--bgOpacity", 0);
    });

    //sets the button and prayer time thats the current prayer time as initial
    initialButton = thisButton;
}

//Function to change the opacity of the buttons when the user hovers over them
function hoverOpacity() {

    //Setting all the buttons to an opacity of .12
    document.querySelectorAll(".prayerButton").forEach(button => {
        button.style.opacity = .12;
    })

    //Setting the button that is hovered over to an opacity of 1
    this.style.opacity = 1
    
    //Setting the CSS variable to the background color of the button hovered over
    document.documentElement.style.setProperty(
        "--bgColorNew", 
        window.getComputedStyle(this).backgroundImage
    );

    //Setting the CSS variable background opacity to 1
    document.documentElement.style.setProperty("--bgOpacity", 1);

    //Setting the CSS variable background color to the new background color after 250ms
    sleep(250).then(() => {document.documentElement.style.setProperty(
        "--bgColorOld", 
        document.documentElement.style.getPropertyValue("--bgColorNew"));
    });

    //Setting the CSS variable background opacity to 0 after 250ms
    sleep(250).then(() => {document.documentElement.style.setProperty(
        "--bgOpacity", 0);
    });
}

//Function that changes the background color, the button highlightes, and checks whether to send a notification based on the time
function changeBackgroundByTiming() {

    //Gets the current time in the format of HH:MM
    var currentTime = new Date().toLocaleTimeString(
        ['it-IT'], {hour: '2-digit', minute: '2-digit'}
    );

    //Checks if the current time is between the Fajr and Sunrise time
    if (currentTime >= fajrAdhanTime && currentTime < sunriseTime) {

        //Checks if the user is on the settings page
        if (toSettingsButtonClicked) {
            //if it is then changes the background only, otherwise the buttons would appear in the settings page
            changeBackgroundOnly(fajrButton)
        } else {
            //if not then changes the background and the buttons
            changeBackgroundAndButtons(fajrButton, fajrTitle)
        }
        
        //Checks if the notification has been sent, if not then sends the notification and then changes the flag to True
        if (!sentFajrNotifFlag && sendFajrNotif == "true") {
            sendNotification("Fajr");
            sentFajrNotifFlag = true;
        }

    //Checks if the current time is between the Sunrise and Dhuhr time
    } else if (currentTime >= sunriseTime && currentTime < dhuhrAdhanTime) {

        //Checks if the user is on the settings page
        if (toSettingsButtonClicked) {
            //if it is then changes the background only, otherwise the buttons would appear in the settings page
            changeBackgroundOnly(sunriseButton)
        } else {
            //if not then changes the background and the buttons
            changeBackgroundAndButtons(sunriseButton, sunriseTitle)
        }

        //Checks if the notification has been sent, if not then sends the notification and then changes the flag to True
        if (!sentSunriseNotifFlag && sendSunriseNotif == "true") {
            sendNotification("Sunrise");
            sentSunriseNotifFlag = true;
        }
        
    //Checks if the current time is between the Dhuhr and Asr time
    } else if (currentTime >= dhuhrAdhanTime && currentTime < asrAdhanTime) {

        //Checks if the user is on the settings page
        if (toSettingsButtonClicked) {
            //if it is then changes the background only, otherwise the buttons would appear in the settings page
            changeBackgroundOnly(dhuhrButton)
        } else {
            //if not then changes the background and the buttons
            changeBackgroundAndButtons(dhuhrButton, dhuhrTitle)
        }

        //Checks if the notification has been sent, if not then sends the notification and then changes the flag to True
        if (!sentDhuhrNotifFlag && sendDhuhrNotif == "true") {
            sendNotification("Dhuhr");
            sentDhuhrNotifFlag = true;
        }
        
    //Checks if the current time is between the Asr and Maghrib time
    } else if (currentTime >= asrAdhanTime && currentTime < maghribAdhanTime) {

        //Checks if the user is on the settings page
        if (toSettingsButtonClicked) {
            //if it is then changes the background only, otherwise the buttons would appear in the settings page
            changeBackgroundOnly(asrButton)
        } else {
            //if not then changes the background and the buttons
            changeBackgroundAndButtons(asrButton, asrTitle)
        }

        //Checks if the notification has been sent, if not then sends the notification and then changes the flag to True
        if (!sentAsrNotifFlag && sendAsrNotif == "true") {
            sendNotification("Asr");
            sentAsrNotifFlag = true;
        }

    //Checks if the current time is between the Maghrib and Isha time
    } else if (currentTime >= maghribAdhanTime && currentTime < ishaAdhanTime) {

        //Checks if the user is on the settings page
        if (toSettingsButtonClicked) {
            //if it is then changes the background only, otherwise the buttons would appear in the settings page
            changeBackgroundOnly(maghribButton)
        } else {
            //if not then changes the background and the buttons
            changeBackgroundAndButtons(maghribButton, maghribTitle)
        }

        //Checks if the notification has been sent, if not then sends the notification and then changes the flag to True
        if (!sentMaghribNotifFlag && sendMaghribNotif == "true") {
            sendNotification("Maghrib");
            sentMaghribNotifFlag = true;
        }
        
    //Checks if the current time is between the Isha and the next Fajr time
    } else {

        //Checks if the user is on the settings page
        if (toSettingsButtonClicked) {
            //if it is then changes the background only, otherwise the buttons would appear in the settings page
            changeBackgroundOnly(ishaButton)
        } else {
            //if not then changes the background and the buttons
            changeBackgroundAndButtons(ishaButton, ishaTitle)
        }
        
        //Checks if the notification has been sent, if not then sends the notification and then changes the flag to True
        if (!sentIshaNotifFlag && sendIshaNotif == "true") {
            sendNotification("Isha");
            sentIshaNotifFlag = true;
        }
    }
}

//Function to add event listeners to the buttons, the hovering function
function addButtonEventListener() {

    document.querySelectorAll('.prayerButton').forEach(button => { 
    
        button.addEventListener('mouseenter', stopDefaultBgTimer);
    
        button.addEventListener('mouseleave', startDefaultBgTimer);

        button.addEventListener("mouseenter", hoverOpacity)
        
    });

    //Compiled redundant code into a forEach loop
    
    // fajrButton.addEventListener("mouseenter", hoverOpacity)

    // sunriseButton.addEventListener("mouseenter", hoverOpacity)

    // dhuhrButton.addEventListener("mouseenter", hoverOpacity)

    // asrButton.addEventListener("mouseenter", hoverOpacity)

    // maghribButton.addEventListener("mouseenter", hoverOpacity)

    // ishaButton.addEventListener("mouseenter", hoverOpacity)
}

//Assigning the event listeners to the buttons


/*
Function to start the default background timer that changes the background back to the original color 
when the users cursor goes off the buttons, after 2 seconds of not hovering over the buttons
*/
const startDefaultBgTimer = () => {

    //Possibly useless, will leave commented just in case
    //Checks the flag to see if the mouse has entered the buttons
    // if (mouseEnterFlag) {
    //     mouseEnterFlag = false;
    // } else {
    //     return
    // }

    //Clears the default timer
    clearTimeout(defaultTimer);

    //Sets the default timer to change the background back to the original color after 2 seconds
    defaultTimer = setTimeout(() => {

        //Sets the opacity of all the buttons to .12
        document.querySelectorAll(".prayerButton").forEach(button => {
            button.style.opacity = .12;
        })

        //Sets the opacity of the initial button back to 1
        initialButton.style.opacity = 1

        //Sets the CSS variable background color to the original background color
        document.documentElement.style.setProperty(
            "--bgColorNew", window.getComputedStyle(initialButton).backgroundImage
        );

        //Sets the CSS variable background opacity to 1
        document.documentElement.style.setProperty("--bgOpacity", 1);

        //Sets the CSS variable background color to the new background color after 250ms
        sleep(250).then(() => {document.documentElement.style.setProperty(
            "--bgColorOld", 
            document.documentElement.style.getPropertyValue("--bgColorNew"));
        });
    
        //Sets the CSS variable background opacity to 0 after 250ms
        sleep(250).then(() => {document.documentElement.style.setProperty(
            "--bgOpacity", 0);
        });

    }, 2000)
};

//Function to stop the default background timer
const stopDefaultBgTimer = () => {
    clearTimeout(defaultTimer)
    //possibly useless, will leave commented just in case
    // mouseEnterFlag = true;
}

//Function to update the timer at the top of the home page
function updateLiveTime() {

    //Getting the time and formatting it
    const now = new Date();
    const hours = String(now.getHours());
    const minutes = String(now.getMinutes());
    const seconds = String(now.getSeconds());
    const formattedTime = `${hours}:${minutes}:${seconds}`;

    //Assigning the formatted time to the inner text of the clock element
    document.getElementById('clock').innerText = toStandardTime(formattedTime);
}

//Function that essentially starts the main page, including starting the clock timer
function startLiveTime() {
    updateLiveTime();
    addButtonEventListener();

    // Gets the time from when the function starts to the next second in milliseconds
    now = new Date();
    millisecondsToNextSecond = 1000 - now.getMilliseconds(); // 1000 - now.getMilliseconds() is the time until the next second
    millisecondsToNextMinute = ((60 - now.getSeconds()) * 1000) + millisecondsToNextSecond; // 60 - now.getSeconds() is the time until the next minute
    millisecondsToNextDay = ((24 - now.getHours()) * 60 * 60 * 1000) + ((60 - now.getMinutes()) * 60 * 1000) + millisecondsToNextSecond + 5000; 
    // 24 - now.getHours() is the time until the next day 
    // 60 - now.getMinutes() is the time until the next hour

    //updates the live time every second on the second
    setTimeout(() => {
        updateLiveTime();

        setInterval(updateLiveTime, 1000);
    }, millisecondsToNextSecond);

    //calls the function that checks the time every minute on the minute
    setTimeout(() => {
        changeBackgroundByTiming();
    
        setInterval(changeBackgroundByTiming, 60000);
    }, millisecondsToNextMinute);

    setTimeout(() => {

        sendNotifFlags.forEach((flag) => {
            flag = false;   
        });

        getPrayerTimes();

    }, millisecondsToNextDay);
}

startLiveTime();

//An event listener function for the Settings button at the bottom of the main page
document.getElementById("toSettingsButton").addEventListener("click", () => {

    //A flag for if the settings button is clicked
    toSettingsButtonClicked = true;

    //Stops the function that changes the background color after 2 seconds
    stopDefaultBgTimer();

    //Removes the event listeners
    document.querySelectorAll(".prayerButton").forEach(button => {
        button.removeEventListener('mouseenter', hoverOpacity)
        button.removeEventListener('mouseenter', stopDefaultBgTimer)
        button.removeEventListener('mouseleave', startDefaultBgTimer)
    });

    //Makes the clock's opacity to 0
    document.getElementById("clock").style.opacity = 0;

    //Makes all the home page buttons opacity to 0 after a certain amount of time for each
    homePageButtons.forEach((element, index) => {
        sleep(250 * (index + 1) + 250).then(() => {
            element.style.opacity = 0;
        })
    })

    //Makes the bottom div of the main page's opacity to 0
    sleep(2000).then(() => {document.getElementById("bottomDiv").style.opacity = 0})

    //Makes the title of the settings page opacity to 1
    sleep(2250).then(() => {document.getElementById("settingsTitle").style.opacity = 1})

    //Makes all the elements in the settings page opacity to 1
    settingsPageElements.forEach((element, index) => {
        sleep(250 * (index + 1) + 2500).then(() => {
            element.style.opacity = 1;
        })
    })

    //makes the z-index of the drop down to 10 in CSS
    document.documentElement.style.setProperty("--dropdownIndex", 10)

});

//Function that controls the dropdowns in the settings page
dropdowns.forEach(dropdown => {
    //Making references to elements
    const select = dropdown.querySelector('.select');
    const caret = dropdown.querySelector('.caret');
    const menu = dropdown.querySelector('.menu');
    const options = dropdown.querySelectorAll('.menu li');
    const selected = dropdown.querySelector('.selected');

    //Adding an event listener to clicking the dropdown
    select.addEventListener('click', () => {
        //adding these classes to each reference of elements
        select.classList.toggle('select-clicked');
        caret.classList.toggle('caret-rotate');
        menu.classList.toggle('menu-open');
    });

    //adding an event listener for each selection in the dropdown
    options.forEach(option => {
        option.addEventListener('click', () => {
            //Sets the innertext of the dropdown button to what was clicked and gives it the class
            selected.innerText = option.innerText;
            selected.classList.add("text-fade-in");

            //Removes the class from selected after 300 milliseconds
            setTimeout (() => {
                selected.classList.remove("text-fade-in")
            }, 300);

            //Removing the classes to each reference of elements
            select.classList.remove('select-clicked')
            caret.classList.remove('caret-rotate');
            menu.classList.remove('menu-open');

            //Removing the class for the option reference class
            options.forEach(option => {
                option.classList.remove('active')
            })
            //Adding the class for the current option
            option.classList.add('active');
        });
        //add window.localstorage.setItem
    });
});

//An event listener function to get back to the main page from the settings page
document.getElementById("doneButton").addEventListener("click", () => {

    //Setting the Settings title's opacity to 0
    document.getElementById("settingsTitle").style.opacity = 0;

    //Setting each element in the settings page's opacity to 0
    settingsPageElements.forEach((element, index) => {
        sleep(250 * (index + 1) + 250).then(() => {
            element.style.opacity = 0;
        })
    })

    //Setting the clock element of the main page's opacity to 1
    sleep(2250).then(() => {
        document.getElementById("clock").style.opacity = 1;
    })

    //Setting each element of the main page's opacity to 1
    homePageButtons.forEach((element, index) => {
        sleep(250 * (index + 1) + 2500).then(() => {
            element.style.opacity = .12;
        })
    })

    //Settings the CSS variable for the z index of the dropdown to -1, setting the flag as false, and calling two functions
    sleep(4000).then(() => {
        document.documentElement.style.setProperty("--dropdownIndex", -1);
        toSettingsButtonClicked = false;
        startDefaultBgTimer();
        addButtonEventListener();
    });
    

    //Setting the bottom div of the main page's opacity to 1
    sleep(4250).then(() => {
        document.getElementById("bottomDiv").style.opacity = 1;
    })
    
    //Saving the settings page's changes to the local storage
    saveLocalInfo();
});


//An event listener function to get to the notification page from the settings page
document.getElementById("notificationButton").addEventListener("click", () => {

    //Setting each element in the settings page
    settingsPageElements.forEach((element, index) => {
        sleep(250 * (index + 1)).then(() => {
            element.style.opacity = 0;
        })
    })

    //Setting the CSS variable to set the dropdown index's to -1
    document.documentElement.style.setProperty("--dropdownIndex", -1)

    //Setting the notification page elements' opacity and zindex to 1 and 5 respectively
    notificationPageElements.forEach((element, index) => {
        sleep(250 * (index + 1) + 2000).then(() => {
            element.style.opacity = 1;
            element.style.zIndex = 5;
        })
    })

})

//An event listener to go back to the settings page from the notification page's Done button
document.getElementById("backToSettingsButton").addEventListener("click", () => {

    //Setting the notification page elements' opacity and zindex to 0 and -30 respectively
    notificationPageElements.forEach((element, index) => {
        sleep(250 * (index + 1)).then(() => {
            element.style.opacity = 0;
            element.style.zIndex = -30;
        })
    })

    //Setting the CSS variable to set the dropdown index's to -1
    document.documentElement.style.setProperty("--dropdownIndex", 10)

    //Setting the elements of the settings page's opacity to 1 after a certain amount of time for each
    settingsPageElements.forEach((element, index) => {
        sleep(250 * (index + 1) + 2000).then(() => {
            element.style.opacity = 1;
        })
    })
})

//Function to save the settings into the localStorage Electron provides
function saveLocalInfo() {

    //Getting the innertext of the settings 
    calcMethodSelected = document.querySelectorAll(".selected")[0].innerText;
    latitudeRuleSelected = document.querySelectorAll(".selected")[1].innerText;
    document.getElementsByName('toggle').forEach((element) => {
        if (element.checked)
        {
            madhabSelected = element.id;
        }
    });

    //Getting whether the toggles for the notifications are checked or not
    sendFajrNotif = document.getElementById("fajrCheck").checked;
    sendSunriseNotif = document.getElementById("sunriseCheck").checked;
    sendDhuhrNotif = document.getElementById("dhuhrCheck").checked;
    sendAsrNotif = document.getElementById("asrCheck").checked;
    sendMaghribNotif = document.getElementById("maghribCheck").checked;
    sendIshaNotif = document.getElementById("ishaCheck").checked;

    //Used for debugging
    // console.log(calcMethodSelected);
    // console.log(latitudeRuleSelected);
    // console.log(madhabSelected);
    // console.log(sendFajrNotif);
    // console.log(sendSunriseNotif);
    // console.log(sendDhuhrNotif);
    // console.log(sendAsrNotif);
    // console.log(sendMaghribNotif);
    // console.log(sendIshaNotif);

    //Setting the information grabbed into the dictionary into the Electron localStorage
    window.localStorage.setItem("calcMethod", calcMethodSelected)
    window.localStorage.setItem("latRule", latitudeRuleSelected)
    window.localStorage.setItem("madhab", madhabSelected)
    window.localStorage.setItem("sendFajrNotif", sendFajrNotif)
    window.localStorage.setItem("sendSunriseNotif", sendSunriseNotif)
    window.localStorage.setItem("sendDhuhrNotif", sendDhuhrNotif)
    window.localStorage.setItem("sendAsrNotif", sendAsrNotif)
    window.localStorage.setItem("sendMaghribNotif", sendMaghribNotif)
    window.localStorage.setItem("sendIshaNotif", sendIshaNotif)

    //Grabbing new prayertimes in case the settings got changed
    getPrayerTimes();
}


//Function to load the localStorage provided by Electron upon startup
function loadLocalStorage() {

    //Loading the information from the settings 
    calcMethodSelected = window.localStorage.getItem("calcMethod");
    latitudeRuleSelected = window.localStorage.getItem("latRule");
    madhabSelected = window.localStorage.getItem("madhab");

    //Loading the boolean check for the notification
    sendFajrNotif = window.localStorage.getItem("sendFajrNotif");
    sendSunriseNotif = window.localStorage.getItem("sendSunriseNotif");
    sendDhuhrNotif = window.localStorage.getItem("sendDhuhrNotif");
    sendAsrNotif = window.localStorage.getItem("sendAsrNotif");
    sendMaghribNotif = window.localStorage.getItem("sendMaghribNotif");
    sendIshaNotif = window.localStorage.getItem("sendIshaNotif");

    //MAY WANT TO MAKE THIS ITS OWN FUNCTION
    
    //Loading the location data from the localStorage
    geolocationCity = window.localStorage.getItem("geolocationCity");
    geolocationRegion = window.localStorage.getItem("geolocationRegion");
    geolocationCountry = window.localStorage.getItem("geolocationCountry");

    //Creating a variable for the whole location name
    locationName = "\u00A0" + geolocationCity + ", " + geolocationRegion;

    //Setting the location name to the button to show user
    document.getElementById("locationButtonName").innerText = locationName;

    //Setting the default dropdowns to the settings that were saved
    setDefaultDropdown("calcMethodDropdown", calcMethodSelected)
    setDefaultDropdown("latitudeRuleDropdown", latitudeRuleSelected)

    //Setting the madhab toggle to the settings that were saved
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

    //Setting the notification toggles to the settings that were saved
    document.getElementById("fajrCheck").checked = sendFajrNotif == "true" ? true : false;
    document.getElementById("sunriseCheck").checked =  sendSunriseNotif == "true" ? true : false;
    document.getElementById("dhuhrCheck").checked =  sendDhuhrNotif == "true" ? true : false;
    document.getElementById("asrCheck").checked =  sendAsrNotif == "true" ? true : false;
    document.getElementById("maghribCheck").checked =  sendMaghribNotif == "true" ? true : false;
    document.getElementById("ishaCheck").checked =  sendIshaNotif == "true" ? true : false;

    //Used for debugging
    // console.log("Retrieved from local storage")
    // console.log(calcMethodSelected)
    // console.log(latitudeRuleSelected)
    // console.log(madhabSelected)
    // console.log(sendFajrNotif)
    // console.log(sendSunriseNotif)
    // console.log(sendDhuhrNotif)
    // console.log(sendAsrNotif)
    // console.log(sendMaghribNotif)
    // console.log(sendIshaNotif)

    //Calling the getPrayerTimes function to get the prayer times for the location
    getPrayerTimes();
}

//Function to set the default dropdown to the settings that were saved
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

//Function to get the method number based on the method name
function getMethodNumber(methodName) {
    //Array of the method names
    const methods = ["Shia Ithna-Ashari", "University of Islamic Sciences, Karachi", 
        "Islamic Society of North America", "Muslim World League", 
        "Umm Al-Qura University, Makkah", "Egyptian General Authority of Survey", 
        "Institute of Geophysics, University of Tehran", "Gulf Region", "Kuwait", 
        "Qatar", "Majlis Ugama Islam Singapura, Singapore", 
        "Union Organization islamic de France", "Diyanet İşleri Başkanlığı, Turkey", 
        "Spiritual Administration of Muslims of Russia", "Moonsighting Committee Worldwide", "Dubai",
        "Jabatan Kemajuan Islam Malaysia", "Tunisia", "Algeria", 
        "KEMENAG - Kementerian Agama Republik Indonesia", "Morocco", "Comunidade Islamica de Lisboa",
        "Ministry of Awqaf, Islamic Affairs and Holy Places, Jordan"
    ];

    //Returns the index of the method name
    for (let i = 0; i < methods.length; i++)
    {
        if (methods[i] == methodName)
        {
            return i;
        }
    }
    return -1;
}

//Function to get the latitude number based on the latitude rule
function getLatitudeNumber(latitudeRule) {
    //Array of the latitude rules
    const latitudeRules = ["Middle of the Night", "One Seventh", "Angle Based"];

    //Returns the index of the latitude rule
    for (let i = 0; i < latitudeRules.length; i++)
    {
        if (latitudeRules[i] == latitudeRule)
        {
            return i + 1;
        }
    }
    return -1;
}
loadLocalStorage();
