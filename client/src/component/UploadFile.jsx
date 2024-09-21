import React, { useState } from "react";
import axios from "axios";
import logo from "../assets/logo.jpg";

const UploadFile = () => {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (
      selectedFile &&
      (selectedFile.type === "application/pdf" ||
        selectedFile.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        selectedFile.type.startsWith("image/"))
    ) {
      setFile(selectedFile);
    } else {
      alert("Please upload a valid PDF, DOCX, or image file.");
      setFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("document", file);

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:3030/file/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setText(response.data.text);
      setError(null);
    } catch (error) {
      console.log("Error uploading the file", error);
      setError(error.response?.data || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full  mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-center h-auto pb-4">
        <img src={logo} alt="technetwave-logo" className="w-72" />
      </div>
      <h2 className="text-2xl font-bold text-center mb-4">
        Upload Your Document
      </h2>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="file"
          className="border-2 border-blue-500 rounded-md p-2 focus:outline-none focus:border-blue-700"
          onChange={handleFileChange}
        />
        <button
          type="submit"
          className={`bg-blue-500 text-white font-semibold py-2 rounded-md transition duration-300 ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
          }`}
          disabled={!file || loading}
        >
          {loading ? "Processing..." : "Upload"}
        </button>
      </form>

      {text && (
        <div className="mt-6 p-4 border border-gray-300 rounded-md bg-gray-100">
          <h3 className="text-xl font-semibold">Extracted Text:</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{text}</p>
        </div>
      )}

      {error && (
        <p className="mt-4 text-red-600">
          Error:{" "}
          {typeof error === "string"
            ? error
            : "An error occurred during file upload."}
        </p>
      )}
    </div>
  );
};

export default UploadFile;
