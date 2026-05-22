import React, { useRef, useState } from "react";

function App() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [images, setImages] = useState([]);
  const [status, setStatus] = useState("Camera not started");

  const [participantId, setParticipantId] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");

  const [label, setLabel] = useState(
    "Right Palm - Back Camera - 1"
  );

  const labels = [
    "Right Palm - Back Camera - 1",
    "Right Palm - Back Camera - 2",
    "Right Palm - Back Camera - 3",
    "Right Palm - Front Camera - 1",
    "Right Palm - Front Camera - 2",
    "Right Palm - Front Camera - 3",
    "Left Palm - Back Camera - 1",
    "Left Palm - Back Camera - 2",
    "Left Palm - Back Camera - 3",
    "Left Palm - Front Camera - 1",
    "Left Palm - Front Camera - 2",
    "Left Palm - Front Camera - 3",
  ];

  // START CAMERA
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      const video = videoRef.current;

      video.srcObject = stream;

      video.onloadedmetadata = async () => {
        await video.play();
        setStatus("Camera started ✅");
      };
    } catch (err) {
      console.log(err);
      setStatus("Camera blocked ❌");
    }
  };

  // CAPTURE IMAGE
  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video.srcObject) {
      alert("Please start camera first");
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");

    ctx.drawImage(video, 0, 0);

    const imageData = canvas.toDataURL("image/png");

    const newImage = {
      label,
      image: imageData,
    };

    setImages((prev) => [...prev, newImage]);

    // AUTO NEXT LABEL
    const currentIndex = labels.indexOf(label);

    if (currentIndex < labels.length - 1) {
      setLabel(labels[currentIndex + 1]);
    }
  };

  // DELETE IMAGE
  const deleteImage = (index) => {
    const updated = [...images];
    updated.splice(index, 1);
    setImages(updated);
  };

  // DOWNLOAD DATASET
  const downloadData = () => {
    const dataset = {
      participantId,
      age,
      gender,
      totalImages: images.length,
      images,
    };

    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(dataset, null, 2));

    const link = document.createElement("a");

    link.href = dataStr;
    link.download = "palm_dataset.json";

    link.click();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to right, #020617, #0f172a, #020617)",
        color: "white",
        padding: "30px",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "auto",
          background: "#1e293b",
          padding: "35px",
          borderRadius: "25px",
          boxShadow: "0px 0px 30px rgba(0,0,0,0.5)",
        }}
      >
        {/* HEADER */}
        <h1
          style={{
            textAlign: "center",
            fontSize: "42px",
            marginBottom: "10px",
          }}
        >
          AI Palm Dataset Collection System
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#94a3b8",
            fontSize: "18px",
            marginBottom: "30px",
          }}
        >
          Professional AI Research Data Collection Tool
        </p>

        {/* GUIDELINES */}
        <div
          style={{
            background: "#334155",
            padding: "20px",
            borderRadius: "15px",
            marginBottom: "25px",
          }}
        >
          <h3 style={{ marginBottom: "10px" }}>
            Capture Guidelines
          </h3>

          <ul style={{ lineHeight: "1.8" }}>
            <li>Palm should occupy 50% of frame</li>
            <li>Avoid blurry images</li>
            <li>Use different backgrounds</li>
            <li>No mirrored images</li>
            <li>Ensure proper lighting</li>
          </ul>
        </div>

        {/* PARTICIPANT FORM */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "15px",
            marginBottom: "25px",
          }}
        >
          <input
            placeholder="Participant ID"
            value={participantId}
            onChange={(e) =>
              setParticipantId(e.target.value)
            }
            style={inputStyle}
          />

          <input
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            style={inputStyle}
          />

          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            style={inputStyle}
          >
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>

        {/* STATUS */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "15px",
            fontWeight: "bold",
            fontSize: "18px",
          }}
        >
          {status}
        </div>

        {/* VIDEO */}
        <div style={{ textAlign: "center" }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              width: "500px",
              maxWidth: "100%",
              borderRadius: "18px",
              border: "4px solid #38bdf8",
              background: "black",
            }}
          />
        </div>

        {/* LABEL SELECT */}
        <div
          style={{
            marginTop: "25px",
            textAlign: "center",
          }}
        >
          <select
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            style={{
              padding: "14px",
              width: "380px",
              borderRadius: "12px",
              border: "none",
              fontSize: "16px",
            }}
          >
            {labels.map((item, index) => (
              <option key={index}>{item}</option>
            ))}
          </select>
        </div>

        {/* BUTTONS */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            marginTop: "30px",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={startCamera}
            style={buttonBlue}
          >
            Start Camera
          </button>

          <button
            onClick={captureImage}
            style={buttonGreen}
          >
            Capture Palm
          </button>

          <button
            onClick={downloadData}
            style={buttonOrange}
          >
            Download Dataset
          </button>
        </div>

        {/* PROGRESS */}
        <div
          style={{
            marginTop: "30px",
          }}
        >
          <div
            style={{
              textAlign: "center",
              marginBottom: "10px",
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            Dataset Progress: {images.length} / 12
          </div>

          <div
            style={{
              width: "100%",
              background: "#334155",
              borderRadius: "20px",
              overflow: "hidden",
              height: "22px",
            }}
          >
            <div
              style={{
                width: `${(images.length / 12) * 100}%`,
                background: "#22c55e",
                height: "100%",
                transition: "0.5s",
              }}
            ></div>
          </div>
        </div>

        {/* SUMMARY */}
        <div
          style={{
            background: "#334155",
            padding: "20px",
            borderRadius: "15px",
            marginTop: "30px",
          }}
        >
          <h3>Dataset Summary</h3>

          <p>Total Images: {images.length}</p>
          <p>
            Participant ID: {participantId || "N/A"}
          </p>
          <p>Age: {age || "N/A"}</p>
          <p>Gender: {gender || "N/A"}</p>
        </div>

        {/* IMAGE GRID */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
            marginTop: "35px",
          }}
        >
          {images.map((item, index) => (
            <div
              key={index}
              style={{
                background: "#334155",
                padding: "12px",
                borderRadius: "15px",
                boxShadow:
                  "0px 4px 12px rgba(0,0,0,0.3)",
              }}
            >
              <img
                src={item.image}
                alt="palm"
                style={{
                  width: "100%",
                  borderRadius: "10px",
                }}
              />

              <p
                style={{
                  marginTop: "10px",
                  fontSize: "14px",
                  textAlign: "center",
                }}
              >
                {item.label}
              </p>

              <button
                onClick={() => deleteImage(index)}
                style={{
                  marginTop: "10px",
                  width: "100%",
                  padding: "10px",
                  background: "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        {/* HIDDEN CANVAS */}
        <canvas
          ref={canvasRef}
          style={{ display: "none" }}
        />
      </div>
    </div>
  );
}

// INPUT STYLE
const inputStyle = {
  padding: "14px",
  borderRadius: "12px",
  border: "none",
  fontSize: "15px",
};

// BUTTON STYLES
const buttonBlue = {
  padding: "14px 28px",
  borderRadius: "12px",
  border: "none",
  background: "#0ea5e9",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "15px",
  transition: "0.3s",
  boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
};

const buttonGreen = {
  padding: "14px 28px",
  borderRadius: "12px",
  border: "none",
  background: "#22c55e",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "15px",
  transition: "0.3s",
  boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
};

const buttonOrange = {
  padding: "14px 28px",
  borderRadius: "12px",
  border: "none",
  background: "#f59e0b",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "15px",
  transition: "0.3s",
  boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
};

export default App;