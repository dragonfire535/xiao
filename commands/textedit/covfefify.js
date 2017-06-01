const Command = require('../../structures/Command');
const { translate } = require('custom-translate');
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
					validate: text => {
						if (text.length < 1999) return true;
						return 'Your text is too long.';
					}
				}
			]
        });
    }

    run(msg, args) {
        let { text } = args;
        const firstVowel = text.match(/[aeiouy]/i).index;
        let tempTest = text.substring(firstVowel, text.length);
        let afterConsonant = tempTest.match(/[qwrtpsdfghjklzxcvbnm]/i);
        const cut = text.substring(afterConsonant.index + firstVowel + 1, test.length).match(/[aeiouy]/i)[0];
        text = text.substring(0, afterConsonant.index + firstVowel + 1);
        const last = text.match(/[qwrtpsdfghjklzxcvbnm]/g).pop();
        const swapped = translate.letterTrans(last, dictionary);
        const res = text + (swapped + cut).repeat(2);
        return msg.say(`\u180E${text}`);
    }
};
