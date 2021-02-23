import mongoose from 'mongoose';

const connectDatabase = async () => {
  mongoose.set('debug', process.env.NODE_ENV !== 'production');

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    console.log(`MongoDB connected: ${conn.connection.host}`.cyan.underline);

    conn.connection.on('error', () => {
      console.error('MongoDB connection error').red.underline.bold;
      process.exit(1);
    });
  } catch (error) {
    console.error(`MongoDB error: ${error.message}`.red.underline.bold);
    process.exit(1);
  }
};

export default connectDatabase;
