import { useState } from "react";
import { isValidNostrPublicKey, convertNpubToHex } from "../utils/nostrPubkeyValidator";
import { useRegisteredUsers } from "../hooks/useRegisteredUsers";
import { checkUsername } from "../utils/usernameValidator";
import pb from "../utils/pb";
import { nostrJsonUpdate } from "../utils/updateNostrRecords";

const Home = () => {
  const [pubKey, setPubKey] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);

  const users = useRegisteredUsers();

  const registerUser = async (e) => {
    e.preventDefault();

    const pubKeyError = isValidNostrPublicKey(pubKey, users);
    if (pubKeyError) {
      setError(pubKeyError);
      return;
    } 

    const usernameError = checkUsername(username, users);
    if (usernameError) {
      setError(usernameError);
      return;
    }

    setError(null);
    try {
      const hexKey = convertNpubToHex(pubKey);
      const securePass = crypto.randomUUID();

      const response = await pb.collection("users").create({
        username: username,
        email: username + "@stoned420.fun",
        nostr_pubkey: hexKey,
        password: securePass,
        passwordConfirm: securePass,
      });

      nostrJsonUpdate(username, hexKey);
      setPubKey("");
      setUsername("");

      alert("User registered successfully!");
    } 
    catch (error) {
      console.error("Error:", error);
      setError("Error registering user");
      return;
    }
    
    

    // try {
    //   const response = await fetch("/api/register", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ publicKey, username }),
    //   });

    //   if (response.ok) {
    //     alert("User registered successfully!");
    //   } else {
    //     alert("Error registering user");
    //   }
    // } catch (error) {
    //   console.error("Error:", error);
    //   alert("Error registering user");
    // }
  };
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      <header className="text-center space-y-4">
        <h1 className="text-5xl font-bold">zaps.lol</h1>
        <p className="text-lg text-gray-400">Free Nostr addresses for everyone</p>
      </header>

      {error && (
        <main className="mt-10 w-full max-w-md">
          <div className="bg-[#111] border border-gray-800 rounded-xl p-6 shadow-md">
            <p className="text-center text-gray-600">{error}</p>
          </div>
        </main>
      )}

      <main className="mt-10 w-full max-w-md">
        <div className="bg-[#111] border border-gray-800 rounded-xl p-6 shadow-md">
          <form className="flex flex-col space-y-4">
            <input
              type="text"
              value={pubKey}
              onChange={(e) => setPubKey(e.target.value)}
              placeholder="Enter you nostr public key"
              className="bg-black border border-gray-700 text-white placeholder-gray-500 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
                className="flex-1 max-w-[250px] bg-black border border-gray-700 text-white placeholder-gray-500 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <span className="text-gray-400">@stoned420.fun</span>
            </div>

            <button
              type="submit"
              onClick={registerUser}
              className="bg-purple-600 hover:bg-purple-700 transition-colors text-white font-semibold py-2 rounded"
            >
              Register
            </button>
          </form>
        </div>

        <p className="text-sm text-center text-gray-600 mt-4">Already have one? Use it on any Nostr client.</p>
      </main>

      <footer className="mt-16 text-sm text-gray-500">
        <a
          href="https://github.com/fiatjaf/zaps.lol"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-purple-400 underline"
        >
          View on GitHub
        </a>
      </footer>
    </div>
  );
};

export default Home;
