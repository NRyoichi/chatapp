import { ChangeEvent, FC, FormEvent, MouseEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { updateUserProfile } from "../features/userSlice";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import EmailIcon from "@mui/icons-material/Email";
import GoogleIcon from "@mui/icons-material/Google";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, provider, storage } from "../firebase";
import { Grid, IconButton, Modal } from "@mui/material";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Send from "@mui/icons-material/Send";

const theme = createTheme();

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export const Auth: FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPasword] = useState("");
  const [userName, setUserName] = useState("");
  const [userImage, setUserImage] = useState<any>(null);
  const [isLogin, setIsLogin] = useState(true);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const dispatch = useDispatch();

  const signInEmail = () => {
    signInWithEmailAndPassword(auth, email, password).catch((error) => {
      alert(error.message);
    });
  };

  const signUpEmail = async () => {
    const authUser = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    let userImageUrl = "";
    const filename = userImage?.name;
    const storageRef = ref(storage, `image/${filename}`);
    await uploadBytes(storageRef, userImage);
    userImageUrl = await getDownloadURL(storageRef);

    if (authUser.user) {
      await updateProfile(authUser.user, {
        displayName: userName,
        photoURL: userImageUrl,
      });
    }
    dispatch(
      updateUserProfile({
        displayName: userName,
        photoUrl: userImageUrl,
      })
    );
  };

  const sendResetEmail = async (event: MouseEvent<HTMLElement>) => {
    await sendPasswordResetEmail(auth, resetEmail)
      .then(() => {
        setIsOpenModal(false);
        setResetEmail("");
      })
      .catch((error: any) => {
        alert(error.message);
        setResetEmail("");
      });
  };

  const sigInGoogle = async () => {
    await signInWithPopup(auth, provider).catch((error) =>
      alert(error.message)
    );
  };

  const onChangeUserImageHundler = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files![0]) {
      setUserImage(event.target.files![0]);
      event.target.value = "";
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {isLogin ? "ログイン" : "登録"}
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            {!isLogin && (
              <>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  autoFocus
                  value={userName}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    setUserName(event.target.value);
                  }}
                />
                <Box textAlign="center">
                  <IconButton>
                    <label>
                      <AccountCircleIcon fontSize="large" />
                      <input
                        type="file"
                        accept=".png, .jpeg, .jpg, .svg"
                        onChange={onChangeUserImageHundler}
                      />
                    </label>
                  </IconButton>
                </Box>
              </>
            )}
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setEmail(event.target.value)
              }
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setPasword(event.target.value)
              }
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              disabled={
                isLogin
                  ? !email || password.length < 6
                  : !userName || !email || password.length < 6 || !userImage
              }
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              startIcon={<EmailIcon />}
              onClick={
                isLogin
                  ? async () => {
                      try {
                        await signInEmail();
                      } catch (error: any) {
                        alert(error.message);
                      }
                    }
                  : async () => {
                      try {
                        await signUpEmail();
                      } catch (error: any) {
                        alert(error.message);
                      }
                    }
              }
            >
              {isLogin ? "ログイン" : "登録"}
            </Button>
            <Grid container>
              <Grid item xs>
                <span onClick={() => setIsOpenModal(true)}>
                  パスワードが分からない場合
                </span>
              </Grid>
              <Grid item>
                <span onClick={() => setIsLogin(!isLogin)}>
                  {isLogin ? "初めての登録ですか?" : "ログインをする"}
                </span>
              </Grid>
            </Grid>
            <hr />
            <Button
              fullWidth
              variant="contained"
              color="error"
              sx={{ mt: 3, mb: 2 }}
              startIcon={<GoogleIcon />}
              onClick={sigInGoogle}
            >
              Sign In With Google
            </Button>
            <Modal open={isOpenModal} onClose={() => setIsOpenModal(false)}>
              <Box sx={modalStyle}>
                <TextField
                  InputLabelProps={{
                    shrink: true,
                  }}
                  type="email"
                  name="email"
                  label="restemail"
                  value={resetEmail}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    setResetEmail(event.target.value);
                  }}
                />
                <IconButton onClick={sendResetEmail}>
                  <Send />
                </IconButton>
              </Box>
            </Modal>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};
