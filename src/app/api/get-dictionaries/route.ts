import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    const locales = ['ar', 'en', 'tr'];
    const result: any = {};
    for (const loc of locales) {
      const filePath = path.join(process.cwd(), 'src', 'dictionaries', `${loc}.json`);
      const fileContents = await fs.readFile(filePath, 'utf8');
      result[loc] = JSON.parse(fileContents);
    }
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Failed to read dictionaries", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
