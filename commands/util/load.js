const Command = require('../../framework/Command');
const path = require('path');

module.exports = class LoadCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'load',
			aliases: ['load-command', 'load-cmd'],
			group: 'util',
			memberName: 'load',
			description: 'Loads a new command.',
			details: 'Only the bot owner(s) may use this command.',
			ownerOnly: true,
			args: [
				{
					key: 'group',
					prompt: 'Which group is the new command in?',
					type: 'group'
				},
				{
					key: 'name',
					prompt: 'What is the new command\'s name?',
					type: 'string',
					parse: name => name.toLowerCase()
				}
			]
		});
	}

	run(msg, { group, name }) {
		let Cmd;
		try {
			Cmd = require(path.join(__dirname, '..', group.id, `${name}.js`));
		} catch {
			return msg.say('Sorry, I couldn\'t find a command with that name.');
		}
		const newCommand = new Cmd(this.client);
		this.client.registry.registerCommand(newCommand);
		this.client.registry.commands.get('cloc').cache = null;
		return msg.say(`Loaded the \`${newCommand.name}\` command.`);
	}
};
