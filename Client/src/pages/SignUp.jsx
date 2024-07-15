import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { useState } from "react";
import axios from "axios";
import OAuth from "../Components/OAuth";

export default function SignUp() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      if (!username || !email || !password) {
        return setErrorMessage("Fill the required fields");
      }
      setLoading(true);
      setErrorMessage(null);
      await axios
        .post("/api/auth/signUp", {
          username,
          email,
          password,
        })
        .then((res) => {
          console.log(res.data); // res.data = {status : "-----------",userDetails:{------}}
          setLoading(false);
          setEmail("");
          setUsername("");
          setPassword("");
          if (loading === false) {
            navigate("/signIn");
          }
        });
    } catch (err) {
      console.error(err.response?.data);
      return setErrorMessage(err.response?.data.status);
    }
  };

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left */}
        <div className="flex-1">
          <Link
            to={"/"}
            className="whitespace-nowrap text-5xl font-semibold dark:text-white"
          >
            <span className="bg-gradient-to-r from-blue-600 to-violet-600 px-1 py-2 rounded-lg bg-clip-text text-transparent font-bold ">
              Blog<span>X</span>
            </span>
          </Link>
          <p className="text-sm mt-5">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores
            facere sunt eum deleniti odio modi!
          </p>
        </div>
        {/* Right */}
        <div className="flex-1">
          <form className="flex flex-col gap-4">
            <div className="">
              <Label value="Your Username" />
              <TextInput
                type="text"
                placeholder="Username"
                icon={FaUser}
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setLoading(false);
                }}
              />
            </div>
            <div className="">
              <Label value="Your Email Address" />
              <TextInput
                type="email"
                placeholder="name@company.com"
                icon={MdOutlineAlternateEmail}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setLoading(false);
                }}
              />
            </div>
            <div className="">
              <Label value="Your Password" />
              <TextInput
                type="password"
                placeholder="Password"
                icon={RiLockPasswordFill}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setLoading(false);
                }}
              />
            </div>
            <Button
              gradientDuoTone={"purpleToPink"}
              onClick={handleSignUp}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size={"sm"} />
                  <span className="pl-3">Loading....</span>
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
            <OAuth />
          </form>
          <div className="flex text-sm mt-5">
            <span>
              Have an Account?{" "}
              <Link to="/signIn" className="text-blue-600 font-semibold">
                Sign in
              </Link>
            </span>
          </div>
          {errorMessage && (
            <>
              <Alert className="mt-5" color={"failure"}>
                {errorMessage}
              </Alert>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
