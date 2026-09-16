import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    let fileName = formData.get('fileName') as string;
    
    if (!file) {
      return NextResponse.json({ error: 'File is required.' }, { status: 400 });
    }

    if (!fileName) {
      const ext = path.extname(file.name) || '.jpg';
      fileName = `projects/project-${Date.now()}${ext}`;
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to public directory
    const filePath = path.join(process.cwd(), 'public', fileName);
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, buffer);
    
    const cleanUrl = fileName.startsWith('/') ? fileName : `/${fileName}`;
    return NextResponse.json({ message: 'File uploaded successfully', url: cleanUrl });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
