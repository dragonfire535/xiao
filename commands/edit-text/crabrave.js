const Command = require('../../structures/Command');

module.exports = class CrabRaveCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'crabrave',
			aliases: ['crabrave', 'crab-rave'],
			group: 'edit-text',
			memberName: 'crab-rave',
			description: 'crab rave.',
			args: [
				{
					key: 'rave',
					prompt: 'What do you want to rave',
					type: 'string',
					min: 1
				}
			]
		});
	}

	run(msg, { rave }) {
		msg.delete();
<<<<<<< HEAD
		return msg.say(`:crab: ${rave} :crab:`);	
=======
		return msg.say(`:crab: ${rave} :crab:`);
>>>>>>> 1d0572bb7f29e4de364d42b4843e9202645f8afb
	}
};
