import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth";

function authenticate() {
  const auth = getAuth();
  // 認証処理
  signInAnonymously(auth).catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
  });
  // 匿名認証
  onAuthStateChanged(auth, function (user) {
    if (user) {
      // console.log(user.uid);
      // console.log(user.isAnonymous);
    } else {
      // User is signed out.
      // ...
    }
    // ...
  });
}

if (process.browser) {
  authenticate();
}