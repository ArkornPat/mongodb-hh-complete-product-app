import { MongoClient } from 'mongodb';

// Set up db connection here
const connectionString = "mongodb://127.0.0.1:27017";
const client = new MongoClient(connectionString);

let db;

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    db = client.db("practice-mongo");
    return db;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

export { connectToDatabase, db };
