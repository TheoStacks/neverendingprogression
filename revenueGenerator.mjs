import { Worker } from 'worker_threads';
import path from 'path';

const runRevenueTask = () => {
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.resolve('./revenueWorker.js'));

    worker.postMessage({
      type: 6, // 'crypto' type
      multiplier: 1.75,
      taskId: 'task-' + Date.now()
    });

    worker.on('message', (msg) => {
      if (msg.success) {
        console.log(`✅ Revenue: $${msg.revenue} via ${msg.stream}`);
        console.log(`📤 PayPal Payout ID: ${msg.payoutId}`);
      } else {
        console.error(`❌ Error: ${msg.error}`);
      }
      resolve();
    });

    worker.on('error', (err) => {
      console.error('❌ Worker thread failed:', err);
      reject(err);
    });
  });
};

runRevenueTask();
