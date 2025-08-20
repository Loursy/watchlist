import dotenv from 'dotenv';
dotenv.config();

if (!process.env.TMDB_API_KEY) {
  throw new Error("❌ TMDB_API_KEY .env dosyasında tanımlı değil");
}

export const config = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/watchlist',
  jwtSecret: process.env.JWT_SECRET || 'secret',
  tmdbApiKey: process.env.TMDB_API_KEY,
};
