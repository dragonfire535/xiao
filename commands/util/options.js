const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');

module.exports = class OptionsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'options',
			aliases: ['options-list'],
			group: 'util',
			memberName: 'options',
			description: 'Responds with a list of server options.',
			guarded: true
		});
	}

	run(msg) {
		return msg.say(stripIndents`
			__**Server Options**__
			Place the option in the appropriate channel's topic to use.

			\`<Time:disable-leave>\` Disables leave messages (System Channel).
			\`<Time:phone>\` Allows this channel to recieve phone calls.
			\`<Time:phone:no-voicemail>\` Prevents this channel from recieving voicemails for missed calls.
			\`<Time:phone-book:hide>\` Hides this channel from \`phone-book\`.
			\`<Time:portal>\` Marks the channel as a portal channel for \`portal-send\`.
		`);
	}
};
