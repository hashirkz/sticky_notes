/* app/driver file to run the sticky notes app

*/

const electron = require('electron');
const path = require('path');

// main menu template/hotbar 
const main_menu_template = [
    {
        label: 'devtools',
        accelerator: 'Ctrl+I',
        click: (item, focused_window) => focused_window.toggleDevTools(),
    },
    {
        label: 'quit',
        accelerator: 'Alt+Q',
        click: () => electron.app.quit(),
    },
];

// function to create a sticky note window
let load_window = async (html_page) => {
    // create a new window object
    const window = new electron.BrowserWindow({
        show: false,
        frame: false,
        width: 600,
        height: 400,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });
    await window.loadURL(path.join(__dirname, html_page));
    window.show();

    return window;
};

// function to swap the current main window to another html page
let swap_window = async (window, html_page) => {
    if (!window){
        throw `no existing window to navigate to ${html_page}`;
    }

    await window.loadURL(path.join(__dirname, html_page));
    return window;
};

let load_app = async () => {
    const window = await load_window('sticky_note.html');

    const main_menu = electron.Menu.buildFromTemplate(main_menu_template);
    electron.Menu.setApplicationMenu(main_menu);


}

electron.app.on('ready', load_app);
