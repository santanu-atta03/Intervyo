import fs from 'fs';
import path from 'path';
import https from 'https';

const BASE = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';
const MODELS = [
  'face_expression_model',
  'face_landmark_68_model',
  'face_recognition_model'
];

const outDir = path.resolve(process.cwd(), 'public', 'models');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

async function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (err) { reject(err); }
      });
    }).on('error', reject);
  });
}

async function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        file.close();
        fs.unlink(dest, () => {});
        return reject(new Error(`Failed to download ${url}. Status: ${res.statusCode}`));
      }
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

(async () => {
  try {
    for (const model of MODELS) {
      const manifestUrl = `${BASE}${model}-weights_manifest.json`;
      console.log('Fetching manifest:', manifestUrl);
      const manifest = await fetchJson(manifestUrl);

      // Save manifest
      const manifestPath = path.join(outDir, `${model}-weights_manifest.json`);
      fs.writeFileSync(manifestPath, JSON.stringify(manifest));

      // Download all referenced files
      // Manifest might be an array or object; normalize to an array
      const entries = Array.isArray(manifest) ? manifest : (manifest.weights || []);
      const files = entries.flatMap(e => e.paths || e.path || []);
      for (const f of files) {
        const fileUrl = `${BASE}${f}`;
        const destPath = path.join(outDir, path.basename(f));
        if (fs.existsSync(destPath)) {
          console.log('Skipping existing file:', destPath);
          continue;
        }
        console.log('Downloading', fileUrl, '->', destPath);
        await downloadFile(fileUrl, destPath);
      }
    }
    console.log('All models downloaded to', outDir);
  } catch (err) {
    console.error('Model download failed:', err);
    process.exit(1);
  }
})();
