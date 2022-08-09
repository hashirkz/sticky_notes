/* app/driver file to run the sticky notes app

*/

const electron = require('electron');
const path = require('path');
const { notes } = require('./utils/notes');

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
    {
        label:'save',
        accelerator:'Ctrl+S',
        click: () => notes.save_note(),
    }
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

    // create the note window and set the navbar / shortcuts
    const window = await load_window('sticky_note.html');
    const main_menu = electron.Menu.buildFromTemplate(main_menu_template);
    electron.Menu.setApplicationMenu(main_menu);

    // counting number of notes beforehand
    await notes.set_num_notes();

    // load saved notes to the sticky note window on launch
    let note_data = await notes.get_notes();
    window.webContents.send('load_saved_notes', note_data);
    

    // note functionality event handlers !need to fix 
    electron.ipcMain.on('save_note', async (event, data) => {
        try {
            let note = new notes(data);

            note._name = `note_${notes.num}.txt`;
            await note.save();

            note_data = await notes.get_notes();
            window.webContents.send('load_saved_notes', note_data);
        }
        catch (err) {
            throw `unable to save note ${err}`;
        }
    });

    electron.ipcMain.on('load_note_data', async (event, data) => {
        let text = await notes.read_note(data);
        window.webContents.send('note_data', text);
    });


    // ribbon event handlers 
    electron.ipcMain.on('minimize', (event, data) => window.minimize());

    electron.ipcMain.on('maximize', (event, data) => window.isMaximized() ? window.unmaximize() : window.maximize());
    
    electron.ipcMain.on('close_window', (event, data) => {
        window.close();
        electron.app.quit();
    });

};

electron.app.on('ready', load_app);
