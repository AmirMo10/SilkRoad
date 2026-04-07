import type { SmsProvider } from "./types";

/**
 * Kavenegar adapter — stub.
 * Real implementation will hit https://api.kavenegar.com/v1/{API-KEY}/sms/send.json
 */
export const kavenegarProvider: SmsProvider = {
  name: "kavenegar",
  async send({ to, text }) {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[sms:kavenegar:stub] → ${to}: ${text}`);
      return { id: `stub-${Date.now()}` };
    }
    const apiKey = process.env.KAVENEGAR_API_KEY;
    if (!apiKey) throw new Error("KAVENEGAR_API_KEY not set");
    // TODO: fetch the real endpoint
    throw new Error("kavenegar adapter not yet implemented");
  },
};
