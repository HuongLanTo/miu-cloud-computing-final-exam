import { useState } from "react";
import { ID, IMAGE_URL, NAME } from "./Contant";
import axios from "axios";

export default function DatabaseQuery() {
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
      <h2>Database Query</h2>
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
      <div className="container">
        {images.map((item, index) =>
          <div key={index} className="item">
            <p className="item-title">
              Email: {item.email}
            </p>
            <p>
              Date: {new Date(item.dateTime).toLocaleString()}
            </p>
            <p className="item-url">
              Image File Name: {item.imageFileName}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
