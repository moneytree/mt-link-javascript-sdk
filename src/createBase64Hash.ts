export async function createBase64Hash(string: string) {
  const msgBuffer = new TextEncoder().encode(string);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashString = hashArray.map((b) => String.fromCharCode(b)).join('');

  return btoa(hashString).split('=')[0];
}
