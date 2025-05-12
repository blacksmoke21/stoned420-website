import { cloudflareFetch } from "../utils/cloudflareFetch";
import pb from "../utils/pb";

const Header = () => {
  const handleNostrLogin = async () => {
    if (!window.nostr) {
      alert("Please install a Nostr extension.");
      return;
    }

    const pubkey = await window.nostr.getPublicKey();
    const challenge = `Login to MyApp @ ${Date.now()}`;
    const signedEvent = await window.nostr.signEvent({
      kind: 1,
      created_at: Math.floor(Date.now() / 1000),
      tags: [],
      content: challenge,
      pubkey,
    });

    const res = await fetch("https://nostr-login.plain-star-e516.workers.dev", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pubkey, challenge, signedEvent }),
    });

    const data = await res.json();
    if (data.token) {
      localStorage.setItem("jwt", data.token);
      // pb.authStore.save(data.token, data.user);
      alert("Logged in!");
    } else {
      alert(data.message || "Login failed.");
    }
  };

  async function getMyUserData() {
  try {
    const result = await cloudflareFetch(""); // or "verify" if you route it like that
    console.log("User verified:", result.user);
    await pb.collection('posts').create({ title: "title", content: "content", });
  } catch (err) {
    console.error("Token invalid or expired:", err.message);
  }
  }

  

  return (
    <div>
      <button onClick={handleNostrLogin}>Login with Nostr</button>
      <button onClick={getMyUserData}>Get username</button>
    </div>
  );
};
export default Header;
