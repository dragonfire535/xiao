const Command = require('../../structures/Command');
const { wordTrans } = require('custom-translate');
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
                	},
                	parse: text => {
                    let test = text;
                    let firstVowel = test.match(/[aeiouy]/i).index;
                    let tempTest = test.substring(firstVowel, test.length);
                    let afterConsonant = tempTest.match(/[qwrtpsdfghjklzxcvbnm]/i);
                    let cut = test.substring(afterConsonant.index + firstVowel + 1, test.length).match(/[aeiouy]/i)[0];
                    test = test.substring(0, afterConsonant.index + firstVowel + 1);
                    let last = test.match(/[qwrtpsdfghjklzxcvbnm]/g).pop();
                    let swapped = wordTrans(last, dictionary);
                    let res = test + (swapped + cut).repeat(2);
                    return res;
                  }
				}
            ]
		});
	}

	run(msg, args) {
		const { text } = args;
		return msg.say(`\u180E${text}`);
	}
};
