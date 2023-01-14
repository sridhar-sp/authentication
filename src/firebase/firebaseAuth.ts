interface FirebaseAuth {
  verifyFirebaseAuth(userToken: string): Promise<string>;
}

export default FirebaseAuth;
