import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import logger from './utils/logger';
import mongoose from 'mongoose';
import userRouter from './routes/userRouter';
import { errorHandler } from './middleware/errorHandler';
import { logRoute } from './middleware/logRoute';
dotenv.config();


const port = process.env.PORT || 5000;
const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || '',
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  credentials:true,
}));

app.use(express.json()); 
app.use(express.urlencoded({extended:true}));
app.use(logRoute)

mongoose.connect(process.env.MONGODB_URI || '')
  .then(() => logger.warn('MongoDB connected',process.env.MONGODB_URI))
  .catch(err => logger.error('connectiong mongo error: ',err));


app.use('/', userRouter);

app.use(errorHandler)


app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
