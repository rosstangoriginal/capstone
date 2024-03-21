async function importPublicKey(pemKey) {
    // Remove PEM header and footer
    let pem = pemKey.replace('-----BEGIN PUBLIC KEY-----', '');
    pem = pem.replace('-----END PUBLIC KEY-----', '');
    // Remove line breaks, spaces, and newlines
    pem = pem.replace(/\s+/g, '');

    // Base64 decode
    const binaryDer = Uint8Array.from(atob(pem), c => c.charCodeAt(0));

    // Import the key to the CryptoKey object
    return window.crypto.subtle.importKey(
        'spki',
        binaryDer.buffer,
        {
            name: "RSA-OAEP",
            hash: "SHA-256",
        },
        true,
        ['encrypt']
    );
}

  
  
  export async function encryptWithPublicKey(publicKey, data) {
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(data);
    const encrypted = await window.crypto.subtle.encrypt(
      {
        name: "RSA-OAEP",
      },
      publicKey,
      encodedData
    );
    return window.btoa(String.fromCharCode.apply(null, new Uint8Array(encrypted)));
  }
  

  
  export async function encryptAndGenerateNonce(password, pemPublicKey, providedNonce) {
    try {
        const publicKey = await importPublicKey(pemPublicKey); // Import the public key
        const encryptedPassword = await encryptWithPublicKey(publicKey, password); // Encrypt the password
        const nonce = providedNonce; // Use the provided nonce instead of generating a new one
        return { encryptedPassword, nonce };
    } catch (error) {
        console.error('Error in encryption or nonce generation:', error);
        throw error;
    }
}


