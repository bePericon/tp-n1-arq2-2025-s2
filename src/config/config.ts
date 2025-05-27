import dotenv from 'dotenv';

dotenv.config();

const config = {
	port: process.env.PORT,
	mongo_db_connection_string: process.env.MONGO_DB_CONNECTION_STRING,
	user_api_url: process.env.USER_API_URL,
	notification_service_address: process.env.NOTIFICATION_SERVICE_ADDRESS,
};

export default config;
