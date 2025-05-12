import pb from "./pb";

const COLLECTION_ID = "storage";
const RECORD_ID = "w5o14vb6i5969vy"; // or use the actual ID you created

export const nostrJsonUpdate = async (username, pubKey) => {
  // 1. Get existing file
  const record = await pb.collection(COLLECTION_ID).getOne(RECORD_ID);
  const fileUrl = pb.files.getURL(record, record.file);

  const res = await fetch(fileUrl);
  const currentData = await res.json();

  // 2. Append new text
  const newRecord = {[username]: pubKey};
  const updatedData = {
    names: {
      ...currentData.names,
      ...newRecord,
    },
  };

  // 3. Convert to Blob and create new File
  const blob = new Blob([JSON.stringify(updatedData, null, 2)], {
    type: "application/json",
  });
  const file = new File([blob], "nostr.json", { type: "application/json" });

  // 4. Update record (overwrite file)
  const formData = new FormData();
  formData.append("file", file);
  await pb.collection(COLLECTION_ID).update(RECORD_ID, formData);
};
