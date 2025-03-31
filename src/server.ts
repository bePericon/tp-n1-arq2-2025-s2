import express, { Application } from 'express';
import { Server } from '@overnightjs/core';
import morgan, { TokenIndexer } from 'morgan';
import cors from 'cors';
import { IncomingMessage, ServerResponse } from 'http';
import { corsOptions } from './config/cors';
import logger from 'jet-logger';
import customServer from 'express-promise-router';
import cookieParser from 'cookie-parser';
import config from './config/config';
import mongoose from 'mongoose';
import { UserController } from './infrastructure/controllers/user.controller';

export class ServerApp extends Server {
	private readonly STARTED_MSG = 'Server running on port: ';

	constructor() {
		super(true);
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
		this.app.use(morgan(this.morganJsonFormat));
		this.app.use(cookieParser());
		this.app.use(cors(corsOptions));
		this.app.use((req, res, next) => {
			res.header('Access-Control-Allow-Credentials', 'true');
			next();
		});

		this.setupControllers();

		// this.app.use(errorMiddleware);

		this.initConnectionDB();
	}

	private morganJsonFormat(
		tokens: TokenIndexer,
		req: IncomingMessage,
		res: ServerResponse
	) {
		const status = tokens.status(req, res);
		const statusInfo = ['200', '201'];

		return JSON.stringify({
			date: tokens.date(req, res, 'iso'),
			method: tokens.method(req, res),
			url: tokens.url(req, res),
			status: status,
			response: `${tokens['response-time'](req, res)} ms`,
			level: statusInfo.includes(status as string) ? 'INFO' : 'WARN',
		});
	}

	private setupControllers(): void {
		const userController = new UserController();
		super.addControllers([userController], customServer);
	}

	private async initConnectionDB(): Promise<void> {
		const CONN_STR = config.mongo_db_connection_string as string;
		console.log('🚀 ~ ServerApp ~ initConnectionDB ~ CONN_STR:', CONN_STR);
		const db = await mongoose.connect(CONN_STR);
		console.log('Data base is connect: ' + db.connection.name);
	}

	public getApp(): Application {
		return this.app;
	}

	public start(port: number) {
		this.app.listen(port, () => {
			logger.imp(this.STARTED_MSG + port);
			// if (process.env.NODE_ENV !== 'test') loadData();
		});
	}
}
