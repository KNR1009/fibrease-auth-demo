import { User } from "../../models/User";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { collection, doc, getDoc, getFirestore } from "firebase/firestore";

type Query = {
  uid: string;
};

export default function UserShow() {
  const [user, setUser] = useState<User>(null);
  const router = useRouter();
  const query = router.query as Query;

  useEffect(() => {
    if (query.uid === undefined) {
      return;
    }
    async function loadUser() {
      console.log(query);
      const db = getFirestore();
      const ref = doc(collection(db, "users"), query.uid);
      const userDoc = await getDoc(ref);

      if (!userDoc.exists()) {
        console.log("returned");
        return;
      }
      const gotUser = userDoc.data() as User;
      gotUser.uid = userDoc.id;
      setUser(gotUser);
    }
    loadUser();
  }, [query.uid]);

  return <div>{user ? user.name : "ロード中…"}</div>;
}
