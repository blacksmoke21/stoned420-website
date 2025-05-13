import { useState } from "react";
import { isValidNostrPublicKey, convertNpubToHex } from "../utils/nostrPubkeyValidator";
import { useRegisteredUsers } from "../hooks/useRegisteredUsers";
import { checkUsername } from "../utils/usernameValidator";
import { nostrJsonUpdate } from "../utils/updateNostrRecords";
import pb from "../utils/pb";
import { validateLnUrl } from "../utils/lnUrlValidator";

const Home = () => {
  const [pubKey, setPubKey] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);
  const [lightningEnabled, setLightningEnabled] = useState(false);
  const [lightningAddress, setLightningAddress] = useState("");

  const users = useRegisteredUsers();

  const lightningAddressToggle = (e) => {
    e.preventDefault();
    setLightningEnabled((prev) => !prev);
  };

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

    if (lightningEnabled && !lightningAddress && lightningAddress.length < 1) {
      setError("Please enter a lightning address");
      return;
    }

    const lnUrlValidate = await validateLnUrl(lightningAddress);
    console.log("lnUrlValidate", lnUrlValidate);
    if (lnUrlValidate.type === "string") {
      setError(lnUrlValidate);
      return;
    }

    setError(null);

    await saveNostrRecord();
    await saveLnUrlRecord(lnUrlValidate);

    setPubKey("");
    setUsername("");
    setLightningAddress("");
  };

  const saveNostrRecord = async () => {
    const hexKey = convertNpubToHex(pubKey);
    const securePass = crypto.randomUUID();

    try {
      await pb.collection("users").create({
        username: username,
        email: username + "@stoned420.fun",
        nostr_pubkey: hexKey,
        ln_address: lightningAddress,
        password: securePass,
        passwordConfirm: securePass,
      });

      await nostrJsonUpdate(username, hexKey);
      alert("User registered successfully!");
    } catch (error) {
      console.error("Error:", error);
      setError("Error registering user");
    }
  };

  const saveLnUrlRecord = async (lnUrlData) => {
    const blob = new Blob([JSON.stringify(lnUrlData, null, 2)], {
      type: "application/json",
    });
    const file = new File([blob], username, { type: "application/json" });

    const formData = new FormData();
    formData.append("username", username);
    formData.append("ln_address", lightningAddress);
    formData.append("lnurl_file", file);

    try {
      const record = await pb.collection("ln_address_storage").create(formData);
      console.log("Upload successful:");
    } catch (err) {
      console.error("Upload failed:");
    }
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
            <p className="text-center text-red-600">Error: {error}.</p>
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

            <div className="flex items-center space-x-3 m-1">
              <span className="text-gray-400 text-lg">Use it as a lightning address also?</span>
              <button
                onClick={lightningAddressToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  lightningEnabled ? "bg-purple-500" : "bg-gray-300"
                }`}
                role="switch"
                aria-pressed={lightningEnabled}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    lightningEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {lightningEnabled && (
              <input
                type="text"
                value={lightningAddress}
                onChange={(e) => setLightningAddress(e.target.value)}
                placeholder="Enter your lightning address"
                className="my-2 bg-black border border-gray-700 text-white placeholder-gray-500 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            )}
            <button
              type="submit"
              onClick={registerUser}
              className="mt-4 bg-purple-600 hover:bg-purple-700 transition-colors text-white font-semibold py-2 rounded"
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
