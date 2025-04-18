import readline from 'readline';
import { exec } from 'child_process';
import { OpenAI } from 'openai';
import 'dotenv/config';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function askGPT(prompt) {
  try {
    const res = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });
    return res.choices[0].message.content.trim();
  } catch (err) {
    return `❌ GPT Error: ${err.message}`;
  }
}

function runCommand(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) return reject(stderr || error.message);
      resolve(stdout);
    });
  });
}

async function main() {
  rl.question('\\n🤖 What do you want to do, boss? ', async (input) => {
    input = input.toLowerCase();

    if (input.includes('copy worker files')) {
      console.log('📁 Copying worker files...');
      try {
        const result = await runCommand('node copy-worker-files.js');
        console.log(result);
      } catch (err) {
        console.error('❌ Error:', err);
      }
    } else if (input.includes('generate revenue')) {
      console.log('💸 Generating revenue...');
      try {
        const result = await runCommand('node revenueGenerator.mjs');
        console.log(result);
      } catch (err) {
        console.error('❌ Revenue Error:', err);
      }
    } else if (input.includes('withdraw')) {
      console.log('🏦 Withdrawing funds...');
      try {
        const result = await runCommand('node withdraw.js');
        console.log(result);
      } catch (err) {
        console.error('❌ Withdraw Error:', err);
      }
    } else {
      console.log('💬 Asking GPT...');
      const reply = await askGPT(input);
      console.log(`\\n🧠 GPT says:\\n${reply}`);
    }

    rl.close();
  });
}

main();
