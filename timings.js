function setGradientByTime(){
    const date = new Date();
    const hour = date.getHours();
    let gradient;

    if (hour >= 5 && hour < 12) {
        // Morning gradient
        gradient = 'linear-gradient(to bottom right, #ffb347, #ffcc33)';
    } else if (hour >= 12 && hour < 17) {
        // Afternoon gradient
        gradient = 'linear-gradient(to bottom right, #2980b9, #6dd5fa)';
    } else if (hour >= 17 && hour < 20) {
        // Evening gradient
        gradient = 'linear-gradient(to bottom right, #fbc2eb, #a6c1ee)';
    } else {
        // Night gradient
        gradient = 'linear-gradient(to bottom right, #1e1e1e, #383838)';
    }
    
    document.body.style.background = gradient;
}

document.addEventListener('DOMContentLoaded', function() {
    setGradientByTime();

    setInterval(setGradientByTime, 60000);
});