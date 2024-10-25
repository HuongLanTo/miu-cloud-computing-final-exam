import React, { useState } from "react";
import axios from "axios";
import { ID, IMAGE_URL, NAME } from "./Contant";
const ImageUploader = () => {
  const [file, setFile] = useState(null);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleFileChange = e => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file || !email) {
      setMessage("Please select a file and enter your email.");
      return;
    }

    try {
      const filename = encodeURIComponent(file.name);
      const contentType = file.type;

      // Send POST request to API Gateway
      const response = await axios.post(IMAGE_URL, {
        filename,
        contentType,
        email
      });

      const { uploadURL } = response.data;
      console.log(uploadURL, response.data);
      // Upload the file to S3 using the pre-signed URL
      await axios.put(uploadURL, file, {
        headers: { "Content-Type": file.type }
      });

      setMessage("Upload successful!");
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessage("Upload failed. Please try again.");
    }
  };

  return (
    <div>
      <div className="student-row">
        <div className="student-name">
          {NAME}
        </div>
        <div className="student-id">
          {ID}
        </div>
      </div>
      <h2>Upload Image</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      <p>
        {message}
      </p>
    </div>
  );
};

export default ImageUploader;
