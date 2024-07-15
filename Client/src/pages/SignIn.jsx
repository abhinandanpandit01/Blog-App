import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { useState } from "react";
import axios from "axios";
import OAuth from "../Components/OAuth";
import { useDispatch, useSelector } from "react-redux";
import { signInStart, signInSuccess, signInFailure } from "../redux/UserSlice";

export default function SignIn() {
  const dispatch = useDispatch();
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      dispatch(signInFailure("Fill the required fields"));
      return;
    }

    dispatch(signInStart());
    try {
      const res = await axios.post("/api/auth/signIn", { email, password });
      if (res.data.status === "Password Incorrect") {
        dispatch(signInFailure(res.data.status));
      } else {
        navigate("/");
        setEmail("");
        setPassword("");
        dispatch(signInSuccess(res.data.user));
      }
    } catch (err) {
      dispatch(signInFailure(err.response?.data?.status || "An Error occurred"));
    }
  };

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* Left */}
        <div className="flex-1">
          <Link to={"/"} className="whitespace-nowrap text-5xl font-semibold dark:text-white">
            <span className="bg-gradient-to-r from-blue-600 to-violet-600 px-1 py-2 rounded-lg bg-clip-text text-transparent font-bold">
              Blog<span>X</span>
            </span>
          </Link>
          <p className="text-sm mt-5">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores facere sunt eum deleniti odio modi!
          </p>
        </div>
        {/* Right */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSignIn}>
            <div>
              <Label value="Your Email Address" />
              <TextInput
                type="email"
                placeholder="name@company.com"
                icon={MdOutlineAlternateEmail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Label value="Your Password" />
              <TextInput
                type="password"
                placeholder="********"
                icon={RiLockPasswordFill}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button gradientDuoTone="purpleToPink" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading....</span>
                </>
              ) : (
                "Sign In"
              )}
            </Button>
            <OAuth />
          </form>
          <div className="flex text-sm mt-5">
            <span>
              Don't Have an Account?{" "}
              <Link to="/signUp" className="text-blue-600 font-semibold">
                Sign up
              </Link>
            </span>
          </div>
          {errorMessage && <Alert className="mt-5" color="failure">{errorMessage}</Alert>}
        </div>
      </div>
    </div>
  );
}
