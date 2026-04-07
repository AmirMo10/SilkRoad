export interface SmsProvider {
  name: string;
  send(input: { to: string; text: string }): Promise<{ id: string }>;
}
