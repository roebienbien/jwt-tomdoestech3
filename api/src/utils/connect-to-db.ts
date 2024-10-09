import mongoose from 'mongoose';
import config from '../config/config';

const connectToDb = async () => {
  try {
    await mongoose.connect(config.database.uri, config.database.options);
    console.log(`connected to db: ${config.database.uri}`);
  } catch (error) {
    console.log(`database connection error:`, error);
    process.exit(1);
  }
};

export default connectToDb;
