import { Link } from "react-router-dom";
import logo from "../../assets/logo.jpg";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
const SignInForm = () => {
  return (
    <form className="box-shadow-100 px-8 py-8 grid place-items-center text-[0.85em] gap-3 rounded-xl w-[35em]">
      <img className="w-[20em] mt-12" src={logo} />
      <p className="text-base-300 mt-4 text-center">
        Welcome back, Admin! Ready to keep things running <br /> smoothly?
      </p>

      <div className="grid w-full mt-2 gap-2">
        <label htmlFor="username" className="text-secondary-100">
          Username
        </label>
        <input
          type="text"
          id="username"
          className="border border-secondary-100/30 px-4 py-3 rounded-md"
          autoComplete="on"
        />
      </div>

      <div className="w-full space-y-3">
        <div className="grid mt-2 gap-2">
          <label htmlFor="password" className="text-secondary-100">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="border border-secondary-100/30 px-4 py-3 rounded-md"
            autoComplete="on"
          />
        </div>
        <div className="flex justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox className="border-neutral-300 checked:bg-base-100" />
            <label htmlFor="terms" className="text-base-300">
              Accept terms and conditions
            </label>
          </div>
          <Link
            className="font-semibold text-base-200 cursor-pointer"
            to={"/forgot-password"}
            state={{ from: "/sign-in" }}
          >
            Forgot Password?
          </Link>
        </div>
      </div>

      <Button className="w-full mt-4 bg-base-200 text-[1rem] py-6">
        Login
      </Button>
    </form>
  );
};

export default SignInForm;
