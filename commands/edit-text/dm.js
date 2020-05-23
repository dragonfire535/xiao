const Command = require('../../structures/Command');

module.exports = class DMCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'dm',
            group: 'edit-text',
            memberName: 'dm',
            description: 'Sends a message to the user you mention.',
            examples: ['dm @User Hi there!'],
            args: [
                {
                    key: 'user',
                    prompt: 'Which user do you want to send the DM to?',
                    type: 'user'
                },
                {
                    key: 'content',
                    prompt: 'What would you like to send',
                    type: 'string'
                }
            ]
        });    
    }

    run(msg, { user, content })  {
        if (msg.guild && msg.deletable) await msg.delete();
		user.send(content);
		this.client.logger.info(`${msg.author.tag} DMed ${user.tag} this message |${content}| using x;dm!`);
		//code for later |if (message.channel.type === 'dm') { console.log(msg.content);}|
    }
};
