import { nip19 } from "nostr-tools";

// Utility function to validate Nostr public keys
export const isValidNostrPublicKey = (pubkey, users) => {
  if (!users) return "Users not loaded";

  if (pubkey.length === 0) {
    return "Please enter your nostr public key.";
  }

  const pubkeyFormatNpub = /^npub[0-3][qpzry9x8gf2tvdw0s3jn54khce6mua7l]+/;
  const pubkeyFormatHex = /^[0-9a-f]{64}$/g;

  if (isNpub(pubkey)) {
    const isPubkeyValidNpub = pubkeyFormatNpub.test(pubkey);

    if (!isPubkeyValidNpub) {
      return "Invalid npub public key.";
    } else {
      const hexKey = convertNpubToHex(pubkey);
      if (!hexKey) {
        return "Invalid npub public key.";
      }
      else if (Object.values(users).includes(hexKey)) {
        return "Sorry, this pubkey is already taken.";
      }

      return false;
    }
  } else {
    const isPubkeyValidHex = pubkeyFormatHex.test(pubkey);

    if (!isPubkeyValidHex) {
      return "Invalid public key.";
    }
    else if (Object.values(users).includes(pubkey)) {
      return "Sorry, this pubkey is already taken.";
    }

    return false;
  }
};

const isNpub = (value) => value.startsWith("npub");

export const convertNpubToHex = (npub) => {
  try {
    const hexKeyObj = nip19.decode(npub);
    return hexKeyObj.data;
  } catch (error) {
    return false;
  }
};
