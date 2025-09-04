const { app, BrowserWindow, globalShortcut } = require('electron');

const URL_TO_LOAD = process.argv[2] || 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/PNG_transparency_demonstration_1.png/800px-PNG_transparency_demonstration_1.png'
let win 
let isIgnoring = true;
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  function createWindow() {
    win = new BrowserWindow({
      width: 1920,
      height: 1080,
      transparent: true,
      frame:false,
      alwaysOnTop: true,
    });
  
    win.loadURL(URL_TO_LOAD);
    //win.loadURL(`file://${__dirname}/index.html`)
    //win.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(`        <html style="background: transparent;">          <body style="margin:0;background:transparent;">            <h1 style="color:white;">Transparent Test</h1>          </body>        </html>      `));
    win.setIgnoreMouseEvents(true);
  }



  app.disableHardwareAcceleration();

  app.whenReady().then(()=>{
    createWindow();
    globalShortcut.register('CommandOrControl+Shift+T', () => {
      if (!win) {
        console.error('Window not available');
        return;
      }
  
      isIgnoring = !isIgnoring;
      win.setIgnoreMouseEvents(isIgnoring, { forward: true }); 
      console.log(`Ignore mouse events: ${isIgnoring}`);
    });
    });

  