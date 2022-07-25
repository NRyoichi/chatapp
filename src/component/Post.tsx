import { Avatar, Button } from "@mui/material";
import MessageIcon from "@mui/icons-material/Message";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
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
    <div>
      <div>
        <Avatar src={props.userImage} />
      </div>
      <div>
        <div>
          <div>
            <h3>
              <span>@{props.username}</span>
              <span>
                {new Date(props.timeStamp?.toDate()).toLocaleString()}
              </span>
            </h3>
          </div>
          <div>
            <p>{props.message}</p>
          </div>
        </div>
        {props.postedImage && (
          <div>
            <img src={props.postedImage} alt={props.postedImage} />
          </div>
        )}
        <MessageIcon onClick={() => setIsOpenCommentList(!isOpenCommentList)} />
        {isOpenCommentList && (
          <>
            {postedComments.map((postCom) => (
              <div key={postCom.id}>
                <Avatar src={postCom.userImage} />
                <span>{postCom.username}</span>
                <span>{postCom.message}</span>
                <span>
                  {new Date(postCom.timeStamp?.toDate()).toLocaleString()}
                </span>
              </div>
            ))}

            <form onSubmit={postNewComment}>
              <div>
                <input
                  type="text"
                  placeholder="Input new comment"
                  value={comment}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    setComment(event.target.value);
                  }}
                />
                <Button disabled={!comment} type="submit">
                  Comment
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Post;
