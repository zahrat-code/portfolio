import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret");

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    if (email !== process.env.EMAIL_USER || password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' }, { status: 401 });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Send Email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Sending to themselves
      subject: 'رمز التحقق للدخول إلى لوحة التحكم',
      text: `رمز التحقق الخاص بك هو: ${otp}\nهذا الرمز صالح لمدة 5 دقائق.`,
    };

    await transporter.sendMail(mailOptions);

    // Create a temporary token containing the valid OTP, valid for 5 minutes
    const otpToken = await new SignJWT({ otp })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('5m')
      .sign(SECRET);

    // Set cookie
    (await cookies()).set('otp_token', otpToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 5, // 5 minutes
      path: '/',
    });

    return NextResponse.json({ success: true, message: 'تم إرسال رمز التحقق إلى بريدك الإلكتروني.' });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'حدث خطأ أثناء إرسال البريد.' }, { status: 500 });
  }
}
