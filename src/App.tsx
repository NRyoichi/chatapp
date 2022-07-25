import React, { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Auth } from "./component/Auth";
import { login, logout, selectUser } from "./features/userSlice";
import { auth } from "./firebase";

const App: FC = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    const unSubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        dispatch(
          login({
            userId: authUser.uid,
            photoUrl: authUser.photoURL,
            displayName: authUser.displayName,
          })
        );
      } else {
        dispatch(logout());
      }
    });
    return () => {
      unSubscribe();
    };
  }, [dispatch]);
  return <Auth />;
};

export default App;
