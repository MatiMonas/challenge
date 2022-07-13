import dotenv from 'dotenv';
dotenv.config();

import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import { errorHandler } from './middlewares';
import routes from './routes';
import db from '../db';

const { sequelize } = db;

export const connectToDB = async () => {
  const force = process.env.FORCE_SYNC_DB === 'true';
  if (force || process.env.SYNC_DB === 'true') {
    await sequelize.sync({ force });
  }
};

const root = path.normalize(`${__dirname}/../..`);

export const server = express();

server.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
server.use(bodyParser.json({ limit: '50mb' }));
server.use(morgan('dev'));
server.use(express.static(`${root}/public`));

server.use(
  cors({
    credentials: true,
  }),
);
server.use('/', routes);
server.use(errorHandler);
