interface CryptoUtils {
  encryptString(input: string, password: string): string;
  decryptString(encryptedInput: string, password: string): string;
  createSha256Base64Hash(input: string): string;
}

export default CryptoUtils;
