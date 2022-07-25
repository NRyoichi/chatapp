import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { FC, useEffect, useState } from "react";
import { db } from "../firebase";
import { InputDiary } from "./InputDiary";
import Post from "./Post";
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
      {posts.map((post) => (
        <Post
          postId={post.id}
          message={post.message}
          postedImage={post.postedImage}
          timeStamp={post.timestamp}
          username={post.username}
          userImage={post.userImage}
        />
      ))}
    </div>
  );
};

export default Contribute;
