{
    window.addEventListener('load', () => {
        const { ipcRenderer } = require('electron');

        // grab html note-stuff text and note-name text
        let note = document.getElementById('note-stuff');
        
        note.addEventListener('keydown', () => {
            ipcRenderer.send('save_note', note.value);
        })
        
    });
}
