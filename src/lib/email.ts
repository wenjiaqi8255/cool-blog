import { Resend } from 'resend';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

const FROM_EMAIL = import.meta.env.RESEND_FROM_EMAIL ?? 'newsletter@resend.dev';

export async function sendConfirmationEmail(to: string): Promise<void> {
  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: [to],
    subject: 'You are subscribed to Cool Blog',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 500px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <tr>
            <td style="padding: 40px 30px;">
              <h1 style="margin: 0 0 20px 0; color: #111111; font-size: 24px; font-weight: 600;">
                Welcome to Cool Blog!
              </h1>
              <p style="margin: 0 0 16px 0; color: #333333; font-size: 16px; line-height: 1.5;">
                You have successfully subscribed to our newsletter.
              </p>
              <p style="margin: 0 0 32px 0; color: #666666; font-size: 14px; line-height: 1.5;">
                We will send you the latest articles and updates. No spam, just good content.
              </p>
              <hr style="border: none; border-top: 1px solid #eeeeee; margin: 0 0 24px 0;">
              <p style="margin: 0; color: #999999; font-size: 12px;">
                Cheers,<br>
                <strong style="color: #333333;">Cool Blog</strong>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  });

  if (error) {
    console.error('Failed to send confirmation email:', error);
    return;
  }

  console.log('Confirmation email sent:', data?.id);
}
