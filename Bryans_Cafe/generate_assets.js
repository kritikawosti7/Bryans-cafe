const fs = require('node:fs');

const width = 120;
const height = 100;
const palette = [
  [244, 248, 242], [36, 76, 52], [68, 120, 76], [105, 154, 91],
  [164, 196, 124], [187, 72, 55], [224, 112, 82], [255, 255, 250],
  [218, 230, 215], [195, 216, 195], [222, 234, 221], [24, 61, 43],
  ...Array(4).fill([0, 0, 0]),
];

function saladFrame(frame) {
  const pixels = new Uint8Array(width * height).fill(0);
  const put = (x, y, color) => {
    if (x >= 0 && x < width && y >= 0 && y < height) pixels[y * width + x] = color;
  };
  const ellipse = (cx, cy, rx, ry, color) => {
    for (let y = -ry; y <= ry; y++) {
      for (let x = -rx; x <= rx; x++) {
        if ((x * x) / (rx * rx) + (y * y) / (ry * ry) <= 1) put(cx + x, cy + y, color);
      }
    }
  };
  const leaf = (cx, cy, rx, ry, color) => {
    ellipse(cx, cy, rx, ry, color);
    for (let offset = -rx + 2; offset < rx - 1; offset++) put(cx + offset, cy + Math.round(offset * ry / rx), 2);
  };
  const cube = (x, y) => {
    for (let dy = 0; dy < 8; dy++) {
      for (let dx = 0; dx < 9; dx++) put(x + dx, y + dy, dy === 0 || dx === 8 ? 8 : 7);
    }
  };

  ellipse(60, 84, 37, 5, 10);
  ellipse(60, 64, 48, 27, 9);
  ellipse(60, 61, 43, 23, 7);
  const drift = frame % 3;
  leaf(37 + drift, 54, 17, 8, 2);
  leaf(54, 47 + drift, 17, 9, 3);
  leaf(76 - drift, 53, 18, 8, 2);
  leaf(45, 68 - drift, 16, 8, 4);
  leaf(70 + drift, 68, 18, 8, 3);
  leaf(88, 61 + drift, 13, 7, 4);
  ellipse(43, 57, 7, 7, 5);
  ellipse(72, 55 + drift, 7, 7, 5);
  ellipse(59, 70, 7, 7, 6);
  put(41, 54, 6);
  put(70, 52 + drift, 6);
  cube(52 - drift, 57);
  cube(80, 68 - drift);
  cube(31, 68 + drift);
  return pixels;
}

function lzwLiteralStream(pixels) {
  const clear = 16;
  const end = 17;
  const codes = [];
  for (const pixel of pixels) codes.push(clear, pixel);
  codes.push(end);
  const bytes = [];
  let accumulator = 0;
  let bitCount = 0;
  for (const code of codes) {
    accumulator |= code << bitCount;
    bitCount += 5;
    while (bitCount >= 8) {
      bytes.push(accumulator & 255);
      accumulator >>>= 8;
      bitCount -= 8;
    }
  }
  if (bitCount > 0) bytes.push(accumulator & 255);
  return Buffer.from(bytes);
}

function subBlocks(data) {
  const blocks = [];
  for (let offset = 0; offset < data.length; offset += 255) {
    const chunk = data.subarray(offset, Math.min(offset + 255, data.length));
    blocks.push(Buffer.from([chunk.length]), chunk);
  }
  blocks.push(Buffer.from([0]));
  return Buffer.concat(blocks);
}

function makeGif() {
  const header = Buffer.from('GIF89a', 'ascii');
  const screen = Buffer.from([width & 255, width >> 8, height & 255, height >> 8, 0xf3, 0, 0]);
  const colorTable = Buffer.from(palette.flat());
  const loopExtension = Buffer.concat([
    Buffer.from([0x21, 0xff, 0x0b]),
    Buffer.from('NETSCAPE2.0', 'ascii'),
    Buffer.from([0x03, 0x01, 0x00, 0x00, 0x00]),
  ]);
  const frames = [];
  for (let frame = 0; frame < 6; frame++) {
    frames.push(Buffer.from([0x21, 0xf9, 4, 4, 12, 0, 0, 0]));
    frames.push(Buffer.from([0x2c, 0, 0, 0, 0, width & 255, width >> 8, height & 255, height >> 8, 0]));
    frames.push(Buffer.from([4]));
    frames.push(subBlocks(lzwLiteralStream(saladFrame(frame))));
  }
  return Buffer.concat([header, screen, colorTable, loopExtension, ...frames, Buffer.from([0x3b])]);
}

function makeWav() {
  const sampleRate = 22050;
  const duration = 3.2;
  const sampleCount = Math.floor(sampleRate * duration);
  const pcm = Buffer.alloc(sampleCount * 2);
  const notes = [523.25, 659.25, 783.99, 659.25];
  const noteLength = 0.52;
  for (let index = 0; index < sampleCount; index++) {
    const time = index / sampleRate;
    const localTime = time % noteLength;
    const envelope = Math.exp(-localTime * 4.8) * Math.min(1, localTime * 30);
    const frequency = notes[Math.floor(time / noteLength) % notes.length];
    const chime = Math.sin(2 * Math.PI * frequency * time) + 0.2 * Math.sin(2 * Math.PI * frequency * 2.02 * time);
    const sample = Math.max(-1, Math.min(1, chime * envelope * 0.2));
    pcm.writeInt16LE(Math.round(sample * 32767), index * 2);
  }
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write('data', 36);
  header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
}

fs.writeFileSync('food.gif', makeGif());
fs.writeFileSync('food.wav', makeWav());
console.log('Generated original food.gif and food.wav.');