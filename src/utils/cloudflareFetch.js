export async function cloudflareFetch(endpointPath = "", method = "POST", payload = {}) {
  const token = localStorage.getItem("jwt");

  const response = await fetch(`https://nostr-login.plain-star-e516.workers.dev/${endpointPath}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, token }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}
