{
    window.addEventListener('load', () => {
        const { ipcRenderer } = require('electron');

        ipcRenderer.on('load_saved_notes', (event, data) => {
            const sidebar = document.querySelector('.sidebar');
            let ul = document.createElement('ul');
            ul.className = 'saved-notes';

            max_length = 15;
            for(const key in data) {
                const text = data.key;
                let li = document.createElement('li');
                let p = document.createElement('p');
                li.className = 'saved-note';
                
                
                p.innerHTML = data[key].length > max_length ? data[key].slice(0, max_length) + '...' : data[key].slice(0, max_length);

                li.appendChild(p);
                ul.appendChild(li);

            }

            sidebar.appendChild(ul);

        });
    });
}