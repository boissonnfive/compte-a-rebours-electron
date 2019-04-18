// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
// Module de gestion des logs
const winston = require('winston');
// module de gestion des paramètres
const Store = require('electron-store');

/* 
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});
 
const logger = createLogger({
  format: combine(
    label({ label: 'right meow!' }),
    timestamp(),
    json(),
    myFormat
  ),
  transports: [new transports.Console({level: "debug"})]
});
*/

const myFormat = winston.format.printf(({ level, message, label, timestamp }) => {
  return `${level}: ${message}`; 
});
// const myFormatForFile = winston.format.printf(({ level, message, label, timestamp }) => {
//   return `${timestamp} [${label}] ${level}: ${message}`;
// });
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.colorize({ all: true }),
      winston.format.label({ label: 'Paramètres' }),
      winston.format.timestamp(),
      winston.format.align(),         // Aligne les messages après le ':'
      winston.format.splat(),         // Permet d'utiliser le formatage %o, %s, %d etc.
      // winston.format.simple(),     // Je ne sais pas ce que ça fait
      //winston.format.prettyPrint()  // Affiche chaque propriété sur une ligne
      myFormat
    ),
    transports: [new winston.transports.Console()],
  });

// winston.level = 'debug'; // Default logger writes at 'info' level => on veut afficher les infos de debug
// On affiche un format simple de log
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
// winston.add(new winston.transports.Console({
//     format: winston.format.splat() //winston.format.simple()
//   }));





const store = new Store();

// Création d'une date dans le fichier config.json pour créer le format
// store.set('date.jour', 17);
// store.set('date.mois', 08);
// store.set('date.annee', 2019);
// store.set('date.heures', 16);
// store.set('date.minutes', 00);

let monTitre = store.get('titre');
let maDate = store.get('date');
logger.log("debug", 'Date récupérée dans les paramètres : %o', maDate);

var dateEcheance;
if (typeof(maDate) !== "undefined") {
  dateEcheance = new Date(maDate.annee, maDate.mois-1, maDate.jour, maDate.heures, maDate.minutes, 0);
} else {
  dateEcheance = new Date();
  dateEcheance.setDate(dateEcheance.getDate() + 2); // Si pas de date configurée dans les paramètres, on ajoute 1 jour à la date du jour
  monTitre = "Temps restant avant échéance";
  store.set('titre', monTitre);
  store.set('date.jour', dateEcheance.getDate());
  store.set('date.mois', dateEcheance.getMonth());
  store.set('date.annee', dateEcheance.getFullYear());
  store.set('date.heures', dateEcheance.getHours());
  store.set('date.minutes', dateEcheance.getMinutes());
}
let dateEcheanceString = dateEcheance.toLocaleString('fr-FR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
})
logger.debug("Titre de l'échéance : %s", monTitre);
logger.debug("Date de l'échéance : %s", dateEcheanceString);
let countDownDate = dateEcheance.getTime();
logger.debug('Timestamp de la date : %d', countDownDate);


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
                        center: true,
                        width: 600,              // 600 pixels de largeur
                        height: 320,             // 230 pixels de hauteur
                        frame: false,            // Pas de bordures
                        resizable: false,        // Non modifiable
                        show: false})            // N'est pas visible au démarrage 

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
  // setInterval(function(){
  //       console.log("the time is now", new Date());
  //   }, 1000);

  // When UI has finish loading
  mainWindow.webContents.on('did-finish-load', () => {
    // MAJ de l'interface
    let code = `document.getElementsByClassName("titre")[0].innerHTML = "${monTitre}";
    document.getElementsByClassName("sous-titre1")[0].innerHTML = "(${dateEcheanceString})";`;
    mainWindow.webContents.executeJavaScript(code);
    // Send the timer value
    mainWindow.webContents.send('timer-change', countDownDate);
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  mainWindow.once('ready-to-show', () => {
    // let code = `alert("coucou, c'est moi!");`;
    // mainWindow.webContents.executeJavaScript(code);
    mainWindow.show()
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

