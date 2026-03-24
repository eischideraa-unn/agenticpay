import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { verificationRouter } from './routes/verification.js';
import { invoiceRouter } from './routes/invoice.js';
import { stellarRouter } from './routes/stellar.js';
import { catalogRouter } from './routes/catalog.js';
import { jobsRouter } from './routes/jobs.js';
import { startJobs } from './jobs/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'agenticpay-backend' });
});

// API routes
app.use('/api/v1/verification', verificationRouter);
app.use('/api/v1/invoice', invoiceRouter);
app.use('/api/v1/stellar', stellarRouter);
app.use('/api/v1/catalog', catalogRouter);
app.use('/api/v1/jobs', jobsRouter);

const jobsEnabled = process.env.JOBS_ENABLED !== 'false';
if (jobsEnabled) {
  startJobs();
}

app.listen(PORT, () => {
  console.log(`AgenticPay backend running on port ${PORT}`);
});

export default app;
