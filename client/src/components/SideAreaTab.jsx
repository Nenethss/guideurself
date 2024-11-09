import useBreadCrumbStore from "@/state/breadcrumb";
import { useNavigate } from "react-router-dom";

const SideAreaTab = ({ logo, name, path, clickTab, chosenTab }) => {
  const navigate = useNavigate();
  const newBreadcrumb = useBreadCrumbStore((state) => state.newBreadcrumb);

  const handleClick = () => {
    clickTab();
    navigate(path);
    newBreadcrumb({ name, path });
  };

  return (
    <div
      className={`relative cursor-pointer hover:bg-base-200/5 group ${
        chosenTab?.name === name ? "bg-base-200/10" : "bg-white"
      }`}
    >
      {chosenTab && chosenTab.name === name && (
        <p className=" bg-base-200 h-full w-2 absolute top-0 rounded-r-md"></p>
      )}

      <div
        onClick={handleClick}
        className={`flex items-center gap-5 py-3 ml-10 ${
          chosenTab?.name === name ? "text-base-200" : "text-base-300"
        }`}
      >
        <span
          className={`text-[1.5rem] group-hover:text-base-200 ${
            chosenTab?.name === name ? "text-base-200" : "text-base-300"
          } `}
        >
          {logo}
        </span>
        <p
          className={`text-[0.9rem] group-hover:text-base-200 ${
            chosenTab?.name === name
              ? "text-base-200 font-medium"
              : "text-base-300"
          } `}
        >
          {name}
        </p>
      </div>
    </div>
  );
};

export default SideAreaTab;
