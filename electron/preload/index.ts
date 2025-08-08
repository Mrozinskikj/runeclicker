import { contextBridge, ipcRenderer } from 'electron'
contextBridge.exposeInMainWorld('api', {
  // your IPC methods
})