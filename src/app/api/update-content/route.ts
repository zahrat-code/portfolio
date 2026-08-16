import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { locale, path: jsonPath, value, values, action } = await request.json();
    
    if (!jsonPath) {
      return NextResponse.json({ error: 'Path is required' }, { status: 400 });
    }

    const locales = ['ar', 'en', 'tr'];
    
    for (const loc of locales) {
      const filePath = path.join(process.cwd(), 'src', 'dictionaries', `${loc}.json`);
      try {
        const fileContents = await fs.readFile(filePath, 'utf8');
        const data = JSON.parse(fileContents);

        // Update deeply nested path
        let current = data;
        for (let i = 0; i < jsonPath.length - 1; i++) {
          if (!current[jsonPath[i]]) current[jsonPath[i]] = {};
          current = current[jsonPath[i]];
        }
        
        if (action === 'delete') {
          delete current[jsonPath[jsonPath.length - 1]];
        } else {
          const valToWrite = (values && values[loc] !== undefined) ? values[loc] : value;
          current[jsonPath[jsonPath.length - 1]] = valToWrite;
        }

        // Save file
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
      } catch (err: any) {
        console.error(`Failed to update locale: ${loc}`, err);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
