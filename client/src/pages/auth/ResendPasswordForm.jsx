import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.jpg";
import { Button } from "../../components/ui/button";
const ResendPasswordForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    navigate(location.state?.from);
  };

  return (
    <form className="box-shadow-100 px-8 py-8 grid place-items-center text-[0.85em] gap-3 rounded-xl w-[35em]">
      <img className="w-[20em] mt-12" src={logo} />

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

      <div className="w-full grid mt-2 gap-2">
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

      <div className="w-full grid mt-2">
        <Button className="w-full mt-4 bg-base-200 text-[1rem] py-6">
          Resend Password
        </Button>
        <Button
          className="w-full mt-4 text-base-200 bg-base-200/15 border-2 border-base-200 text-[1rem] py-6"
          onClick={handleBack}
        >
          Back
        </Button>
      </div>
    </form>
  );
};

export default ResendPasswordForm;
