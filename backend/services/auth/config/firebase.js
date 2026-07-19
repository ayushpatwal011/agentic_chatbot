import { cert, initializeApp } from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let serviceAccount;

// 1. Check if the service account JSON string is provided in the Env Variables
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
  // 2. Fallback to reading the local JSON file (for local development)
  const filePath = path.resolve(__dirname, "../serviceAccountKey.json");
  serviceAccount = JSON.parse(fs.readFileSync(filePath, "utf8"));
}

export const app = initializeApp({
  credential: cert(serviceAccount)
});
