import { useState, useEffect } from "react";
import logo from "../assets/logo.jpg";
import SideAreaTab from "./SideAreaTab";
import TABS_INFO from "./TabsInfo";
import { Button } from "./ui/button";
import { MdLogout } from "react-icons/md";
import useBreadCrumbStore from "@/state/breadcrumb";

const SideArea = () => {
  const [chosenTab, setChosenTab] = useState(TABS_INFO[0].tabs[0]);
  const newBreadcrumb = useBreadCrumbStore((state) => state.newBreadcrumb);

  useEffect(() => {
    newBreadcrumb(TABS_INFO[0].tabs[0]);
  }, []);

  // query for user info
  // get user role

  const handleClickTab = (tab) => {
    setChosenTab(tab);
  };

  return (
    <div className="min-w-[20em] border-r border-secondary-100/10 flex flex-col">
      <img className="w-[20em] mt-10 px-10" src={logo} />

      <div className="mb-auto">
        {TABS_INFO.map((tab) => (
          <div key={tab.name}>
            <p className="text-[0.8rem] text-base-300/80 mx-5 my-3">
              {tab.name}
            </p>
            {tab.tabs.map((tab, i) => (
              <SideAreaTab
                key={i}
                logo={tab.icon}
                name={tab.name}
                path={tab.route}
                clickTab={() => handleClickTab(tab)}
                chosenTab={chosenTab}
              />
            ))}
          </div>
        ))}
      </div>

      <Button
        variant="outline"
        className="flex items-center gap-3 mt-auto mx-7 mb-7 border border-accent-100 hover:bg-accent-100/10"
      >
        <MdLogout className="text-accent-100 " />
        <p className="text-accent-100 font-semibold">Logout</p>
      </Button>
    </div>
  );
};

export default SideArea;
