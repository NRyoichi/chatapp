import { Avatar, Button, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MessageIcon from "@mui/icons-material/Message";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import styles from "../styles/Post.module.css";
import React, { ChangeEvent, FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { db } from "../firebase";

interface PROPS {
  postId: string;
  message: string;
  postedImage: string;
  timeStamp: any;
  userImage: string;
  username: string;
}

interface COMMENT {
  id: string;
  userImage: string;
  message: string;
  timeStamp: any;
  username: string;
}

const Post: FC<PROPS> = (props) => {
  const user = useSelector(selectUser);
  const [comment, setComment] = useState("");
  const [postedComments, setPostedComments] = useState<COMMENT[]>([
    {
      id: "",
      userImage: "",
      message: "",
      username: "",
      timeStamp: null,
    },
  ]);
  const [isOpenCommentList, setIsOpenCommentList] = useState(false);
  useEffect(() => {
    const sortedQuery = query(
      collection(db, "posts", props.postId, "comments"),
      orderBy("timeStamp", "desc")
    );
    const unSub = onSnapshot(sortedQuery, (snapshot) => {
      setPostedComments(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          userImage: doc.data().userImage,
          message: doc.data().message,
          username: doc.data().username,
          timeStamp: doc.data().timeStamp,
        }))
      );
    });
    return () => {
      unSub();
    };
  }, [props.postId]);

  const postNewComment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addDoc(collection(db, "posts", props.postId, "comments"), {
      userImage: user.photoUrl,
      text: comment,
      timestamp: serverTimestamp(),
      username: user.displayName,
    });
    setComment("");
  };
  return (
    <>
      <div className={styles.post_container}>
        <div className={styles.post_block}>
          <Avatar src={props.userImage} />
          <h3>
            <div className={styles.user_name}>@{props.username}</div>
            <div className={styles.post_date}>
              {new Date(props.timeStamp?.toDate()).toLocaleString()}
            </div>
          </h3>
          <div className={styles.post_message}>{props.message}</div>
          {props.postedImage && (
            <div className={styles.post_img}>
              <img src={props.postedImage} alt={props.postedImage} />
            </div>
          )}
        </div>
        <div className={styles.comment_container}>
          <MessageIcon
            onClick={() => setIsOpenCommentList(!isOpenCommentList)}
          />
          {isOpenCommentList && (
            <div>
              <>
                <form onSubmit={postNewComment}>
                  <div className={styles.post_comment_form}>
                    <TextField
                      className={styles.comment_input}
                      type="text"
                      placeholder="Input new comment"
                      value={comment}
                      onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        setComment(event.target.value);
                      }}
                    />
                    <Button
                      className={styles.comment_button}
                      disabled={!comment}
                      type="submit"
                    >
                      <SendIcon />
                    </Button>
                  </div>
                </form>
              </>
              {postedComments.map((postCom) => (
                <div key={postCom.id} className={styles.comment_list}>
                  <Avatar
                    className={styles.comment_avator}
                    src={postCom.userImage}
                  />
                  <p className={styles.comment_username}>{postCom.username}</p>
                  <p className={styles.posted_timestamp}>
                    {new Date(postCom.timeStamp?.toDate()).toLocaleString()}
                  </p>
                  <p className={styles.posted_comment}>{postCom.message}</p>
                  <br />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Post;
