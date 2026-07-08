/**
 * 独立测试：Worker 中的 OfflineAudioContext.decodeAudioData 是否能工作
 */
const { Worker } = require("worker_threads");
const fs = require("fs");
const path = require("path");

const wavPath = "/tmp/test-chord.wav";
if (!fs.existsSync(wavPath)) {
  // 创建 1 秒 440Hz WAV
  const sr = 44100;
  const n = sr;
  const buf = Buffer.alloc(44 + n * 2);
  buf.write("RIFF", 0);
  buf.writeUInt32LE(36 + n * 2, 4);
  buf.write("WAVE", 8);
  buf.write("fmt ", 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(sr, 24);
  buf.writeUInt32LE(sr * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write("data", 36);
  buf.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) {
    const s = Math.sin((2 * Math.PI * 440 * i) / sr) * 0.3;
    buf.writeInt16LE(Math.floor(s * 32767), 44 + i * 2);
  }
  fs.writeFileSync(wavPath, buf);
}

const w = new Worker(
  `
const { parentPort } = require('worker_threads');
parentPort.on('message', async (data) => {
  const start = Date.now();
  console.log('[Worker] 收到数据, type=' + data.type);
  if (data.type === 'test-decode') {
    try {
      // 测试 OfflineAudioContext
      const ac = new OfflineAudioContext(1, 1, 44100);
      console.log('[Worker] OfflineAudioContext 创建成功, state=' + ac.state);
      const buf = Buffer.from(data.buffer);
      const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
      console.log('[Worker] 开始 decodeAudioData, ' + ab.byteLength + ' bytes');
      const result = await ac.decodeAudioData(ab);
      console.log('[Worker] decodeAudioData 成功: ' + result.duration + 's, ' + Date.now() - start + 'ms');
      parentPort.postMessage({ ok: true, duration: result.duration });
    } catch (e) {
      console.log('[Worker] decodeAudioData 失败: ' + e.message);
      parentPort.postMessage({ ok: false, error: e.message });
    }
  }
});
  `,
  { eval: true },
);

w.on("message", (msg) => {
  console.log("Main 收到:", msg);
  process.exit(0);
});
w.on("error", (err) => console.error("Worker 错误:", err));

const wavData = fs.readFileSync(wavPath);
console.log("Main 发送 WAV 数据, " + wavData.length + " bytes");
w.postMessage({ type: "test-decode", buffer: wavData });

setTimeout(() => {
  console.log("TIMEOUT - Worker 没回应（>10s），确认死锁");
  process.exit(1);
}, 10000);
