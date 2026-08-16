import { NextResponse } from 'next/server';
import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret");

export async function POST(request: Request) {
  try {
    const { otp } = await request.json();
    
    const otpToken = (await cookies()).get('otp_token')?.value;

    if (!otpToken) {
      return NextResponse.json({ error: 'رمز التحقق منتهي الصلاحية. يرجى طلب رمز جديد.' }, { status: 400 });
    }

    try {
      const { payload } = await jwtVerify(otpToken, SECRET);
      
      if (payload.otp !== otp) {
        return NextResponse.json({ error: 'رمز التحقق غير صحيح.' }, { status: 400 });
      }

      // OTP is valid. Clear OTP token and set Admin token
      const cookieStore = await cookies();
      cookieStore.delete('otp_token');

      const adminToken = await new SignJWT({ admin: true })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('7d') // Session valid for 7 days
        .sign(SECRET);

      cookieStore.set('admin_session', adminToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });

      return NextResponse.json({ success: true, message: 'تم تسجيل الدخول بنجاح.' });

    } catch (err) {
      return NextResponse.json({ error: 'رمز التحقق غير صالح أو منتهي.' }, { status: 400 });
    }

  } catch (error: any) {
    return NextResponse.json({ error: 'حدث خطأ غير متوقع.' }, { status: 500 });
  }
}
