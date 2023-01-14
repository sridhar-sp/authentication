import config from "../config";
import admin from "firebase-admin";

admin.initializeApp({
  credential: admin.credential.cert(config.firebaseConfig),
});

export default { auth: admin.auth };
