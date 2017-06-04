const Command = require('../../structures/Command');
const { letterTrans } = require('custom-translate');
const dictionary = require('../../assets/json/covfefe');

module.exports = class CovfefifyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'covfefify',
            group: 'textedit',
            memberName: 'covfefify',
            description: 'Covfefify text.',
            args: [
                {
                    key: 'text',
                    prompt: 'What text would you like to covfefify?',
                    type: 'string',
                    validate: (text) => {
                        if (this.covfefify(text).length < 1999) return true;
                        return 'Your text is too long.';
                    }
                }
            ]
        });
    }

    run(msg, args) {
        const { text } = args;
        const converted = this.covfefify(text);
        return msg.say(`\u180E${converted}`);
    }

    covfefify(text) {
        text = text.toLowerCase();
        const words = text.split(' ');
        for (let i = 0; i < words.length; i++) {
            const firstVowel = words[i].match(/[aeiouy]/).index;
            const tempTest = words[i].substring(firstVowel, text.length);
            const afterConsonant = tempTest.match(/[qwrtpsdfghjklzxcvbnm]/);
            const cutIndex = afterConsonant.index + firstVowel + 1;
            const cut = words[i].substring(cutIndex, words[i].length).match(/[aeiouy]/i)[0];
            words[i] = words[i].substring(0, afterConsonant.index + firstVowel + 1);
            const last = words[i].match(/[qwrtpsdfghjklzxcvbnm]/g).pop();
            const swapped = letterTrans(last, dictionary);
            words[i] = words[i] + swapped + cut + swapped + cut;
        }
        return words.join(' ');
    }
};
