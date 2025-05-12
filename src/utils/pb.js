import PocketBase from "pocketbase";

const pb = new PocketBase(import.meta.env.VITE_PB_URL || "http://127.0.0.1:8090");

if (import.meta.env.VITE_PB_EMAIL && import.meta.env.VITE_PB_PASSWORD) {
  await pb.collection("_superusers").authWithPassword(import.meta.env.VITE_PB_EMAIL, import.meta.env.VITE_PB_PASSWORD);
}

export default pb;