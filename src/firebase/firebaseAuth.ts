import { UserRecord } from "firebase-admin/lib/auth/user-record";

interface FirebaseAuth {
  verifyFirebaseAuth(userToken: string): Promise<string>;
  getUser(userId: string): Promise<UserRecord>;
}

export default FirebaseAuth;
