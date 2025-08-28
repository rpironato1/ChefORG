// supabase/functions/_shared/twilio.ts
import { Twilio } from 'https://esm.sh/twilio';

const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');

if (!accountSid || !authToken) {
  throw new Error('Twilio credentials are not set in environment variables.');
}

export const twilio = new Twilio(accountSid, authToken);
