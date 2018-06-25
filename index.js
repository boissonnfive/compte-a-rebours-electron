const {ipcRenderer} = require('electron');

// Listen to the 'timer-change' event
ipcRenderer.on('timer-change', (event, t) => {
    // Initialize time with value send with event
    let currentTime = t;
    console.log("Coucou les amis !");
// Print out the time
    // timerDiv.innerHTML = secondsToTime(currentTime);

// Execute every second
    let timer = setInterval(() => {

        // Remove one second
        // currentTime = currentTime - 1;
        // Print out the time
        // timerDiv.innerHTML = secondsToTime(currentTime);
        // When reaching 0. Stop.
        // if (currentTime <= 0) {
        //     clearInterval(timer);
        // }

        // Get todays date and time
        let now = new Date().getTime();
        
        // Find the distance between now an the count down date
        var distance = currentTime - now;
        
        // Time calculations for days, hours, minutes and seconds
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Output the result in an element with id="demo"
        // document.getElementById("demo").innerHTML = days + "d " + hours + "h "
        // + minutes + "m " + seconds + "s ";
        
        // document.getElementById("nbJours").innerHTML = days;
        // document.getElementById("nbHeures").innerHTML = hours;
        // document.getElementById("nbMinutes").innerHTML = minutes;
        // document.getElementById("nbSecondes").innerHTML = seconds;
        nbJours.innerHTML = days;
        nbHeures.innerHTML = hours;
        nbMinutes.innerHTML = minutes;
        nbSecondes.innerHTML = seconds;

        // If the count down is over, write some text 
        if (distance < 0) {
            clearInterval(timer);
            // document.getElementById("demo").innerHTML = "EXPIRED";
        }
    }, 1000); // 1 second
});