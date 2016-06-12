'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
var mainWindow = null;

app.on('window-all-closed', function () {
	if(process.platform != 'darwin') {
		app.quit();
	}
})

app.on('ready', function () {
	mainWindow = new BrowserWindow({width: 200, height: 300});
	mainWindow.loadURL('file://' + __dirname + '/app/index.html');

	mainWindow.on('closed', function() {
		mainWindow = null;
	});
});