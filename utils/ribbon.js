{
    window.addEventListener('load', () => {

        /* script to handle custom ribbon event listeners */
        const { ipcRenderer } = require('electron');
        let [home, bookmarks, min, max, close] = document.querySelectorAll('.ribbon-item');

        home.onmouseover = () => {
            const sidebar = document.querySelector('.sidebar');
            let shift = getComputedStyle(sidebar).getPropertyValue('--shift');

            sidebar.style.setProperty('--shift', shift == '0vw' ? '30vw' : '0vw')
        };

        min.onclick = () => {
            ipcRenderer.send('minimize', 0);
        };

        max.onclick = () => {
            ipcRenderer.send('maximize', 0);
        };

        close.onclick = () => {
            ipcRenderer.send('close_window', 0);
        };
    });
}
