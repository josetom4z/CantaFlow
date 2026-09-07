const fs = require('fs');
const path = require('path');

function generateWavFile(filePath, durationSec = 15, chordProgression = [440, 554.37, 659.25]) {
  const sampleRate = 44100;
  const numChannels = 2;
  const bytesPerSample = 2;
  const totalSamples = Math.floor(sampleRate * durationSec);
  const dataSize = totalSamples * numChannels * bytesPerSample;

  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // FMT sub-chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size (16 for PCM)
  buffer.writeUInt16LE(1, 20);  // AudioFormat (1 = PCM)
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * numChannels * bytesPerSample, 28); // ByteRate
  buffer.writeUInt16LE(numChannels * bytesPerSample, 32); // BlockAlign
  buffer.writeUInt16LE(16, 34); // BitsPerSample

  // DATA sub-chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Generate audio samples (smooth ambient organ/piano pad with harmonic overtones)
  let offset = 44;
  const chordLengthSec = durationSec / chordProgression.length;

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    const chordIndex = Math.min(Math.floor(t / chordLengthSec), chordProgression.length - 1);
    const chords = chordProgression[chordIndex]; // array of frequencies e.g. [G, B, D]

    let sampleVal = 0;
    // Envelope for each chord transition to avoid clicking
    const chordLocalT = t % chordLengthSec;
    const envelope = Math.sin(Math.PI * (chordLocalT / chordLengthSec));

    chords.forEach((freq, idx) => {
      // Fundamental + gentle harmonics
      const osc1 = Math.sin(2 * Math.PI * freq * t);
      const osc2 = Math.sin(2 * Math.PI * (freq * 2) * t) * 0.3;
      const osc3 = Math.sin(2 * Math.PI * (freq * 0.5) * t) * 0.4;
      // Soft chorus/tremolo modulation
      const mod = 1 + 0.05 * Math.sin(2 * Math.PI * 2.5 * t + idx);
      sampleVal += (osc1 + osc2 + osc3) * mod * 0.25;
    });

    // Master envelope (fade in and fade out)
    const masterFade = Math.min(1, Math.min(t / 0.5, (durationSec - t) / 0.5));
    const finalSample = Math.max(-1, Math.min(1, sampleVal * envelope * masterFade * 0.6));

    const int16Sample = Math.floor(finalSample * 32767);

    // Left channel
    buffer.writeInt16LE(int16Sample, offset);
    // Right channel (slight stereo pan)
    buffer.writeInt16LE(int16Sample, offset + 2);

    offset += 4;
  }

  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(filePath, buffer);
  console.log(`Generated audio: ${filePath} (${(buffer.length / 1024).toFixed(1)} KB)`);
}

// Chords (Hz):
// G: 196, B: 246.94, D: 293.66, G2: 392
// C: 261.63, E: 329.63, G: 392, C2: 523.25
// Em: 164.81, B: 246.94, E: 329.63, G: 392
// D: 293.66, F#: 369.99, A: 440, D2: 587.33
// A: 220, C#: 277.18, E: 329.63, A2: 440
// F#m: 185, A: 220, C#: 277.18, F#2: 369.99

const outputDirs = [
  path.join(__dirname, '../frontend/public/audio'),
  path.join(__dirname, '../backend/uploads/audio')
];

outputDirs.forEach(dir => {
  // 1. Bondade de Deus (G -> C -> Em -> D)
  generateWavFile(path.join(dir, 'bondade_de_deus.wav'), 16, [
    [196.00, 246.94, 293.66, 392.00], // G
    [261.63, 329.63, 392.00, 523.25], // C
    [164.81, 246.94, 329.63, 392.00], // Em
    [220.00, 293.66, 369.99, 440.00], // D/F#
  ]);

  // 2. A Ele a Glória (Em -> C -> G -> D)
  generateWavFile(path.join(dir, 'a_ele_a_gloria.wav'), 16, [
    [164.81, 246.94, 329.63, 392.00], // Em
    [261.63, 329.63, 392.00, 523.25], // C
    [196.00, 246.94, 293.66, 392.00], // G
    [293.66, 369.99, 440.00, 587.33], // D
  ]);

  // 3. Porque Ele Vive (A -> D -> A -> E)
  generateWavFile(path.join(dir, 'porque_ele_vive.wav'), 16, [
    [220.00, 277.18, 329.63, 440.00], // A
    [293.66, 369.99, 440.00, 587.33], // D
    [220.00, 277.18, 329.63, 440.00], // A
    [164.81, 246.94, 329.63, 493.88], // E
  ]);

  // 4. Ousado Amor (F#m -> E -> D -> A)
  generateWavFile(path.join(dir, 'ousado_amor.wav'), 16, [
    [185.00, 220.00, 277.18, 369.99], // F#m
    [164.81, 246.94, 329.63, 493.88], // E
    [293.66, 369.99, 440.00, 587.33], // D
    [220.00, 277.18, 329.63, 440.00], // A
  ]);
});

console.log('All worship demo audios generated successfully!');
