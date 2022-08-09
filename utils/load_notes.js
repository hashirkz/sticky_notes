{
    window.addEventListener('load', () => {
        const { ipcRenderer } = require('electron');

        ipcRenderer.on('load_saved_notes', (event, data) => {
            const sidebar = document.querySelector('.sidebar');

            // removing existing sidebar elements
            sidebar.textContent = '';

            let ul = document.createElement('ul');
            ul.className = 'saved-notes';

            max_length = 18;
            for(const key in data) {
                const text = data.key;
                let li = document.createElement('li');
                let p = document.createElement('p');
                li.setAttribute('data-index', key.match(/\d/));
                li.className = 'saved-note';
                
                
                p.innerHTML = data[key].length > max_length ? data[key].slice(0, max_length - 3) + '...' : data[key].slice(0, max_length);
                p.setAttribute('data-text', data[key]);

                li.appendChild(p);
                ul.appendChild(li);

                li.addEventListener('click', () => {
                    ipcRenderer.send('load_note_data', li.getAttribute('data-index'));
                });
            }

            sidebar.appendChild(ul);
        });

        ipcRenderer.on('note_data', (event, data) => {
            const note_stuff = document.getElementById('note-stuff');
            note_stuff.textContent = data;
        });

    });
}