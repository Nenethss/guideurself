import profile from "../assets/images.jfif";
import { FaFolder } from "react-icons/fa";
import BreadCrumb from "./BreadCrumb";
const NavBar = () => {
  return (
    <div className="px-7 py-2 border-b border-secondary-100/10 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <FaFolder className="text-secondary-100" />
        <BreadCrumb />
      </div>

      <div className="flex items-center gap-3 border border-secondary-100/10 px-4 py-2 rounded-lg">
        <img className="size-10 rounded-full" src={profile} />
        <div className="text-base-300">
          <p className="text-[0.9rem] font-medium">Myoui Mina</p>
          <p className="text-[0.75rem]">Binangonan</p>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
