import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { useEffect } from "react";
import { atom, useRecoilState } from "recoil";
import { User } from "../models/User";

const userState = atom<User>({
  key: "user",
  default: null,
});

export function useAuthentication() {
  // グローバルステートを定義
  const [user, setUser] = useRecoilState(userState);

  // 不要な認証操作をしないように
  useEffect(() => {
    if (user !== null) {
      return;
    }

    const auth = getAuth();

    signInAnonymously(auth).catch(function (error) {
      // Handle Errors here.
      console.error(error);
    });

    // 匿名認証
    onAuthStateChanged(auth, function (firebaseUser) {
      if (firebaseUser) {
        // 認証データをオブジェクトで格納
        setUser({
          uid: firebaseUser.uid,
          isAnonymous: firebaseUser.isAnonymous,
        });
      } else {
        // User is signed out.
        setUser(null);
      }
    });
  }, []);

  return { user };
}
