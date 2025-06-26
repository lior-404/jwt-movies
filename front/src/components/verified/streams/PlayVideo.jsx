import React, { useState, useRef, useMemo, useEffect } from "react";

const VideoPlayer = ({ filename }) => {
  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const videoUrl = useMemo(() => {
    if (!filename) {
      return "";
    }

    try {
      const encodedFilename = encodeURIComponent(filename);
      return `${
        import.meta.env.VITE_API_ENDPOINT
      }streams/video/${encodedFilename}`;
    } catch (error) {
      console.error("Error encoding filename:", error);
      setError("Invalid filename");
      return "";
    }
  }, [filename]);

  const handleError = (e) => {
    const errorMessage =
      e.target.error?.message ||
      "An unknown error occurred while playing the video.";
    console.error("Video Error:", errorMessage);
    setError(errorMessage);
    setIsLoading(false);
  };

  useEffect(() => {
    setError(null);
    setIsLoading(true);

    if (videoRef.current) {
      videoRef.current.pause(); // Pause the current video
      videoRef.current.src = ""; // Clear the current video source
      videoRef.current.load(); // Reset the video element
    }

    if (filename && videoRef.current) {
      videoRef.current.src = videoUrl; // Update video source
      videoRef.current.oncanplay = () => {
        setIsLoading(false);
        setError(null);
        videoRef.current.play().catch((err) => {
          console.error("Error playing video:", err);
          setError("Unable to play the video.");
        });
      };

      videoRef.current.onerror = handleError; // Attach error handler
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.oncanplay = null;
        videoRef.current.onerror = null;
      }
    };
  }, [filename, videoUrl]);

  if (!filename) {
    return <div>No video filename provided</div>;
  }

  return (
    <div className="video-player-container">
      {isLoading && <div>Loading video...</div>}
      {error && <div className="error-message">{error}</div>}
      <video
        ref={videoRef}
        controls
        onLoadStart={() => setIsLoading(true)}
        style={{ maxWidth: "100%", width: "800px" }}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
