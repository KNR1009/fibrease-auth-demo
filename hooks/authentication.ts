import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { useEffect } from "react";
import { atom, useRecoilState } from "recoil";
import { User } from "../models/User";

const userState = atom<User>({
  key: "user",
  default: null,
});

import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

// ログインユーザーの情報をfirestoreに登録
async function createUserIfNotFound(user: User) {
  const db = getFirestore();

  const usersCollection = collection(db, "users");
  const userRef = doc(usersCollection, user.uid);
  const document = await getDoc(userRef);
  if (document.exists()) {
    // 書き込みの方が高いので！
    return;
  }

  await setDoc(userRef, {
    name: "taro" + new Date().getTime(),
  });
}

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
        const loginUser: User = {
          uid: firebaseUser.uid,
          isAnonymous: firebaseUser.isAnonymous,
        };
        setUser(loginUser);
        createUserIfNotFound(loginUser);
      } else {
        // User is signed out.
        setUser(null);
      }
    });
  }, []);

  return { user };
}
