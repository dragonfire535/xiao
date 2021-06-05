const Command = require('../../framework/Command');
const request = require('node-superfetch');
const moment = require('moment');

module.exports = class GoogleDoodleCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'google-doodle',
			group: 'events',
			memberName: 'google-doodle',
			description: 'Responds with a Google Doodle, either the latest one or a random one from the past.',
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Google',
					url: 'https://www.google.com/',
					reason: 'Google Doodles API',
					reasonURL: 'https://www.google.com/doodles'
				}
			],
			args: [
				{
					key: 'month',
					prompt: 'What month would you like to get doodles for?',
					type: 'month',
					default: 'latest'
				},
				{
					key: 'year',
					prompt: 'What year would you like to get doodles for?',
					type: 'integer',
					default: ''
				}
			]
		});
	}

	async run(msg, { month, year }) {
		const latest = month === 'latest';
		const now = new Date();
		if (latest) month = now.getMonth() + 1;
		if (!year) year = now.getFullYear();
		try {
			const { body } = await request.get(`https://www.google.com/doodles/json/${year}/${month}`);
			if (!body.length) return msg.say('Could not find any results.');
			const data = body[latest ? 0 : Math.floor(Math.random() * body.length)];
			const runDate = moment.utc(data.run_date_array.join('-')).format('MMMM Do, YYYY');
			return msg.say(`${runDate}: ${data.share_text}`, { files: [`https:${data.url}`] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
