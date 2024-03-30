const Command = require('../../framework/Command');
const request = require('node-superfetch');
const { hash } = require('../../util/Util');

module.exports = class GravatarCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'gravatar',
			group: 'search',
			memberName: 'gravatar',
			description: 'Responds with the Gravatar for an email.',
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Gravatar',
					url: 'https://en.gravatar.com/',
					reason: 'API',
					reasonURL: 'https://en.gravatar.com/site/implement/'
				}
			],
			args: [
				{
					key: 'email',
					type: 'string',
					parse: email => email.toLowerCase()
				}
			]
		});
	}

	async run(msg, { email }) {
		const emailHash = hash(email, 'md5');
		try {
			const { body } = await request
				.get(`https://www.gravatar.com/avatar/${emailHash}`)
				.query({
					size: 500,
					default: 404,
					rating: msg.channel.nsfw ? 'r' : 'pg'
				});
			return msg.say({ files: [{ attachment: body, name: `${emailHash}.jpg` }] });
		} catch (err) {
			if (err.status === 404) return msg.say('Could not find any results.');
			throw err;
		}
	}
};
