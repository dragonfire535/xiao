const { createCanvas } = require('@napi-rs/canvas');

module.exports = class CanvasUtil {
	static greyscale(ctx, x, y, width, height) {
		const data = ctx.getImageData(x, y, width, height);
		for (let i = 0; i < data.data.length; i += 4) {
			const brightness = (0.34 * data.data[i]) + (0.5 * data.data[i + 1]) + (0.16 * data.data[i + 2]);
			data.data[i] = brightness;
			data.data[i + 1] = brightness;
			data.data[i + 2] = brightness;
		}
		ctx.putImageData(data, x, y);
		return ctx;
	}

	static invert(ctx, x, y, width, height) {
		const data = ctx.getImageData(x, y, width, height);
		for (let i = 0; i < data.data.length; i += 4) {
			data.data[i] = 255 - data.data[i];
			data.data[i + 1] = 255 - data.data[i + 1];
			data.data[i + 2] = 255 - data.data[i + 2];
		}
		ctx.putImageData(data, x, y);
		return ctx;
	}

	static silhouette(ctx, x, y, width, height) {
		const data = ctx.getImageData(x, y, width, height);
		for (let i = 0; i < data.data.length; i += 4) {
			data.data[i] = 0;
			data.data[i + 1] = 0;
			data.data[i + 2] = 0;
		}
		ctx.putImageData(data, x, y);
		return ctx;
	}

	static sepia(ctx, x, y, width, height) {
		const data = ctx.getImageData(x, y, width, height);
		for (let i = 0; i < data.data.length; i += 4) {
			const brightness = (0.34 * data.data[i]) + (0.5 * data.data[i + 1]) + (0.16 * data.data[i + 2]);
			data.data[i] = brightness + 100;
			data.data[i + 1] = brightness + 50;
			data.data[i + 2] = brightness;
		}
		ctx.putImageData(data, x, y);
		return ctx;
	}

	static contrast(ctx, x, y, width, height) {
		const data = ctx.getImageData(x, y, width, height);
		const factor = (259 / 100) + 1;
		const intercept = 128 * (1 - factor);
		for (let i = 0; i < data.data.length; i += 4) {
			data.data[i] = (data.data[i] * factor) + intercept;
			data.data[i + 1] = (data.data[i + 1] * factor) + intercept;
			data.data[i + 2] = (data.data[i + 2] * factor) + intercept;
		}
		ctx.putImageData(data, x, y);
		return ctx;
	}

	static desaturate(ctx, level, x, y, width, height) {
		const data = ctx.getImageData(x, y, width, height);
		for (let i = 0; i < height; i++) {
			for (let j = 0; j < width; j++) {
				const dest = ((i * width) + j) * 4;
				const grey = Number.parseInt(
					(0.2125 * data.data[dest]) + (0.7154 * data.data[dest + 1]) + (0.0721 * data.data[dest + 2]), 10
				);
				data.data[dest] += level * (grey - data.data[dest]);
				data.data[dest + 1] += level * (grey - data.data[dest + 1]);
				data.data[dest + 2] += level * (grey - data.data[dest + 2]);
			}
		}
		ctx.putImageData(data, x, y);
		return ctx;
	}

	static distort(ctx, amplitude, x, y, width, height, strideLevel = 4) {
		const data = ctx.getImageData(x, y, width, height);
		const temp = ctx.getImageData(x, y, width, height);
		const stride = width * strideLevel;
		for (let i = 0; i < width; i++) {
			for (let j = 0; j < height; j++) {
				const xs = Math.round(amplitude * Math.sin(2 * Math.PI * 3 * (j / height)));
				const ys = Math.round(amplitude * Math.cos(2 * Math.PI * 3 * (i / width)));
				const dest = (j * stride) + (i * strideLevel);
				const src = ((j + ys) * stride) + ((i + xs) * strideLevel);
				data.data[dest] = temp.data[src];
				data.data[dest + 1] = temp.data[src + 1];
				data.data[dest + 2] = temp.data[src + 2];
			}
		}
		ctx.putImageData(data, x, y);
		return ctx;
	}

	static fishEye(ctx, level, x, y, width, height) {
		const frame = ctx.getImageData(x, y, width, height);
		const source = new Uint8Array(frame.data);
		for (let i = 0; i < frame.data.length; i += 4) {
			const sx = (i / 4) % frame.width;
			const sy = Math.floor(i / 4 / frame.width);
			const dx = Math.floor(frame.width / 2) - sx;
			const dy = Math.floor(frame.height / 2) - sy;
			const dist = Math.sqrt((dx * dx) + (dy * dy));
			const x2 = Math.round((frame.width / 2) - (dx * Math.sin(dist / (level * Math.PI) / 2)));
			const y2 = Math.round((frame.height / 2) - (dy * Math.sin(dist / (level * Math.PI) / 2)));
			const i2 = ((y2 * frame.width) + x2) * 4;
			frame.data[i] = source[i2];
			frame.data[i + 1] = source[i2 + 1];
			frame.data[i + 2] = source[i2 + 2];
			frame.data[i + 3] = source[i2 + 3];
		}
		ctx.putImageData(frame, x, y);
		return ctx;
	}

	static pixelize(ctx, canvas, image, level, x, y, width, height) {
		ctx.imageSmoothingEnabled = false;
		ctx.drawImage(image, x, y, width * level, height * level);
		ctx.drawImage(canvas, x, y, width * level, height * level, x, y, width, height);
		ctx.imageSmoothingEnabled = true;
		return ctx;
	}

	static motionBlur(ctx, image, x, y, width, height) {
		ctx.drawImage(image, x, y, width, height);
		ctx.globalAlpha = 0.2;
		for (let i = 0; i < 10; i += 2) ctx.drawImage(image, x + i, y, width, height);
		ctx.globalAlpha = 1;
		return ctx;
	}

	static vignette(ctx, width, height) {
		const outerRadius = width * 0.5;
		const innerRadius = width * 0.2;
		const grd = ctx.createRadialGradient(width / 2, height / 2, innerRadius, width / 2, height / 2, outerRadius);
		for (let i = 0; i < 0.9; i += 0.1) {
			const num = Math.round(i * 10) / 10;
			grd.addColorStop(num, `rgba(0, 0, 0, ${num})`);
		}
		ctx.fillStyle = grd;
		ctx.fillRect(0, 0, width, height);
		return ctx;
	}

	static grain(ctx, x, y, width, height, amount = 10) {
		const imageData = ctx.getImageData(x, y, width, height);
		for (let i = 0; i < imageData.data.length; i += 4) {
			const grain = (0.5 - Math.random()) * amount;
			imageData.data[i] += grain;
			imageData.data[i + 1] += grain;
			imageData.data[i + 2] += grain;
		}
		ctx.putImageData(imageData, x, y);
		return ctx;
	}

	static cropToContent(ctx, canvas, w, h) {
		const pix = { x: [], y: [] };
		const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		let index;
		for (let y = 0; y < h; y++) {
			for (let x = 0; x < w; x++) {
				index = ((y * w) + x) * 4;
				if (imageData.data[index + 3] > 0) {
					pix.x.push(x);
					pix.y.push(y);
				}
			}
		}
		pix.x.sort((a, b) => a - b);
		pix.y.sort((a, b) => a - b);
		const n = pix.x.length - 1;
		const newW = (1 + pix.x[n]) - pix.x[0];
		const newH = (1 + pix.y[n]) - pix.y[0];
		const cut = ctx.getImageData(pix.x[0], pix.y[0], newW, newH);
		canvas.width = newW;
		canvas.height = newH;
		ctx.putImageData(cut, 0, 0);
		return ctx;
	}

	static hasAlpha(image) {
		const canvas = createCanvas(image.width, image.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(image, 0, 0);
		const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
		let hasAlphaPixels = false;
		for (let i = 3; i < data.data.length; i += 4) {
			if (data.data[i] < 255) {
				hasAlphaPixels = true;
				break;
			}
		}
		return hasAlphaPixels;
	}

	static drawImageWithTint(ctx, image, color, x, y, width, height) {
		const { fillStyle, globalAlpha } = ctx;
		ctx.fillStyle = color;
		ctx.drawImage(image, x, y, width, height);
		ctx.globalAlpha = 0.5;
		ctx.fillRect(x, y, width, height);
		ctx.fillStyle = fillStyle;
		ctx.globalAlpha = globalAlpha;
		return ctx;
	}

	static fillTextWithBreaks(ctx, text, x, y, maxLen) {
		const lines = text.split('\n');
		let currentY = y;
		for (const line of lines) {
			if (line === '') {
				const metrics = ctx.measureText('a');
				currentY += metrics.emHeightAscent + metrics.emHeightDescent;
			} else {
				ctx.fillText(line, x, currentY, maxLen);
				const metrics = ctx.measureText(line);
				currentY += metrics.emHeightAscent + metrics.emHeightDescent;
			}
		}
		return ctx;
	}

	static measureTextHeightWithBreaks(ctx, text) {
		const lines = text.split('\n');
		let result = 0;
		for (const line of lines) {
			if (line === '') {
				const metrics = ctx.measureText('a');
				result += metrics.emHeightAscent + metrics.emHeightDescent;
			} else {
				const metrics = ctx.measureText(line);
				result += metrics.emHeightAscent + metrics.emHeightDescent;
			}
		}
		return result;
	}

	static shortenText(ctx, text, maxWidth) {
		let shorten = false;
		while (ctx.measureText(`${text}...`).width > maxWidth) {
			if (!shorten) shorten = true;
			text = text.substr(0, text.length - 1);
		}
		return shorten ? `${text}...` : text;
	}

	static wrapText(ctx, text, maxWidth, shouldChunk = false) {
		const lines = [];
		const wordsAndBreaks = text.split('\n');
		for (let i = 0; i < wordsAndBreaks.length; i++) {
			const segment = wordsAndBreaks[i];
			if (segment === '') {
				lines.push('');
				continue;
			}
			const words = segment.split(' ');
			let currentLine = '';
			for (let j = 0; j < words.length; j++) {
				const word = words[j];
				if (ctx.measureText(`${currentLine} ${word}`).width <= maxWidth) {
					currentLine += `${currentLine === '' ? '' : ' '}${word}`;
				} else if (ctx.measureText(word).width > maxWidth && shouldChunk) {
					const chunks = [];
					let currentChunk = '';
					for (let k = 0; k < word.length; k++) {
						const char = word[k];
						if (ctx.measureText(`${currentChunk}${char}`).width <= maxWidth) {
							currentChunk += char;
						} else {
							chunks.push(currentChunk);
							currentChunk = char;
						}
					}
					if (currentChunk !== '') {
						chunks.push(currentChunk);
					}
					for (let k = 0; k < chunks.length; k++) {
						if (ctx.measureText(`${currentLine} ${chunks[k]}`).width > maxWidth) {
							lines.push(currentLine.trim());
							currentLine = '';
						}
						currentLine += `${currentLine === '' ? '' : ' '}${chunks[k]}`;
					}
				} else {
					if (currentLine !== '') lines.push(currentLine.trim());
					currentLine = word;
				}
			}
			if (currentLine !== '') {
				lines.push(currentLine.trim());
			}
		}
		return lines;
	}

	static centerImage(base, data) {
		const dataRatio = data.width / data.height;
		const baseRatio = base.width / base.height;
		let { width, height } = data;
		let x = 0;
		let y = 0;
		if (baseRatio < dataRatio) {
			height = data.height;
			width = base.width * (height / base.height);
			x = (data.width - width) / 2;
			y = 0;
		} else if (baseRatio > dataRatio) {
			width = data.width;
			height = base.height * (width / base.width);
			x = 0;
			y = (data.height - height) / 2;
		}
		return { x, y, width, height };
	}

	static centerImagePart(img, boxWidth, boxHeight, boxX, boxY) {
		const imgAspectRatio = img.width / img.height;
		const boxAspectRatio = boxWidth / boxHeight;
		let drawWidth;
		let drawHeight;
		if (imgAspectRatio > boxAspectRatio) {
			drawWidth = boxWidth;
	   		drawHeight = drawWidth / imgAspectRatio;
			if (drawHeight > boxHeight) {
				drawHeight = boxHeight;
				drawWidth = drawHeight * imgAspectRatio;
			}
		} else {
			drawHeight = boxHeight;
			drawWidth = drawHeight * imgAspectRatio;
			if (drawWidth > boxWidth) {
				drawWidth = boxWidth;
				drawHeight = drawWidth / imgAspectRatio;
			}
		}
		const drawX = boxX + ((boxWidth - drawWidth) / 2);
		const drawY = boxY + ((boxHeight - drawHeight) / 2);
		return { x: drawX, y: drawY, width: drawWidth, height: drawHeight };
	}
};
