import { app, BrowserWindow } from 'electron'
import path from 'path'

const WINDOW_WIDTH  = 900
const WINDOW_HEIGHT = 600
const ASPECT_RATIO  = WINDOW_WIDTH / WINDOW_HEIGHT

async function createWindow() {
  const win = new BrowserWindow({
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    useContentSize: true,
    resizable: true,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
    },
  })

  win.setAspectRatio(ASPECT_RATIO)

  const loadPromise = import.meta.env.DEV
    ? win.loadURL('http://localhost:5173')
    : win.loadFile(path.join(__dirname, '../renderer/index.html'))

  await loadPromise

  // compute the frame delta once and reuse it
  const [outerW, outerH]       = win.getSize()
  const [contentW, contentH]   = win.getContentSize()
  const frameDeltaW = outerW - contentW
  const frameDeltaH = outerH - contentH

  const minOuterWidth  = WINDOW_WIDTH  + frameDeltaW
  const minOuterHeight = WINDOW_HEIGHT + frameDeltaH

  // clamp *every* user resize
  win.on('will-resize', (e, newBounds) => {
    let { width, height } = newBounds

    // if they try to go smaller than our min outer, force it back up
    if (width  < minOuterWidth  || height < minOuterHeight) {
      e.preventDefault()
      win.setSize(
        Math.max(width,  minOuterWidth),
        Math.max(height, minOuterHeight)
      )
    }
  })
}

app.whenReady().then(createWindow)