import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

const MONGO_URI = 'mongodb://localhost:27017/thecompendium';

const fileSchema = new mongoose.Schema({
  type: String, // 'image', 'pdf', etc.
  name: String,
  url: String,
  uploadedAt: { type: Date, default: Date.now }
});
const File = mongoose.model('File', fileSchema);

const publicDir = path.resolve('public');
const fileTypes = [
  { ext: ['.jpg', '.jpeg', '.png', '.gif', '.webp'], type: 'image' },
  { ext: ['.pdf'], type: 'pdf' }
];

function walkDir(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  });
  return fileList;
}

async function seedFiles() {
  await mongoose.connect(MONGO_URI);
  const allFiles = walkDir(publicDir);
  const docs = allFiles
    .filter(f => fileTypes.some(t => t.ext.includes(path.extname(f).toLowerCase())))
    .map(f => {
      const ext = path.extname(f).toLowerCase();
      const type = fileTypes.find(t => t.ext.includes(ext)).type;
      return {
        type,
        name: path.basename(f),
        url: f.replace(publicDir, '').replace(/\\/g, '/'),
      };
    });
  await File.insertMany(docs);
  console.log('Inserted', docs.length, 'files!');
  process.exit();
}

seedFiles(); 