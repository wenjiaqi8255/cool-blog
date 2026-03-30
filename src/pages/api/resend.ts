import type { APIRoute } from 'astro';
import { z } from 'zod';
import { db, schema } from '../../db';
import { eq } from 'drizzle-orm';
import { sendConfirmationEmail } from '../../lib/email';

export const prerender = false;

const resendSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const result = resendSchema.safeParse(body);

    if (!result.success) {
      return new Response(
        JSON.stringify({ success: false, error: 'Please enter a valid email address' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { email } = result.data;

    const [subscriber] = await db
      .select()
      .from(schema.subscribers)
      .where(eq(schema.subscribers.email, email))
      .limit(1);

    if (!subscriber) {
      return new Response(
        JSON.stringify({ success: false, error: 'Email not found in our subscriber list' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await db
      .update(schema.subscribers)
      .set({ confirmationSentAt: new Date() })
      .where(eq(schema.subscribers.email, email));

    await sendConfirmationEmail(email);

    return new Response(
      JSON.stringify({ success: true, message: 'Confirmation email resent' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    console.error('Resend confirmation error:', error);

    return new Response(
      JSON.stringify({ success: false, error: 'Something went wrong. Please try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
