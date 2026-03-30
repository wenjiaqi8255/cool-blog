import type { APIRoute } from 'astro';
import { z } from 'zod';
import { createSubscriber } from '../../lib/db';
import { sendConfirmationEmail } from '../../lib/email';
import { DUPLICATE_ERROR } from '../../lib/db';

// Note: In production, add to astro.config.js:
// routes: { extend: { include: [{ pattern: '/api/*' }] } }

const subscribeSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const result = subscribeSchema.safeParse(body);

    if (!result.success) {
      return new Response(
        JSON.stringify({ success: false, error: 'Please enter a valid email address' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { email } = result.data;

    await createSubscriber(email);
    await sendConfirmationEmail(email);

    return new Response(
      JSON.stringify({ success: true, message: 'Successfully subscribed' }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);

    if (message === DUPLICATE_ERROR) {
      return new Response(
        JSON.stringify({ success: false, error: 'This email is already subscribed' }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.error('Subscription error:', error);

    return new Response(
      JSON.stringify({ success: false, error: 'Something went wrong. Please try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
