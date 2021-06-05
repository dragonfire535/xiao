const Command = require('../../framework/Command');
const jsChess = require('js-chess-engine');
const { createCanvas, loadImage } = require('canvas');
const moment = require('moment');
const validateFEN = require('fen-validator').default;
const { stripIndents } = require('common-tags');
const path = require('path');
const { verify, reactIfAble } = require('../../util/Util');
const { centerImagePart } = require('../../util/Canvas');
const { FAILURE_EMOJI_ID } = process.env;
const turnRegex = /^(?:((?:[A-H][1-8])|(?:[PKRQBN]))?([A-H]|X)?([A-H][1-8])(?:=([QRNB]))?)|(?:0-0(?:-0)?)$/;
const pieces = ['pawn', 'rook', 'knight', 'king', 'queen', 'bishop'];
const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

module.exports = class ChessCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'chess',
			group: 'games-mp',
			memberName: 'chess',
			description: 'Play a game of Chess with another user or the AI.',
			credit: [
				{
					name: 'PNGkey.com',
					url: 'https://www.pngkey.com/',
					reason: 'Piece Images',
					reasonURL: 'https://www.pngkey.com/maxpic/u2w7q8o0r5y3t4w7/'
				},
				{
					name: 'Chess.com',
					url: 'https://www.chess.com/',
					reason: 'Board Image'
				}
			],
			args: [
				{
					key: 'opponent',
					prompt: 'What user would you like to challenge? To play against AI, choose me.',
					type: 'user'
				},
				{
					key: 'time',
					prompt: 'How long should the chess timers be set for (in minutes)? Use 0 for infinite.',
					type: 'integer',
					max: 120,
					min: 0
				},
				{
					key: 'fen',
					prompt: 'What FEN would you like to use for the start board?',
					type: 'string',
					default: '',
					validate: fen => validateFEN(fen)
				}
			]
		});

		this.images = null;
	}

	async run(msg, { opponent, time, fen }) {
		if (opponent.id === msg.author.id) return msg.reply('You may not play against yourself.');
		if (this.client.blacklist.user.includes(opponent.id)) return msg.reply('This user is blacklisted.');
		const current = this.client.games.get(msg.channel.id);
		if (current) return msg.reply(`Please wait until the current game of \`${current.name}\` is finished.`);
		this.client.games.set(msg.channel.id, { name: this.name });
		if (!this.images) await this.loadImages();
		try {
			if (!opponent.bot) {
				await msg.say(`${opponent}, do you accept this challenge?`);
				const verification = await verify(msg.channel, opponent);
				if (!verification) {
					this.client.games.delete(msg.channel.id);
					return msg.say('Looks like they declined...');
				}
			}
			const resumeGame = await this.client.redis.get(`chess-${msg.author.id}`);
			let game;
			let whiteTime = time === 0 ? Infinity : time * 60000;
			let blackTime = time === 0 ? Infinity : time * 60000;
			let whitePlayer = msg.author;
			let blackPlayer = opponent;
			if (resumeGame) {
				await msg.reply(stripIndents`
					You have a saved game, do you want to resume it?
					**This will delete your saved game.**
				`);
				const verification = await verify(msg.channel, msg.author);
				if (verification) {
					try {
						const data = JSON.parse(resumeGame);
						game = new jsChess.Game(data.fen);
						whiteTime = data.whiteTime === -1 ? Infinity : data.whiteTime;
						blackTime = data.blackTime === -1 ? Infinity : data.blackTime;
						whitePlayer = data.color === 'white' ? msg.author : opponent;
						blackPlayer = data.color === 'black' ? msg.author : opponent;
						await this.client.redis.del(`chess-${msg.author.id}`);
					} catch {
						this.client.games.delete(msg.channel.id);
						await this.client.redis.del(`chess-${msg.author.id}`);
						return msg.reply('An error occurred reading your saved game. Please try again.');
					}
				} else {
					game = new jsChess.Game(fen || undefined);
				}
			} else {
				game = new jsChess.Game(fen || undefined);
			}
			let prevPieces = null;
			let saved = false;
			while (!game.exportJson().isFinished && game.exportJson().halfMove <= 50) {
				const gameState = game.exportJson();
				const user = gameState.turn === 'black' ? blackPlayer : whitePlayer;
				const userTime = gameState.turn === 'black' ? blackTime : whiteTime;
				if (user.bot) {
					prevPieces = Object.assign({}, game.exportJson().pieces);
					const now = new Date();
					game.aiMove(1);
					const timeTaken = new Date() - now;
					if (gameState.turn === 'black') blackTime -= timeTaken - 5000;
					if (gameState.turn === 'white') whiteTime -= timeTaken - 5000;
				} else {
					const displayTime = userTime === Infinity ? 'Infinite' : moment.duration(userTime).format();
					await msg.say(stripIndents`
						${user}, what move do you want to make (ex. A1A2 or NC3)? Type \`end\` to forfeit.
						You can save your game by typing \`save\`. Can't think of a move? Use \`play for me\`.

						_You are ${gameState.check ? '**in check!**' : 'not in check.'}_
						**Time Remaining: ${displayTime}** (Max 10min per turn)
						**FEN:** \`${game.exportFEN()}\`
					`, { files: [{ attachment: this.displayBoard(gameState, prevPieces), name: 'chess.png' }] });
					prevPieces = Object.assign({}, game.exportJson().pieces);
					const moves = game.moves();
					const pickFilter = res => {
						if (![msg.author.id, opponent.id].includes(res.author.id)) return false;
						const choice = res.content.toUpperCase();
						if (choice === 'END') return true;
						if (choice === 'SAVE') return true;
						if (choice === 'PLAY FOR ME') return true;
						if (res.author.id !== user.id) return false;
						const move = choice.match(turnRegex);
						if (!move) return false;
						const parsed = this.parseSAN(gameState, moves, move);
						if (!parsed || !moves[parsed[0]] || !moves[parsed[0]].includes(parsed[1])) {
							reactIfAble(res, res.author, FAILURE_EMOJI_ID, '❌');
							return false;
						}
						return true;
					};
					const now = new Date();
					const turn = await msg.channel.awaitMessages(pickFilter, {
						max: 1,
						time: Math.min(userTime, 600000)
					});
					if (!turn.size) {
						const timeTaken = new Date() - now;
						this.client.games.delete(msg.channel.id);
						if (userTime - timeTaken <= 0) {
							return msg.say(`${user.id === msg.author.id ? opponent : msg.author} wins from timeout!`);
						} else {
							return msg.say(`${user}, the game has been ended. You cannot take more than 10 minutes.`);
						}
					}
					if (turn.first().content.toLowerCase() === 'end') break;
					if (turn.first().content.toLowerCase() === 'save') {
						const { author } = turn.first();
						const alreadySaved = await this.client.redis.get(`chess-${author.id}`);
						if (alreadySaved) {
							await msg.say('You already have a saved game, do you want to overwrite it?');
							const verification = await verify(msg.channel, author);
							if (!verification) continue; // eslint-disable-line max-depth
						}
						if (gameState.turn === 'black') blackTime -= new Date() - now;
						if (gameState.turn === 'white') whiteTime -= new Date() - now;
						await this.client.redis.set(
							`chess-${author.id}`,
							this.exportGame(
								game,
								blackTime,
								whiteTime,
								whitePlayer.id === author.id ? 'white' : 'black'
							)
						);
						saved = true;
						break;
					}
					if (turn.first().content.toLowerCase() === 'play for me') {
						game.aiMove(0);
					} else {
						const choice = this.parseSAN(gameState, moves, turn.first().content.toUpperCase().match(turnRegex));
						const pawnMoved = gameState.pieces[choice[0]].toUpperCase() === 'P';
						game.move(choice[0], choice[1]);
						if (pawnMoved && choice[1].endsWith(gameState.turn === 'white' ? '8' : '1')) {
							game.setPiece(choice[1], gameState.turn === 'white' ? choice[2] : choice[2].toLowerCase());
						}
					}
					const timeTaken = new Date() - now;
					if (gameState.turn === 'black') blackTime -= timeTaken - 5000;
					if (gameState.turn === 'white') whiteTime -= timeTaken - 5000;
				}
			}
			this.client.games.delete(msg.channel.id);
			if (saved) {
				return msg.say(stripIndents`
					Game saved! Use ${this.usage(opponent.tag)} to resume it.
					You do not have to use the same opponent to resume the game.
					If you want to delete your saved game, use ${this.client.registry.commands.get('chess-delete').usage()}.
				`);
			}
			const gameState = game.exportJson();
			if (gameState.halfMove > 50) return msg.say('Due to the fifty move rule, this game is a draw.');
			if (!gameState.isFinished) return msg.say('Game ended due to forfeit.');
			if (!gameState.checkMate && gameState.isFinished) {
				return msg.say('Stalemate! This game is a draw.', {
					files: [{ attachment: this.displayBoard(gameState, prevPieces), name: 'chess.png' }]
				});
			}
			const winner = gameState.turn === 'black' ? whitePlayer : blackPlayer;
			return msg.say(`Checkmate! Congrats, ${winner}!`, {
				files: [{ attachment: this.displayBoard(gameState, prevPieces), name: 'chess.png' }]
			});
		} catch (err) {
			this.client.games.delete(msg.channel.id);
			throw err;
		}
	}

	parseSAN(gameState, moves, move) {
		if (!move) return null;
		if (move[0] === '0-0') {
			if (gameState.turn === 'white') {
				if (gameState.castling.whiteShort) return ['E1', 'G1'];
				return null;
			} else if (gameState.turn === 'black') {
				if (gameState.castling.blackShort) return ['E8', 'G8'];
				return null;
			}
		}
		if (move[0] === '0-0-0') {
			if (gameState.turn === 'white') {
				if (gameState.castling.whiteLong) return ['E1', 'C1'];
				return null;
			} else if (gameState.turn === 'black') {
				if (gameState.castling.blackLong) return ['E8', 'C8'];
				return null;
			}
		}
		if (!move[3]) return null;
		const initial = move[1] || 'P';
		if (gameState.pieces[initial]) return [initial, move[3], move[4] || 'Q'];
		const possiblePieces = Object.keys(gameState.pieces).filter(piece => {
			if (this.pickImage(gameState.pieces[piece]).color !== gameState.turn) return false;
			if (gameState.pieces[piece].toUpperCase() !== initial) return false;
			if (move[2] && move[2] !== 'X' && !piece.startsWith(move[2])) return false;
			if (move[4]) {
				if (!piece.endsWith(gameState.turn === 'black' ? '2' : '7')) return false;
				if (gameState.pieces[piece].toUpperCase() !== 'P') return false;
			}
			if (!moves[piece]) return false;
			return moves[piece].includes(move[3]);
		});
		if (possiblePieces.length === 1) return [possiblePieces[0], move[3], move[4] || 'Q'];
		return null;
	}

	displayBoard(gameState, prevPieces) {
		const canvas = createCanvas(this.images.board.width, this.images.board.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(this.images.board, 0, 0);
		let w = 2;
		let h = 3;
		let row = 8;
		let col = 0;
		for (let i = 0; i < 64; i++) {
			const piece = gameState.pieces[`${cols[col]}${row}`];
			const prevGamePiece = prevPieces ? prevPieces[`${cols[col]}${row}`] : null;
			if (piece) {
				const parsed = this.pickImage(piece);
				const img = this.images[parsed.color][parsed.name];
				const { x, y, width, height } = centerImagePart(img, 62, 62, w, h);
				if ((gameState.check || gameState.checkMate) && piece === (gameState.turn === 'white' ? 'K' : 'k')) {
					ctx.fillStyle = 'red';
					ctx.globalAlpha = 0.5;
					ctx.fillRect(w, h, 62, 62);
					ctx.globalAlpha = 1;
					ctx.drawImage(img, x, y, width, height);
				} else if (prevPieces && (!prevGamePiece || piece !== prevGamePiece)) {
					ctx.fillStyle = 'yellow';
					ctx.globalAlpha = 0.5;
					ctx.fillRect(w, h, 62, 62);
					ctx.globalAlpha = 1;
					ctx.drawImage(img, x, y, width, height);
				} else {
					ctx.drawImage(img, x, y, width, height);
				}
			} else if (prevGamePiece) {
				ctx.fillStyle = 'yellow';
				ctx.globalAlpha = 0.5;
				ctx.fillRect(w, h, 62, 62);
				ctx.globalAlpha = 1;
			}
			w += 62;
			col += 1;
			if (col % 8 === 0 && col !== 0) {
				w = 2;
				col = 0;
				h += 62;
				row -= 1;
			}
		}
		return canvas.toBuffer();
	}

	async loadImages() {
		const images = { black: {}, white: {} };
		images.board = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'chess', 'board.png'));
		for (const piece of pieces) {
			const blk = `black-${piece}.png`;
			images.black[piece] = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'chess', blk));
			const whi = `white-${piece}.png`;
			images.white[piece] = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'chess', whi));
		}
		this.images = images;
		return images;
	}

	pickImage(piece) {
		let name;
		let color;
		switch (piece) {
			case 'p':
				name = 'pawn';
				color = 'black';
				break;
			case 'n':
				name = 'knight';
				color = 'black';
				break;
			case 'b':
				name = 'bishop';
				color = 'black';
				break;
			case 'r':
				name = 'rook';
				color = 'black';
				break;
			case 'q':
				name = 'queen';
				color = 'black';
				break;
			case 'k':
				name = 'king';
				color = 'black';
				break;
			case 'P':
				name = 'pawn';
				color = 'white';
				break;
			case 'N':
				name = 'knight';
				color = 'white';
				break;
			case 'B':
				name = 'bishop';
				color = 'white';
				break;
			case 'R':
				name = 'rook';
				color = 'white';
				break;
			case 'Q':
				name = 'queen';
				color = 'white';
				break;
			case 'K':
				name = 'king';
				color = 'white';
				break;
		}
		return { name, color };
	}

	exportGame(game, blackTime, whiteTime, playerColor) {
		return JSON.stringify({
			fen: game.exportFEN(),
			blackTime: blackTime === Infinity ? -1 : blackTime,
			whiteTime: whiteTime === Infinity ? -1 : whiteTime,
			color: playerColor
		});
	}
};
