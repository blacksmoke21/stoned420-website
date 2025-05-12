import React, { useState } from "react";
import pb from "./utils/pb";

const COLLECTION_ID = "storage";
const RECORD_ID = "w5o14vb6i5969vy"; // or use the actual ID you created

function App() {
  const [input, setInput] = useState("");
  const [url, setUrl] = useState("");

  const handleSubmit = async () => {
    // 1. Get existing file
    const record = await pb.collection(COLLECTION_ID).getOne(RECORD_ID);
    const fileUrl = pb.files.getURL(record, record.file);
    setUrl(fileUrl);

    const res = await fetch(fileUrl);
    const currentData = await res.json();

    // 2. Append new text
    const updatedData = [...currentData, { text: input, date: new Date().toISOString() }];

    // 3. Convert to Blob and create new File
    const blob = new Blob([JSON.stringify(updatedData, null, 2)], {
      type: "application/json",
    });
    const file = new File([blob], "data.json", { type: "application/json" });

    // 4. Update record (overwrite file)
    const formData = new FormData();
    formData.append("file", file);

    const updatedRecord = await pb.collection(COLLECTION_ID).update(RECORD_ID, formData);
    const latestUrl = pb.files.getURL(updatedRecord, updatedRecord.file) + "?" + Date.now();
    setUrl(latestUrl);

    setInput("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Append Text to Shared JSON</h2>
      <textarea
        rows="5"
        cols="50"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <br />
      <button onClick={handleSubmit}>Submit</button>
      {url && (
        <div>
          <p>JSON File URL:</p>
          <a href={url} target="_blank" rel="noreferrer">
            {url}
          </a>
        </div>
      )}
    </div>
  );
}

export default App;
