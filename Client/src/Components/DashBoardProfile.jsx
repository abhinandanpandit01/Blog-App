import { Alert, Button, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../Firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';
import { updateStart, updateSuccess, updateFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, signOutSuccess } from "../redux/UserSlice";
import axios from "axios";
import { Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import {Link} from "react-router-dom"

export default function DashBoardProfile()
{
  const { currentUser, error , loading} = useSelector((state) => state.user);
  const [imgFile, setImgFile] = useState(null);
  const [imgUrl, setImgUrl] = useState("");
  const [imgFileUploadingProgress, setImgFileUploadingProgress] = useState(0);
  const [imgFileUploadingError, setImgFileUploadingError] = useState(null);
  const [updateUserSuccess, setUpdateUserSuccess] = useState("")
  const [updateUserFaliure, setUpdateUserFaliure] = useState("")
  const [showModel, setShowModel] = useState(false)
  const [formData, setFormData] = useState({});
  const imgPickerUrl = useRef();
  const dispatch = useDispatch();

  const handleImgChange = (e) =>
  {
    let file = e.target.files[0];
    if (file)
    {
      setImgFile(file);
      setImgUrl(URL.createObjectURL(file)); // This is only for preview purposes
    }
  };

  const uploadImg = async () =>
  {
    if (!currentUser)
    {
      setImgFileUploadingError("User is not authenticated");
      return;
    }

    const storage = getStorage(app);
    const fileUrl = `${currentUser._id}-${Date.now()}-${imgFile.name}`; // Unique file name
    const storageRef = ref(storage, fileUrl);
    const upload = uploadBytesResumable(storageRef, imgFile);

    upload.on(
      "state_changed",
      (snapshot) =>
      {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImgFileUploadingProgress(progress.toFixed(0));
      },
      (err) =>
      {
        setImgFileUploadingError(err.message || "Something went wrong");
        setImgFileUploadingProgress(null);
      },
      async () =>
      {
        await getDownloadURL(upload.snapshot.ref).then((url) =>
        {
          setImgUrl(url); // This is the actual URL of the uploaded image
          console.log(url)
          setFormData((prevData) => ({ ...prevData, profileImg: url }));
        });
      }
    );
  };

  console.log(currentUser._id)
  const handleUpdateData = async (e) =>
  {
    e.preventDefault();
    try
    {
      dispatch(updateStart());
      const response = await axios.put(`/api/user/update/${currentUser._id}`, formData);
      if (response.status !== 200)
      {
        dispatch(updateFailure(response.data.status));
        setUpdateUserFaliure("Something went wrong")
        return;
      }
      dispatch(updateSuccess(response.data));
      setUpdateUserSuccess("User's profile is updated Successfully")
    } catch (err)
    {
      dispatch(updateFailure(err.message));
    }
  };
  const handleUserDelete = async () =>
  {
    setShowModel(false)
    try
    {
      dispatch(deleteUserStart())
      const res = await axios.delete(`/api/user/delete/${currentUser._id}`)
      if (!res.ok)
      {
        dispatch(deleteUserFailure(res.data.status))
      }
      dispatch(deleteUserSuccess(res.data.status))
    }
    catch (err)
    {
      dispatch(deleteUserFailure(err.message))
    }
  }
  const handleSignOut = async () =>
  {
    try
    {
      await axios.post("/api/user/signOut").then((res) =>
      {
          dispatch(signOutSuccess())
          console.log(currentUser)
      })
    } catch (err)
    {
      console.log(err)
    }
  }
  useEffect(() =>
  {
    if (imgFile)
    {
      uploadImg();
    }
  }, [imgFile]);

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="text-center my-7 font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleUpdateData}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImgChange}
          ref={imgPickerUrl}
          className="hidden"
        />
        <div
          className="relative border-8 w-32 h-32 rounded-full border-[lightgray] self-center cursor-pointer shadow-md overflow-hidden"
          onClick={() => imgPickerUrl.current.click()}
        >
          <img
            src={imgUrl || currentUser.profileImg}
            alt="User"
            className="rounded-full object-cover w-full"
          />
          {imgFileUploadingProgress > 0 && (
            <CircularProgressbar
              value={imgFileUploadingProgress || 0}
              text={`${imgFileUploadingProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  color: `rgba(62,152,199,${imgFileUploadingProgress / 100})`,
                },
                path: {
                  stroke: `rgba(62,152,199,${imgFileUploadingProgress / 100})`,
                },
              }}
            />
          )}
        </div>
        {imgFileUploadingError && <Alert color={"failure"}>{imgFileUploadingError}</Alert>}
        <TextInput
          type="text"
          id="username"
          placeholder="Username"
          defaultValue={currentUser.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="Email"
          defaultValue={currentUser.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="Password"
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        <Button type="submit" gradientDuoTone={"purpleToBlue"} outline disabled={loading}>
          {loading ? "Loading..." :"Update"}
        </Button>
        {
          currentUser.isAdmin &&
          (
            <Link to={'/create-post'}>
            <Button type="button" gradientDuoTone={"purpleToPink"} className="w-full">Create a post</Button>
            </Link>
          )
        }
      </form>
      <div className="text-red-500 flex justify-between my-5">
        <span className="cursor-pointer" onClick={() => setShowModel(true)}>Delete Account</span>
        <span className="cursor-pointer" onClick={handleSignOut}>Sign Out</span>
      </div>
      {
        updateUserSuccess &&
        (
          <Alert color={"success"} className="mt-5">
            {updateUserSuccess}
          </Alert>
        )
      }
      {
        updateUserFaliure && (
          <Alert color={"failure"} className="mt-5">
            {updateUserFaliure}
          </Alert>
        )
      }
      {
        error && (
          <Alert color={"failure"} className="mt-5">
            {error}
          </Alert>
        )
      }
      <Modal show={showModel} onClose={() => setShowModel(false)} popup size={"md"}>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="w-14 h-14 text-gray-400 dark:text-gray-200 mb-4 m-auto" />
            <h3 className="mb-5 text-gray-500 text-lg dark:text-gray-400">Are you sure that you want to delete this account?</h3>
            <div className="flex justify-center gap-5">
              <Button color={"failure"} onClick={() => handleUserDelete()} >Yes,I'm sure</Button>
              <Button onClick={() => setShowModel(false)} color={"gray"}>No,cancel</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
