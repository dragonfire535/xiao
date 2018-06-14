const Command = require('../../structures/Command');
const choices = ['rock', 'paper', 'scissors', 'lizard', 'spock'];

module.exports = class RockPaperScissorsLizardSpockCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'rock-paper-scissors-lizard-spock',
			aliases: ['rpsls'],
			group: 'games',
			memberName: 'rock-paper-scissors-lizard-spock',
			description: 'Play Rock-Paper-Scissors-Lizard-Spock.',
			args: [
				{
					key: 'choice',
					prompt: 'Rock, Paper, Scissors, Lizard, or Spock?',
					type: 'string',
					parse: choice => choice.toLowerCase()
				}
			]
		});
	}

	run(msg, { choice }) {
		const response = choices[Math.floor(Math.random() * choices.length)];
		if (choice === 'rock') {
			if (response === 'rock') return msg.reply('I chose rock! Aw... A tie...');
			if (response === 'paper') return msg.reply('I chose paper! Yes! I win!');
			if (response === 'scissors') return msg.reply('I chose scissors! Aw... I lose...');
			if (response === 'lizard') return msg.reply('I chose lizard! Aw... I lose...');
			if (response === 'spock') return msg.reply('I chose Spock! Yes! I win!');
		}
		if (choice === 'paper') {
			if (response === 'rock') return msg.reply('I chose rock! Aw... I lose...');
			if (response === 'paper') return msg.reply('I chose paper! Aw... A tie...');
			if (response === 'scissors') return msg.reply('I chose scissors! Yes! I win!');
			if (response === 'lizard') return msg.reply('I chose lizard! Yes! I win!');
			if (response === 'spock') return msg.reply('I chose Spock! Aw... I lose...');
		}
		if (choice === 'scissors') {
			if (response === 'rock') return msg.reply('I chose rock! Yes! I win!');
			if (response === 'paper') return msg.reply('I chose paper! Aw... I lose...');
			if (response === 'scissors') return msg.reply('I chose scissors! Aw... A tie...');
			if (response === 'lizard') return msg.reply('I chose lizard! Aw... I lose...');
			if (response === 'spock') return msg.reply('I chose Spock! Yes! I win!');
		}
		if (choice === 'lizard') {
			if (response === 'rock') return msg.reply('I chose rock! Yes! I win!');
			if (response === 'paper') return msg.reply('I chose paper! Aw... I lose...');
			if (response === 'scissors') return msg.reply('I chose scissors! Yes! I win!');
			if (response === 'lizard') return msg.reply('I chose lizard! Aw... A tie...');
			if (response === 'spock') return msg.reply('I chose Spock! Aw... I lose...');
		}
		if (choice === 'spock') {
			if (response === 'rock') return msg.reply('I chose rock! Aw... I lose...');
			if (response === 'paper') return msg.reply('I chose paper! Yes! I win!');
			if (response === 'scissors') return msg.reply('I chose scissors! Aw... I lose...');
			if (response === 'lizard') return msg.reply('I chose Spock! Aw... I lose...');
			if (response === 'spock') return msg.reply('I chose Spock! Aw... A tie...');
		}
		
		return msg.reply('I win by default, you little cheater.');
	}
};
