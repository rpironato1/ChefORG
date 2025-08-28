// supabase/functions/_shared/stripe.ts
import Stripe from 'https://esm.sh/stripe@11.1.0';

export const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  // This is needed to use the Fetch API instead of Node's HTTP client.
  httpClient: Stripe.createFetchHttpClient(),
  apiVersion: '2022-11-15',
});
