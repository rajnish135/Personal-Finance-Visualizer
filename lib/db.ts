import mongoose from 'mongoose';

const MONGODB_URL = process.env.MONGODB_URL;

if (!MONGODB_URL) {
  throw new Error('MONGODB_URL is not defined in environment variables');
}

let isConnected = false;

async function dbConnect() {
  if (isConnected) return;

  await mongoose.connect(MONGODB_URL as string);
  isConnected = true;
}

export default dbConnect;
