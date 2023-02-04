import crypto from "crypto";
import logger from "../logger";
import CryptoUtils from "./cryptoUtils";

const TAG = "CryptoUtilsImpl";

class CryptoUtilsImpl implements CryptoUtils {
  private static ENCRYPTION_ALGORITHM = "aes-256-cbc";

  encryptString(input: string, password: string): string {
    try {
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv(CryptoUtilsImpl.ENCRYPTION_ALGORITHM, password, iv);
      let encrypted = cipher.update(input, "utf8", "hex");
      encrypted += cipher.final("hex");
      return `${iv.toString("hex")}:${encrypted}`;
    } catch (e: any) {
      logger.logError(TAG, e);
      throw e;
    }
  }

  decryptString(encryptedInput: string, password: string): string {
    try {
      const parts = encryptedInput.split(":");
      const iv = Buffer.from(parts.shift()!!, "hex");
      const decipher = crypto.createDecipheriv(CryptoUtilsImpl.ENCRYPTION_ALGORITHM, password, iv);
      let decrypted = decipher.update(parts.join(":"), "hex", "utf8");
      decrypted += decipher.final("utf8");
      return decrypted;
    } catch (e: any) {
      logger.logError(TAG, e);
      throw e;
    }
  }

  createSha256Base64Hash(input: string): string {
    try {
      return crypto.createHash("sha256").update(input).digest("base64");
    } catch (e: any) {
      logger.logError(TAG, e);
      throw e;
    }
  }
}

export default CryptoUtilsImpl;
