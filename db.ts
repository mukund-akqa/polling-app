import mongoose, { Connection } from "mongoose";

let isConnected: Connection;

export const connectToDatabase = async () => {
  if (isConnected) {
    console.log("Using existing database connection");
    return;
  }

  try {
    const dbConnection = await mongoose.connect(
      process.env.MONGODB_URI as string
    );

    isConnected = dbConnection.connection;
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Error connecting to database:", error);
  }
};
