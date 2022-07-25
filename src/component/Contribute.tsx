import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { FC, useEffect, useState } from "react";
import { db } from "../firebase";
import { InputDiary } from "./InputDiary";
const Contribute: FC = () => {
  const [posts, setPosts] = useState([
    {
      id: "",
      message: "",
      postedImage: "",
      timestamp: null,
      userImage: "",
      username: "",
    },
  ]);

  useEffect(() => {
    const sortedQuery = query(
      collection(db, "posts"),
      orderBy("timestamp", "desc")
    );
    const getQuery = onSnapshot(sortedQuery, (snapShot) => {
      setPosts(
        snapShot.docs.map((doc) => ({
          id: doc.id,
          message: doc.data().message,
          postedImage: doc.data().postedImage,
          timestamp: doc.data().timestamp,
          username: doc.data().username,
          userImage: doc.data().userImage,
        }))
      );
    });
    return () => {
      getQuery();
    };
  }, []);
  return (
    <div>
      <InputDiary />
    </div>
  );
};

export default Contribute;
