// Main Electron file
process.env.DIST_ELECTRON = join(__dirname, '../..')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.PUBLIC = app.isPackaged ? process.env.DIST : join(process.env.DIST_ELECTRON, '../public')

import { app, BrowserWindow, globalShortcut } from 'electron'
import windowStateKeeper from 'electron-window-state'
import { join } from 'path'

app.disableHardwareAcceleration()
if (!app.requestSingleInstanceLock()) {
    app.quit()
    process.exit(0)
}

let mainWindowState: windowStateKeeper.State, mainWindow: BrowserWindow
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, 'index.html')

const createWindow = async () => {
    mainWindowState = windowStateKeeper({
        defaultWidth: 1000,
        defaultHeight: 800
    })

    mainWindow = new BrowserWindow({
        title: 'Template',
        // icon: join(process.env.PUBLIC, 'favicon.svg'),
        x: mainWindowState.x,
        y: mainWindowState.y,
        width: mainWindowState.width,
        height: mainWindowState.height,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    })

    mainWindow.setMenu(null)

    if (process.env.VITE_DEV_SERVER_URL) mainWindow.loadURL(url)
    else mainWindow.loadFile(indexHtml)

    mainWindow.on('ready-to-show', () => {
        mainWindowState.manage(mainWindow)
        mainWindow.show()
        mainWindow.focus()
    })

    mainWindow.on('closed', () => mainWindow = null)
    mainWindow.on('session-end', () => mainWindow = null)

    // @ts-ignore
    globalShortcut.register('Ctrl+Shift+I', () => mainWindow.openDevTools())
}

app.whenReady().then(createWindow)
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit() })