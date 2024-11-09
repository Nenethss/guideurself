import { FaPenNib, FaUpload, FaLink } from "react-icons/fa";
import UploadField from "./UploadField";

const UploadContainer = () => {
  return (
    <div className="flex gap-10 max-w-[75em]">
      <input type="file" className="hidden" onChange={() => {}} />

      <UploadField
        icon={<FaPenNib className="text-[2rem] text-base-300" />}
        mainLabel="Write"
        subLabel="Write or copy-paste your document"
      />

      <UploadField
        icon={<FaUpload className="text-[2rem] text-base-300" />}
        mainLabel="Upload"
        subLabel="Upload PDF, Word, or PowerPoint files"
        handleUpload={() => {}}
      />

      <UploadField
        icon={<FaLink className="text-[2rem] text-base-300" />}
        mainLabel="Import"
        subLabel="Import website with text content"
      />
    </div>
  );
};

export default UploadContainer;
