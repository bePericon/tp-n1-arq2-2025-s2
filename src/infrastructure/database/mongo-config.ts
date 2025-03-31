import mongoose from 'mongoose';
import config from '../../config/config';

export const connectMongoDB = async (): Promise<void> => {
	try {
		const CONN_STR = config.mongo_db_connection_string as string;
		const db = await mongoose.connect(CONN_STR);
		console.log('Data base is connect: ' + db.connection.name);
	} catch (error) {
		console.error('Error connecting to MongoDB Atlas:', error);
		process.exit(1);
	}
};
