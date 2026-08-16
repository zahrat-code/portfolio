import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const fileName = formData.get('fileName') as string;
    
    if (!file || !fileName) {
      return NextResponse.json({ error: 'File and fileName are required.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to public directory
    const filePath = path.join(process.cwd(), 'public', fileName);
    await writeFile(filePath, buffer);
    
    return NextResponse.json({ message: 'File uploaded successfully', url: `/${fileName}` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
