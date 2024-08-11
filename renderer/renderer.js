const axios = require('axios');

/*--------------------------To Do List--------------------------------
-DONE - FIX SCREEN FLASHING DUE TO TIMER
-ADD SETTINGS AND LOCAL STORAGE
-CHECK LIVE TIMER SWITCHING AND SEND NOTIFICATIONS
-send notifications and can toggle them, probably 
    check box on the right of the time
-finish top and bottom div
-add minimize button that shrinks screen to only show current 
    timing and the next timing
-make each screen have small details in the background
-Randomly throughout the day, grab the next days prayer times and save it
    Change it and make it grab the whole calendar?
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
        body: body,
    })
}

function changeBackgroundByTiming() {

    console.log("reached background change function")

    var currentTime = new Date().toLocaleTimeString(
        ['it-IT'], {hour: '2-digit', minute: '2-digit'}
    );

    if (currentTime >= fajrAdhanTime && currentTime < sunriseTime) {

        document.querySelectorAll(".prayerButton").forEach(button => {
            button.style.opacity = .25;
        })

        document.querySelectorAll(".prayerTitle").forEach(button => {
            if (button.innerText.charAt(0) == "\u2022") {
                button.innerText = button.innerText.substring(1, button.innerText.length)
            }
        })

        fajrButton.style.opacity = 1;

        fajrTitle.innerText = String(fajrTitle.innerText).charAt(0) != "\u2022" ? "\u2022 " + fajrTitle.innerText : fajrTitle.innerText;

        document.documentElement.style.setProperty(
            "--bgColorNew", 
            window.getComputedStyle(fajrButton).backgroundImage
        );

        document.documentElement.style.setProperty("--bgOpacity", 1);

        sleep(250).then(() => {document.documentElement.style.setProperty(
            "--bgColorOld", 
            document.documentElement.style.getPropertyValue("--bgColorNew"));
        });

        sleep(250).then(() => {document.documentElement.style.setProperty(
            "--bgOpacity", 0);
        });

        initialButton = fajrButton;

        if (!sentFajrNotifFlag) {
            sendNotification("Fajr");
            sentFajrNotifFlag = true;
        }
        
    } else if (currentTime >= sunriseTime && currentTime < dhuhrAdhanTime) {

        document.querySelectorAll(".prayerButton").forEach(button => {
            button.style.opacity = .25;
        })

        document.querySelectorAll(".prayerTitle").forEach(button => {
            if (button.innerText.charAt(0) == "\u2022") {
                button.innerText = button.innerText.substring(1, button.innerText.length)
            }
        })

        sunriseButton.style.opacity = 1;

        sunriseTitle.innerText = String(sunriseTitle.innerText).charAt(0) != "\u2022" ? "\u2022 " + sunriseTitle.innerText : sunriseTitle.innerText;

        document.documentElement.style.setProperty(
            "--bgColorNew", 
            window.getComputedStyle(sunriseButton).backgroundImage
        );

        document.documentElement.style.setProperty("--bgOpacity", 1);

        sleep(250).then(() => {document.documentElement.style.setProperty(
            "--bgColorOld", 
            document.documentElement.style.getPropertyValue("--bgColorNew"));
        });

        sleep(250).then(() => {document.documentElement.style.setProperty(
            "--bgOpacity", 0);
        });

        initialButton = sunriseButton;

        if (!sentSunriseNotifFlag) {
            sendNotification("Sunrise");
            sentSunriseNotifFlag = true;
        }
        
    } else if (currentTime >= dhuhrAdhanTime && currentTime < asrAdhanTime) {

        document.querySelectorAll(".prayerButton").forEach(button => {
            button.style.opacity = .25;
        })

        document.querySelectorAll(".prayerTitle").forEach(button => {
            if (button.innerText.charAt(0) == "\u2022") {
                button.innerText = button.innerText.substring(1, button.innerText.length)
            }
        })

        dhuhrButton.style.opacity = 1;

        dhuhrTitle.innerText = String(dhuhrTitle.innerText).charAt(0) != "\u2022" ? "\u2022 " + dhuhrTitle.innerText : dhuhrTitle.innerText;

        document.documentElement.style.setProperty(
            "--bgColorNew", 
            window.getComputedStyle(dhuhrButton).backgroundImage
        );

        document.documentElement.style.setProperty("--bgOpacity", 1);

        sleep(250).then(() => {document.documentElement.style.setProperty(
            "--bgColorOld", 
            document.documentElement.style.getPropertyValue("--bgColorNew"));
        });

        sleep(250).then(() => {document.documentElement.style.setProperty(
            "--bgOpacity", 0);
        });

        initialButton = dhuhrButton;

        if (!sentDhuhrNotifFlag) {
            sendNotification("Dhuhr");
            sentDhuhrNotifFlag = true;
        }
        
    } else if (currentTime >= asrAdhanTime && currentTime < maghribAdhanTime) {

        document.querySelectorAll(".prayerButton").forEach(button => {
            button.style.opacity = .25;
        })

        document.querySelectorAll(".prayerTitle").forEach(button => {
            if (button.innerText.charAt(0) == "\u2022") {
                button.innerText = button.innerText.substring(1, button.innerText.length)
            }
        })

        asrButton.style.opacity = 1

        asrTitle.innerText = String(asrTitle.innerText).charAt(0) != "\u2022" ? "\u2022 " + asrTitle.innerText : asrTitle.innerText;

        document.documentElement.style.setProperty(
            "--bgColorNew", 
            window.getComputedStyle(asrButton).backgroundImage
        );

        document.documentElement.style.setProperty("--bgOpacity", 1);

        sleep(250).then(() => {document.documentElement.style.setProperty(
            "--bgColorOld", 
            document.documentElement.style.getPropertyValue("--bgColorNew"));
        });

        sleep(250).then(() => {document.documentElement.style.setProperty(
            "--bgOpacity", 0);
        });

        initialButton = asrButton;

        if (!sentAsrNotifFlag) {
            sendNotification("Asr");
            sentAsrNotifFlag = true;
        }

    } else if (currentTime >= maghribAdhanTime && currentTime < ishaAdhanTime) {

        document.querySelectorAll(".prayerButton").forEach(button => {
            button.style.opacity = .25;
        })

        document.querySelectorAll(".prayerTitle").forEach(button => {
            if (button.innerText.charAt(0) == "\u2022") {
                button.innerText = button.innerText.substring(1, button.innerText.length)
            }
        })

        maghribButton.style.opacity = 1;

        maghribTitle.innerText = String(maghribTitle.innerText).charAt(0) != "\u2022" ? "\u2022 " + maghribTitle.innerText : maghribTitle.innerText;

        document.documentElement.style.setProperty(
            "--bgColorNew", 
            window.getComputedStyle(maghribButton).backgroundImage
        );

        document.documentElement.style.setProperty("--bgOpacity", 1);

        sleep(250).then(() => {document.documentElement.style.setProperty(
            "--bgColorOld", 
            document.documentElement.style.getPropertyValue("--bgColorNew"));
        });

        sleep(250).then(() => {document.documentElement.style.setProperty(
            "--bgOpacity", 0);
        });

        initialButton = maghribButton;

        if (!sentMaghribNotifFlag) {
            sendNotification("Maghrib");
            sentMaghribNotifFlag = true;
        }
        

    } else {

        document.querySelectorAll(".prayerButton").forEach(button => {
            button.style.opacity = .25;
        })

        document.querySelectorAll(".prayerTitle").forEach(button => {
            if (button.innerText.charAt(0) == "\u2022") {
                button.innerText = button.innerText.substring(1, button.innerText.length)
            }
        })

        ishaButton.style.opacity = 1;

        ishaTitle.innerText = String(ishaTitle.innerText).charAt(0) != "\u2022" ? "\u2022 " + ishaTitle.innerText : ishaTitle.innerText;

        document.documentElement.style.setProperty(
            "--bgColorNew", 
            window.getComputedStyle(ishaButton).backgroundImage
        );

        document.documentElement.style.setProperty("--bgOpacity", 1);

        sleep(250).then(() => {document.documentElement.style.setProperty(
            "--bgColorOld", 
            document.documentElement.style.getPropertyValue("--bgColorNew"));
        });

        sleep(250).then(() => {document.documentElement.style.setProperty(
            "--bgOpacity", 0);
        });

        initialButton = ishaButton;

        if (!sentIshaNotifFlag) {
            sendNotification("Isha");
            sentIshaNotifFlag = true;
        }
    }
}

fajrButton.addEventListener("mouseenter", () => {

    document.querySelectorAll(".prayerButton").forEach(button => {
        button.style.opacity = .25;
    })

    fajrButton.style.opacity = 1
    
    document.documentElement.style.setProperty(
        "--bgColorNew", 
        window.getComputedStyle(fajrButton).backgroundImage
    );

    document.documentElement.style.setProperty("--bgOpacity", 1);

    sleep(250).then(() => {document.documentElement.style.setProperty(
        "--bgColorOld", 
        document.documentElement.style.getPropertyValue("--bgColorNew"));
    });

    sleep(250).then(() => {document.documentElement.style.setProperty(
        "--bgOpacity", 0);
    });
})

sunriseButton.addEventListener("mouseenter", () => {

    document.querySelectorAll(".prayerButton").forEach(button => {
        button.style.opacity = .25;
    })

    sunriseButton.style.opacity = 1
    
    document.documentElement.style.setProperty(
        "--bgColorNew", 
        window.getComputedStyle(sunriseButton).backgroundImage
    );

    document.documentElement.style.setProperty("--bgOpacity", 1);

    sleep(250).then(() => {document.documentElement.style.setProperty(
        "--bgColorOld", 
        document.documentElement.style.getPropertyValue("--bgColorNew"));
    });

    sleep(250).then(() => {document.documentElement.style.setProperty(
        "--bgOpacity", 0);
    });
})

dhuhrButton.addEventListener("mouseenter", () => {

    document.querySelectorAll(".prayerButton").forEach(button => {
        button.style.opacity = .25;
    })

    dhuhrButton.style.opacity = 1

    document.documentElement.style.setProperty(
        "--bgColorNew", 
        window.getComputedStyle(dhuhrButton).backgroundImage
    );

    document.documentElement.style.setProperty("--bgOpacity", 1);

    sleep(250).then(() => {document.documentElement.style.setProperty(
        "--bgColorOld", 
        document.documentElement.style.getPropertyValue("--bgColorNew"));
    });

    sleep(250).then(() => {document.documentElement.style.setProperty(
        "--bgOpacity", 0);
    });
})

asrButton.addEventListener("mouseenter", () => {

    document.querySelectorAll(".prayerButton").forEach(button => {
        button.style.opacity = .25;
    })

    asrButton.style.opacity = 1

    document.documentElement.style.setProperty(
        "--bgColorNew", 
        window.getComputedStyle(asrButton).backgroundImage
    );

    document.documentElement.style.setProperty("--bgOpacity", 1);

    sleep(250).then(() => {document.documentElement.style.setProperty(
        "--bgColorOld", 
        document.documentElement.style.getPropertyValue("--bgColorNew"));
    });

    sleep(250).then(() => {document.documentElement.style.setProperty(
        "--bgOpacity", 0);
    });
})

maghribButton.addEventListener("mouseenter", () => {

    document.querySelectorAll(".prayerButton").forEach(button => {
        button.style.opacity = .25;
    })

    maghribButton.style.opacity = 1

    document.documentElement.style.setProperty(
        "--bgColorNew", 
        window.getComputedStyle(maghribButton).backgroundImage
    );

    document.documentElement.style.setProperty("--bgOpacity", 1);

    sleep(250).then(() => {document.documentElement.style.setProperty(
        "--bgColorOld", 
        document.documentElement.style.getPropertyValue("--bgColorNew"));
    });

    sleep(250).then(() => {document.documentElement.style.setProperty(
        "--bgOpacity", 0);
    });
    
})

ishaButton.addEventListener("mouseenter", () => {

    document.querySelectorAll(".prayerButton").forEach(button => {
        button.style.opacity = .25;
    })

    ishaButton.style.opacity = 1

    document.documentElement.style.setProperty(
        "--bgColorNew", 
        window.getComputedStyle(ishaButton).backgroundImage
    );

    document.documentElement.style.setProperty("--bgOpacity", 1);

    sleep(250).then(() => {document.documentElement.style.setProperty(
        "--bgColorOld", 
        document.documentElement.style.getPropertyValue("--bgColorNew"));
    });

    sleep(250).then(() => {document.documentElement.style.setProperty(
        "--bgOpacity", 0);
    });

})

let defaultTimer;

const startDefaultBgTimer = () => {

    clearTimeout(defaultTimer);

    defaultTimer = setTimeout(() => {
        console.log("function to reset background to original reached")

        document.querySelectorAll(".prayerButton").forEach(button => {
            button.style.opacity = .25;
        })

        initialButton.style.opacity = 1

        document.documentElement.style.setProperty(
            "--bgColorNew", window.getComputedStyle(initialButton).backgroundImage
        );

        document.documentElement.style.setProperty("--bgOpacity", 1);

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
}

document.querySelectorAll('.prayerButton').forEach(button => { 
    
    button.addEventListener('mouseenter', () => { 
        stopDefaultBgTimer(); 
        mouseEnterFlag = true;
    });

    button.addEventListener('mouseleave', () => { 
        if (mouseEnterFlag)
        {
            startDefaultBgTimer();
            mouseEnterFlag = false;
        }
    });
    
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

    const now = new Date();
    const millisecondsToNextSecond = 1000 - now.getMilliseconds();
    const millisecondsToNextMinute = ((60 - now.getSeconds()) * 1000) + millisecondsToNextSecond;

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