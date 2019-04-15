const {ipcRenderer} = require('electron');

// Listen to the 'timer-change' event
ipcRenderer.on('timer-change', (event, t) => {
    afficheTemps(t);
    document.getElementById("countdown").classList.add("visible");

    // Execute every second
    let timer = setInterval(() => {
        afficheTemps(t);
        
        // If the count down is over, write some text 
        if (distance < 0) {
            clearInterval(timer);
            document.getElementById("countdown").classList.remove("visible");
            document.getElementsByClassName("fini")[0].classList.add("visible");
        }
    }, 1000); // 1 second
});

function afficheTemps(temps) {
    // Get todays date and time
    let now = new Date().getTime();
    
    // Find the distance between now an the count down date
    var distance = temps - now;
    
    // Time calculations for days, hours, minutes and seconds
    var days    = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours   = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    // Output the result in an element with id="demo"
    // document.getElementById("demo").innerHTML = days + "d " + hours + "h "
    // + minutes + "m " + seconds + "s ";
    
    // document.getElementById("nbJours").innerHTML = days;
    // document.getElementById("nbHeures").innerHTML = hours;
    // document.getElementById("nbMinutes").innerHTML = minutes;
    // document.getElementById("nbSecondes").innerHTML = seconds;
    nbJours.innerHTML    = days;
    nbHeures.innerHTML   = hours;
    nbMinutes.innerHTML  = minutes;
    nbSecondes.innerHTML = seconds;
}