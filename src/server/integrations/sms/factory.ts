import type { SmsProvider } from "./types";
import { kavenegarProvider } from "./kavenegar";

export function getSmsProvider(): SmsProvider {
  const name = process.env.SMS_PROVIDER ?? "kavenegar";
  switch (name) {
    case "kavenegar":
      return kavenegarProvider;
    default:
      throw new Error(`Unknown SMS provider: ${name}`);
  }
}
