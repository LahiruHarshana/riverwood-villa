import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const serviceAccountEnv = process.env.FIREBASE_SERVICE_ACCOUNT;

export function initAdminApp(): App {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  if (!serviceAccountEnv) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT is not defined in environment variables.");
  }

  let serviceAccount: Record<string, unknown>;
  try {
    const decoded = Buffer.from(serviceAccountEnv, "base64").toString("utf-8");
    serviceAccount = JSON.parse(decoded);
  } catch {
    throw new Error("Failed to decode or parse FIREBASE_SERVICE_ACCOUNT. Ensure it's a valid base64-encoded JSON string.");
  }

  return initializeApp({
    credential: cert(serviceAccount as Parameters<typeof cert>[0]),
  });
}

export function getAdminDb() {
  const app = initAdminApp();
  return getFirestore(app);
}
