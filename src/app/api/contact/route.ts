import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'All fields (name, email, message) are required.' }, { status: 400 });
    }

    // Configure Mail Transporter using the same variables as the OTP system
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'alialzahrat387@gmail.com', // Sending directly to the user's email
      subject: `New Message from Portfolio Website: ${name}`,
      text: `You have received a new contact form message from your portfolio website:\n\n` +
            `Name: ${name}\n` +
            `Email: ${email}\n\n` +
            `Message:\n${message}\n`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #ddd; border-radius: 8px; direction: rtl; text-align: right;">
          <h2 style="color: #ea580c; border-bottom: 2px solid #ea580c; padding-bottom: 10px; margin-top: 0;">رسالة جديدة من موقع معرض الأعمال</h2>
          <p><strong>الاسم:</strong> ${name}</p>
          <p><strong>البريد الإلكتروني:</strong> <a href="mailto:${email}">${email}</a></p>
          <div style="margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-radius: 5px; border-right: 4px solid #ea580c;">
            <p style="margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 11px; color: #888; text-align: center;">هذه الرسالة أُرسلت تلقائياً من نظام الاتصال في معرض أعمالك.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Message sent successfully.' });
  } catch (error: any) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send message. Please try again later.' }, { status: 500 });
  }
}
