import PanelLayout from "../layouts/PanelLayout";
import UploadContainer from "./UploadContainer";

const Documents = () => {
  // mode
  // use mutation
  return (
    <PanelLayout>
      <div className="space-y-8">
        <div>
          <div>
            <p className=" font-semibold text-[1.2rem] text-base-300">
              Create Documents
            </p>
            <p className="text-[0.85rem] text-secondary-100">
              Create a new document by writing, uploading an existing document
              or importing a webpage.
            </p>
          </div>
        </div>
        <UploadContainer />
      </div>

      <div className="space-y-8">
        <div>
          <div>
            <p className=" font-semibold text-[1.2rem] text-base-300">
              Recently Added
            </p>
            <p className="text-[0.85rem] text-secondary-100">
              This section lists the most recent documents uploaded to the
              system. You can review, edit, or manage these files to ensure they
              are properly prepared for use.
            </p>
          </div>
        </div>
      </div>
    </PanelLayout>
  );
};

export default Documents;
