import React, { ChangeEvent, FC, FormEvent, useState } from "react";
import { useSelector } from "react-redux";
import Avatar from "@mui/material/Avatar";
import { selectUser } from "../features/userSlice";
import { auth, db, storage } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { Button, IconButton } from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

export const InputDiary: FC = () => {
  const userInfo = useSelector(selectUser);
  const [postedImage, setPostedImage] = useState<File | null>(null);
  const [postedMessage, setPostedMessage] = useState("");

  const onChangePostedImageHundler = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files![0]) {
      setPostedImage(event.target.files![0]);
      event.target.value = "";
    }
  };
  const postDiary = (event: FormEvent) => {
    event.preventDefault();
    if (postedImage) {
      const fileName = postedImage.name;
      const uploadPostedImage = uploadBytesResumable(
        ref(storage, `images/${fileName}`),
        postedImage
      );
      uploadPostedImage.on(
        "state_changed",
        () => {},
        (error) => {
          alert(error.message);
        },
        async () => {
          await getDownloadURL(ref(storage, `image/${fileName}`)).then(
            async (url) => {
              addDoc(collection(db, "posts"), {
                userImage: userInfo.photoUrl,
                postedImage: url,
                message: postedMessage,
                timestamp: serverTimestamp(),
                username: userInfo.displayName,
              });
            }
          );
        }
      );
    } else {
      addDoc(collection(db, "posts"), {
        userImage: userInfo.photoUrl,
        postedImage: "",
        message: postedMessage,
        timestamp: serverTimestamp(),
        username: userInfo.displayName,
      });
    }
    setPostedImage(null);
    setPostedMessage("");
  };
  return (
    <>
      <form onSubmit={postDiary}>
        <div>
          <Avatar
            src={userInfo.photoUrl}
            onClick={async () => {
              await auth.signOut();
            }}
          />
          <input
            type="text"
            placeholder="What is happend"
            autoFocus
            value={postedMessage}
            onChange={(event) => setPostedMessage(event.target.value)}
          />
          <IconButton>
            <label>
              <AddPhotoAlternateIcon />
              <input type="file" onChange={onChangePostedImageHundler} />
            </label>
          </IconButton>
        </div>
        <Button type="submit" disabled={!postedMessage}>
          Post
        </Button>
      </form>
    </>
  );
};
