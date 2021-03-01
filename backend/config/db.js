import mongoose from 'mongoose';
import colors from 'colors';

const connectDatabase = async () => {
  if (!mongoose.connection.db) {
    mongoose.set('debug', process.env.NODE_ENV === 'development');

    try {
      const db = await mongoose.connect(process.env.MONGO_URI, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      });

      console.log(
        `MongoDB connected: ${db.connection.host}/${db.connection.db.databaseName}`
          .cyan.underline
      );

      db.connection.on('error', () => {
        console.error('MongoDB connection error').red.underline.bold;
        process.exit(1);
      });
    } catch (error) {
      console.error(`MongoDB error: ${error.message}`.red.underline.bold);
      process.exit(1);
    }
  }
};

export default connectDatabase;
