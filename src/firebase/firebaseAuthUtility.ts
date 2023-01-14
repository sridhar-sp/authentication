import FirebaseAuth from "./firebaseAuth";
import firebase from "./index";

class FirebaseAuthImpl implements FirebaseAuth {
  verifyFirebaseAuth = (userToken: string) => {
    return new Promise((resolve: (uid: string) => void, reject: (error: Error) => void) => {
      firebase
        .auth()
        .verifyIdToken(userToken) // decode firebase user auth token
        .then((decodedToken) => {
          resolve(decodedToken.uid); // Firebase user id
        })
        .catch(reject);
    });
  };
}

export default FirebaseAuthImpl;
