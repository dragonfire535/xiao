const Command = require('../../structures/Command');
const request = require('node-superfetch');

module.exports = class rule34Command extends Command {
	constructor(client) {
		super(client, {
			name: 'rule34',
			group: 'search',
			memberName: 'rule34',
			description: 'Responds with an image from rule34.xx, with optional query.',
			credit: [
				{
					name: 'rule34',
					url: 'https://rule34.org/',
					reason: 'API'
				}
			],
			args: [
				{
					key: 'query',
					prompt: 'What image would you like to search for?',
					type: 'string',
					default: ''
				}
			]
		});
	}

	async run(msg, { query }) {
		try {
			const { text } = await request
				.get('https://rule34.xxx')
				.query({
					page: 'dapi',
					s: 'post',
					q: 'index',
					json: 1,
					tags: query,
					limit: 200
				});
			if (!text) return msg.say('Could not find any results.');
			const body = JSON.parse(text);
			const data = body[Math.floor(Math.random() * body.length)];
			return msg.say(`https://us.rule34.xxx/images/${data.directory}/${data.image}`);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
