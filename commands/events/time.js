const Command = require('../../structures/Command');
const moment = require('moment-timezone');
const { default: didYouMean, ReturnTypeEnums } = require('didyoumean2');
const { stripIndents } = require('common-tags');
const { firstUpperCase } = require('../../util/Util');

module.exports = class TimeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'time',
			aliases: ['time-zone'],
			group: 'events',
			memberName: 'time',
			description: 'Responds with the current time in a particular location.',
			details: '**Zones:** <https://en.wikipedia.org/wiki/List_of_tz_database_time_zones>',
			credit: [
				{
					name: 'Wikipedia',
					url: 'https://www.wikipedia.org/',
					reason: 'Time Zone Data',
					reasonURL: 'https://en.wikipedia.org/wiki/List_of_tz_database_time_zones'
				},
				{
					name: 'Neopets',
					url: 'http://www.neopets.com/',
					reason: 'Neopia Time Zone'
				}
			],
			args: [
				{
					key: 'timeZone',
					label: 'time zone',
					prompt: 'Which time zone do you want to get the time of?',
					type: 'string',
					parse: timeZone => timeZone.replaceAll(' ', '_').toLowerCase()
				}
			]
		});
	}

	run(msg, { timeZone }) {
		if (!moment.tz.zone(timeZone)) {
			const results = didYouMean(timeZone, moment.tz.names(), { returnType: ReturnTypeEnums.ALL_SORTED_MATCHES });
			return msg.reply(stripIndents`
				Invalid time zone. Refer to <https://en.wikipedia.org/wiki/List_of_tz_database_time_zones>.

				${results.length ? `Did You Mean: ${results.slice(0, 5).map(c => `\`${c}\``).join(', ')}` : ''}
			`);
		}
		const time = moment().tz(timeZone).format('h:mm A');
		const location = timeZone.split('/');
		const main = firstUpperCase(location[0], /[_ ]/);
		const sub = location[1] ? firstUpperCase(location[1], /[_ ]/) : null;
		const subMain = location[2] ? firstUpperCase(location[2], /[_ ]/) : null;
		const parens = sub ? ` (${subMain ? `${sub}, ` : ''}${main})` : '';
		return msg.say(`The current time in ${subMain || sub || main}${parens} is ${time}.`);
	}
};
