import React, { useState } from "react";
import axios from "axios";

const PushUp = () => {
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState("");
  const [loading, setLoading] = useState(false); // loading state
  const [uploadStatus, setUploadStatus] = useState(""); // status message

  const handleVideoUpload = async (e) => {
    e.preventDefault();
    setUploadedVideoUrl("");
    setUploadStatus("");
    setLoading(true);

    const formData = new FormData();
    const videoFile = e.target.video.files[0];

    if (!videoFile) {
      alert("Please select a video to upload.");
      setLoading(false);
      return;
    }

    formData.append("video", videoFile);

    try {
      console.log("Uploading video...");

      const response = await axios.post(
        "http://127.0.0.1:8000/api/pushup-count/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const videoPath = response.data.processed_video_url;
    //   console.log('e',videoPath);
      console.log('e1',response);
      const fullUrl = `http://127.0.0.1:8000${videoPath}`;
      setUploadedVideoUrl(fullUrl);
      setUploadStatus("Upload successful!");

      console.log("Response:", response.data);
      console.log("Video available at:", fullUrl);
    } catch (error) {
      console.error("Error uploading video:", error);
      setUploadStatus("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Upload Video and View Result</h1>
      <form onSubmit={handleVideoUpload}>
        <input type="file" name="video" accept="video/*" required />
        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {loading && <p>Uploading your video, please wait...</p>}

      {uploadStatus && <p>{uploadStatus}</p>}

      {uploadedVideoUrl && (
        <div style={{ marginTop: "20px" }}>
          <h3>Uploaded Video:</h3>
          <video
            width="500"
            controls
            style={{
              border: "2px solid #ccc",
              borderRadius: "10px",
              padding: "5px",
            }}
          >
            <source src={uploadedVideoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
};

export default PushUp;
