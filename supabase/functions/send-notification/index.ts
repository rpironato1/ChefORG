// supabase/functions/send-notification/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { twilio } from '../_shared/twilio.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { to, body } = await req.json();

    if (!to || !body) {
      throw new Error('"to" and "body" are required.');
    }

    const message = await twilio.messages.create({
      body: body,
      from: Deno.env.get('TWILIO_FROM_NUMBER'), // Seu número Twilio
      to: to, // Número do destinatário
    });

    return new Response(
      JSON.stringify({ success: true, sid: message.sid }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});