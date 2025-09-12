import 'dotenv/config';
import { createClient } from "@libsql/client";

const turso = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_TOKEN,
});

export default turso;