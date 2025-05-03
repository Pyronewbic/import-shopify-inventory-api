import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export async function downloadImage(imageUrl: string, folder = './images'): Promise<string> {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }

  const ext = path.extname(imageUrl).split('?')[0];
  const filename = `${uuidv4()}${ext}`;
  const filePath = path.join(folder, filename);

  const writer = fs.createWriteStream(filePath);
  const response = await axios.get(imageUrl, { responseType: 'stream' });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', () => resolve(filePath));
    writer.on('error', reject);
  });
}