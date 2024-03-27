import { TextInput, Button, Spinner, Alert, Modal } from "flowbite-react";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateInFailure,
  updateInStart,
  updateInSuccess,
  deleteInFailure,
  deleteInSuccess,
  deleteInStart,
  signoutFailure,
  signoutSuccess,
} from "../redux/userSlice";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const DashProfile = () => {
  const { loading, error, currentUser } = useSelector((state) => state.user);
  const fileRef = useRef();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [showModel, setShowModel] = useState(false);

  const handleChange = (e) => {
    if (e.target.type === "file") {
      setFormData({ ...formData, [e.target.id]: e.target.files[0] });

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      if (e.target.files[0]) {
        reader.readAsDataURL(e.target.files[0]);
      } else {
        setImagePreview(currentUser.avatar);
      }
    } else {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(formData).length === 0) {
      return dispatch(updateInFailure("Please provide any value"));
    }
    const form = new FormData();

    if (formData.username) form.append("username", formData.username);
    if (formData.email) form.append("email", formData.email);
    if (formData.password) form.append("password", formData.password);
    if (formData.avatar) form.append("avatar", formData.avatar);

    try {
      dispatch(updateInStart());
      const res = await fetch(`/api/user/${currentUser._id}`, {
        method: "PATCH",
        body: form,
      });
      const data = await res.json();
      if (data.success === false) {
        return dispatch(updateInFailure(data.message));
      }

      dispatch(updateInSuccess(data));
    } catch (error) {
      dispatch(updateInFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    setShowModel(false);
    try {
      dispatch(deleteInStart());
      const res = await fetch(`/api/user/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = res.json();
      if (!res.ok) {
        return dispatch(deleteInFailure(data.message));
      }
      dispatch(deleteInSuccess(data));
    } catch (error) {
      dispatch(deleteInFailure(error.message));
    }
  };

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(signoutFailure(data.message));
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      dispatch(signoutFailure(error.message));
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form onSubmit={handleSubmit} className=" flex flex-col gap-4">
        <input
          type="file"
          className="hidden"
          accept="image/*"
          ref={fileRef}
          id="avatar"
          onChange={handleChange}
        />
        <div className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full">
          <img
            src={imagePreview || currentUser.avatar}
            alt="avatar"
            className="rounded-full w-full h-full border-8 border-[lightgray]"
            onClick={() => fileRef.current.click()}
          />
        </div>
        <TextInput
          type="text"
          id="username"
          placeholder="Username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="Email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="Password"
          defaultValue={""}
          onChange={handleChange}
        />
        <Button type="submit" gradientDuoTone="purpleToBlue" outline>
          {loading ? (
            <>
              <Spinner size="sm" />
              <span className="pl-3">Loading...</span>
            </>
          ) : (
            "Update"
          )}
        </Button>
        {currentUser.isAdmin && (
          <Link to="/create-post">
            <Button
              type="button"
              gradientDuoTone="purpleToPink"
              className="w-full"
            >
              Create a post
            </Button>
          </Link>
        )}
      </form>
      <div className="text-red-500 flex justify-between my-5">
        <span onClick={() => setShowModel(true)} className="cursor-pointer">
          Delete Account
        </span>
        <span onClick={handleSignout} className="cursor-pointer">
          Sign Out
        </span>
      </div>
      {error && (
        <Alert className="mt-5" color="failure">
          {error}
        </Alert>
      )}
      <Modal
        show={showModel}
        onClose={() => setShowModel(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 darK:text0gray-200 mb-4 mx-auto" />
            <h1 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete your account
            </h1>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>
                Yes, I'm sure
              </Button>
              <Button onClick={() => setShowModel(false)}>No, cancel</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashProfile;
