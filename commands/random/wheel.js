const Command = require('../../structures/Command');

module.exports = class HoroscopeCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'wof',
            aliases: [ 'wheel', 'wheeloffortune' ],
            group: 'random',
            memberName: 'wof',
            description: 'Generates a wheel of fortune board.',
            args: [
                {
                    key: 'clue',
                    prompt: 'What should the clue of the board be?',
                    type: 'string',
                    validate: (clue) => {
                        if (clue.length < 25) return true;
                        else return 'Your clue is too long!';
                    }
                },
                {
                    key: 'text',
                    prompt: 'What should the text of the board be?',
                    type: 'string',
                    validate: (text) => {
                        if (text.length < 52) return true;
                        else return 'Your text is too long!';
                    }
                }
            ]
        });
    }

    async run(msg, args) {
        const { clue, text } = args;
        const url = wheel(clue, text);
        return msg.say(files: [{ attachment: url, name: "wof.png" }]);
    }
    
    wheel(clue, text){
        const { clue, text } = args;
        let url = "http://atom.smasher.org/wof/word-puzzle.jpg.php?";
        const len = text.length;
        let lines = ["", "", "", ""]
        //52 chars max
        const words = text.split(" ")
        let currentLine = 0;
        for (let i = 0; i < words.length; i++) {
            if ((currentLine == 0 || currentLine == 3) && lines[currentLine].length + words[i].length < 12) {
                lines[currentLine] += (lines[currentLine].length == 0 ? "" : " ") + words[i];
            } else if ((currentLine == 1 || currentLine == 2) && lines[currentLine].length + words[i].length < 14) {
                lines[currentLine] += (lines[currentLine].length == 0 ? "" : " ") + words[i];
            } else {
                currentLine += 1;
                lines[currentLine] += (lines[currentLine].length == 0 ? "" : " ") + words[i];
            }
        }

        for (let i = 0; i < 4; i++) {
            lines[i] = lines[i].replace(/\s/g, "%20");
            if (i == 0)
                url += `l1=${lines[i]}`
            else
                url += `&l${i + 1}=${lines[i]}`
        }
        url += `&c=${clue}`
        return url;
    }
};
