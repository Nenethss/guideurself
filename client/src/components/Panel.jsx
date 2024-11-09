import { Outlet } from "react-router-dom";
const Panel = () => {
  return (
    <div className="flex-1 bg-secondary-300">
      <Outlet />
    </div>
  );
};

export default Panel;
