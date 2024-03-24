import { Link } from "react-router-dom";
import { Label, TextInput, Button } from "flowbite-react";

const SignIn = () => {
  return (
    <div className="min-h-screen mt-20 ">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        <div className="flex-1">
          <Link to="/" className=" text-4xl  font-bold dark:text-white">
            <span className="px-2 py-1 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              Amit's
            </span>
            Blog
          </Link>
          <p className="mt-5 text-sm">
            This is a blog app. You can sign up with your email and password or
            with Google.
          </p>
        </div>
        <div className="flex-1">
          <form className="flex flex-col gap-4">
            <div>
              <Label value="Your email" />
              <TextInput
                type="email"
                placeholder="example@gmail.com"
                id="email"
              />
            </div>
            <div>
              <Label value="Your password" />
              <TextInput type="password" placeholder="*******" id="password" />
            </div>
            <Button gradientDuoTone="purpleToPink" type="submit">
              SignIn
            </Button>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Don't have an account?</span>
            <Link to="/signup" className="text-blue-500">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
