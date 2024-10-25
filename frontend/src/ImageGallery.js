import { useState } from "react";
import { ID, IMAGE_URL, NAME } from "./Contant";
import axios from "axios";

export default function ImageGallery() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [images, setImages] = useState([]);

  const handleDownload = async () => {
    if (!email) {
      setMessage("Please select a file and enter your email.");
      return;
    }
    setImages([]);
    try {
      //Send POST request to API Gateway
      const response = await axios.get(IMAGE_URL + `?email=${email}`);
      setImages(response.data);
    } catch (error) {
      console.error("Error downloading file:", error);
      setMessage("Download failed. Please try again.");
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
      <h2>Image Gallery</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <button onClick={handleDownload}>Search</button>
      <p>
        {message}
      </p>
      <div className="image-grid">
        {images.map((image, index) =>
          <div key={index} className="image-item">
            <img
              src={image.url}
              alt={`Uploaded on ${new Date(image.dateTime).toLocaleString()}`}
            />
            <p>
              Uploaded on: {new Date(image.dateTime).toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
