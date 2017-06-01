const Command = require('../../structures/Command');

module.exports = class CovfefifyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'covfefify',
            group: 'random',
            memberName: 'covfefify',
            description: 'Covfefifies text. https://codegolf.stackexchange.com/questions/123685/covfefify-a-string',
            args: [
                {
                    key: 'text',
                    prompt: 'Enter text to covfefify.',
                    type: 'string'
                }
            ]
        });
    }

    run(msg, args) {
        let { text } = args;
        
        let covfefify = s=>([,a,b,c]=s.match`(.*?[aeiouy]+(.)).*?([aeiouy])`,a+(b=(a="bcdfgszkvtgp")[11-a.search(b)]||b)+c+b+c);
        
        return msg.say(covfefify(text));
    }
};
