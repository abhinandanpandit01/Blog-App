import { Button } from "flowbite-react";
import axios from "axios";
import React from "react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../Firebase";
import { useDispatch } from "react-redux";
import { signInSuccess, signInFailure } from "../redux/UserSlice";
import { useNavigate } from "react-router-dom";

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = getAuth(app);

  const handleGoogleAuth = async () => {
    const provider = new GoogleAuthProvider();
    // Ask every time which account to use
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      const resultFromGoogle = await signInWithPopup(auth, provider);
      const username = resultFromGoogle.user.displayName || "";
      const email = resultFromGoogle.user.email || "";
      const profileImg = resultFromGoogle.user.photoURL || "https://cdn-icons-png.freepik.com/256/149/149071.png?semt=ais_hybrid";
      const response = await axios.post("/api/auth/google", {
        username,
        email,
        profileImg,
      });

      // Check the response status
      if (response.status === 200) {
        dispatch(signInSuccess(response.data));
        navigate("/");
      } else {
        throw new Error("Failed to authenticate");
      }
    } catch (err) {
      console.error("Authentication failed:", err);
      dispatch(signInFailure(err.message));
    }
  };

  return (
    <Button
      type="button"
      gradientDuoTone={"pinkToOrange"}
      outline
      onClick={handleGoogleAuth}
    >
      <AiFillGoogleCircle className="w-6 h-6 mr-2" /> Continue with Google
    </Button>
  );
}
