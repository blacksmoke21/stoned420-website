function isValidLightningAddress(address) {
  const regex = /^[a-z0-9._%-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
  return regex.test(address);
}

function lightningAddressToUrl(address) {
  const [name, domain] = address.split("@");
  return `https://${domain}/.well-known/lnurlp/${name}`;
}

export async function validateLnUrl(address) {
  if (!isValidLightningAddress(address)) {
    return "Invalid Lightning address format";
  }

  const url = lightningAddressToUrl(address);
  const response = await fetch(url);
  if (!response.ok) {
    return "Failed to resolve LNURL";
  }

  const data = await response.json();
  if (!data || data.tag !== "payRequest" || !data.callback || !data.minSendable || !data.maxSendable) {
    return "Invalid LNURL-pay metadata";
  }

  return data;
}
