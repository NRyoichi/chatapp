import { ChangeEvent, FC, FormEvent, useState } from "react";
import { useSelector } from "react-redux";
import styles from "../styles/InputDiary.module.css";
import Avatar from "@mui/material/Avatar";
import { selectUser } from "../features/userSlice";
import { auth, db, storage } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { Button, FormControl, IconButton, TextField } from "@mui/material";
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
        <div className={styles.input_form}>
          <Avatar
            className={styles.post_avator}
            src={userInfo.photoUrl}
            onClick={async () => {
              await auth.signOut();
            }}
          />
          <FormControl sx={{ m: 1 }} variant="standard">
            <TextField
              className={styles.daiary_input}
              type="text"
              placeholder="What is happend"
              autoFocus
              value={postedMessage}
              onChange={(event) => setPostedMessage(event.target.value)}
            />
          </FormControl>
          <IconButton>
            <label>
              <AddPhotoAlternateIcon />
              <input
                type="file"
                onChange={onChangePostedImageHundler}
                className={styles.fileinput_hiddenIcon}
              />
            </label>
          </IconButton>
          <Button
            className={styles.post_button}
            type="submit"
            disabled={!postedMessage}
          >
            Post
          </Button>
        </div>
      </form>
    </>
  );
};
