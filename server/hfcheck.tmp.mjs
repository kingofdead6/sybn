import 'dotenv/config';
import mongoose from 'mongoose';
import { Setting } from './src/models/index.js';
await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
const row = await Setting.findOne({ key: 'integrations' });
const hf = row?.value?.huggingFace || {};
console.log('model:', hf.model, '| key set:', !!hf.apiKey, '| key prefix:', (hf.apiKey||'').slice(0,3));
const r = await fetch('https://router.huggingface.co/v1/chat/completions', {
  method: 'POST',
  headers: { Authorization: `Bearer ${hf.apiKey}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ model: hf.model, messages: [{ role: 'user', content: 'hi' }], max_tokens: 20 }),
});
console.log('status', r.status, (await r.text()).slice(0, 400));
for (const m of ['meta-llama/Llama-3.1-8B-Instruct', 'Qwen/Qwen2.5-7B-Instruct', 'mistralai/Mistral-7B-Instruct-v0.2']) {
  const r2 = await fetch('https://router.huggingface.co/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${hf.apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: m, messages: [{ role: 'user', content: 'hi' }], max_tokens: 20 }),
  });
  console.log(m, r2.status, (await r2.text()).slice(0, 200));
}
await mongoose.disconnect();
