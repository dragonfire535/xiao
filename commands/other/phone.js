const Command = require('../../structures/Command');
const PhoneCall = require('../../structures/phone/PhoneCall');

module.exports = class PhoneCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'phone',
			aliases: ['phone-call', 'call'],
			group: 'other',
			memberName: 'phone',
			description: 'Starts a phone call with a random server.',
			guildOnly: true,
			throttling: {
				usages: 1,
				duration: 60
			},
			args: [
				{
					key: 'channelID',
					prompt: 'What channel would you like to start a call with?',
					type: 'string',
					default: '',
					validate: channelID => {
						if (channelID.toLowerCase() === 'count') return true;
						return /^[0-9]+$/.test(channelID);
					},
					parse: channelID => channelID.toLowerCase()
				}
			],
			credit: [
				{
					name: 'Tatsumaki',
					url: 'https://tatsumaki.xyz/',
					reason: 'Concept'
				}
			]
		});
	}

	async run(msg, { channelID }) {
		if (channelID !== 'count' && (!msg.channel.topic || !msg.channel.topic.includes('<xiao:phone>'))) {
			return msg.say('You can only start a call in a channel with `<xiao:phone>` in the topic.');
		}
		const inCall = this.client.phone.some(call => [call.origin.id, call.recipient.id].includes(msg.channel.id));
		if (channelID !== 'count' && inCall) {
			return msg.say('This channel is already in a phone call.');
		}
		const channels = this.client.channels.cache.filter(channel => channel.guild
			&& channel.topic
			&& channel.topic.includes('<xiao:phone>')
			&& !msg.guild.channels.cache.has(channel.id));
		if (!channels.size) return msg.reply('No channels currently allow phone calls...');
		let channel;
		if (channelID) {
			if (channelID === 'count') return msg.say(`☎️ **${channels.size}** currently open lines.`);
			channel = this.client.channels.cache.get(channelID);
			if (!channel || !channel.guild) return msg.reply('This channel does not exist.');
			if (!channel.topic || !channel.topic.includes('<xiao:phone>')) {
				return msg.reply('This channel does not allow phone calls.');
			}
		} else {
			channel = channels.random();
		}
		try {
			const id = `${msg.channel.id}:${channel.id}`;
			this.client.phone.set(id, new PhoneCall(this.client, msg.channel, channel));
			await this.client.phone.get(id).start();
			return null;
		} catch {
			return msg.reply('Failed to start the call. Try again later!');
		}
	}
};
