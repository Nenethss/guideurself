const UploadField = ({ icon, mainLabel, subLabel, handleUpload }) => {
  return (
    <div
      className="border border-secondary-100/30 flex-1 p-7 rounded-2xl cursor-pointer select-none"
      onClick={handleUpload}
    >
      <div className="mb-5 mt-2">{icon}</div>
      <p className="text-[1.1rem] font-medium mb-[0.1em]">{mainLabel}</p>
      <p className="text-[0.95rem] font-light">{subLabel}</p>
    </div>
  );
};

export default UploadField;
