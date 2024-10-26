const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');

module.exports = class FrogCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'frog',
			aliases: ['ribbit'],
			group: 'random-img',
			description: 'Responds with a random frog image.',
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: 'FROGLAND!',
					url: 'http://allaboutfrogs.org/froglnd.shtml',
					reason: 'API',
					reasonURL: 'http://allaboutfrogs.org/funstuff/randomfrog.html'
				}
			]
		});
	}

	run(msg) {
		const chosen = Math.floor(Math.random() * 54) + 1;
		const str = chosen.toString().padStart(4, '0');
		return msg.say({ files: [`http://www.allaboutfrogs.org/funstuff/random/${str}.jpg`] });
	}
};
