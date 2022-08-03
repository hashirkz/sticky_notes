/* class to handle functionality of the note taking area in sticky_note.html */
const fs = require('fs');
const path = require('path');

class notes {
    static num;
    _name;
    _note;
    _preview;

    constructor(note, preview = 3){
        [this._note, this._preview] = [note, preview];
    };

    static async set_num_notes(){
        try{
            let note_dir = await fs.promises.readdir(path.join(__dirname, '../', 'saved_notes'));
            notes.num = note_dir.length;
        }
        catch (err) {
            throw `unable to search dir for saved notes`;
        }
    }

    // check if note name exists in the saved_notes dir not needed anymore
    static async name_exists(name) {
        try {
            // grab array of files in the saved_notes dir
            const files = await fs.promises.readdir(path.join(__dirname, '../', 'saved_notes'));
            
            // search files for a file with relative path matching name
            for (const file of files) {
                if (file === name){
                    return true;
                }
            }
    
            return false;
        }
        catch (err) { console.log(err); }
    };

    async save() {
        try {
            // ignore empty ntoe files
            if (!this._note) { return; };

            // writing a completley new note so increase notes counter
            if (!notes.name_exists(this._name)) {
                await fs.promises.writeFile(path.join(__dirname, '../', 'saved_notes', `${this._name}`), this._note);
                notes.num++;
            }

            // write to existing note notes counter stays the same
            await fs.promises.writeFile(path.join(__dirname, '../', 'saved_notes', `${this._name}`), this._note);
        }

        catch (err) { console.log(err); }
    }

    async del() {
        try {
            // writing a completley new note so increase notes counter
            if (!notes.name_exists(this._name)) throw `file ${this._name} does not exist`;

            // write to existing note notes counter stays the same
            await fs.promises.unlink(path.join(__dirname, '../', 'saved_notes', `${this._name}`));
        }
        catch (err) { console.log(err); }
    }

    static async read_note(num) {
        try{
            return (await fs.promises.readFile(`note_${num}.txt`, {encoding: 'utf8'})).toString();
        }
        catch (err) { console.log(err); }

    }

    static async get_notes() {
        try{
            const notes_dir = await fs.promises.readdir(path.join(__dirname, '../', 'saved_notes'));
            let res = {};
    
            for (const note of notes_dir) {
                let note_path = path.join(__dirname, '../', 'saved_notes', note);
                let text = (await fs.promises.readFile(note_path, {encoding: 'utf8'})).toString();
                res[note] = text;

            };
    
            return res;
        } 
        catch (err) {
            console.log(err);
        }
    }
};

module.exports = { notes };