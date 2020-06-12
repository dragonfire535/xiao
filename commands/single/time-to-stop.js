const Command = require('../../structures/Command');

module.exports = class TimetoStopCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'time-to-stop',
			aliases: ['stop'],
			group: 'single',
			memberName: 'time-to-stop',
			description: 'Sends a link to the "Just Do It!" motivational speech.',
			credit: [
				{
					name: 'MotivaShian',
					url: 'https://www.youtube.com/channel/UC0yDCpC_UaXEdL6Zc4715rg',
					reason: 'Original Motivational Speech',
					reasonURL: 'https://www.youtube.com/watch?v=ZXsQAXx_ao0'
				}
			]
		});
	}

	run(msg) {
		return msg.say('https://www.youtube.com/watch?v=2k0SmqbBIpQ');
	}
};
