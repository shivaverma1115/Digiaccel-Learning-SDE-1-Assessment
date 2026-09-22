import dns from "node:dns";
import mongoose from "mongoose";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

export async function connectDb(): Promise<void> {
  const mongodbUrl = process.env.MONGODB_URL;
  if (!mongodbUrl) {
    throw new Error("Missing environment variable: MONGODB_URL");
  }

  await mongoose.connect(mongodbUrl);
  console.log("Connected to MongoDB");
}
