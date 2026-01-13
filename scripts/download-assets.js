const fs = require('fs');
const https = require('https');
const http = require('http');

const assetsDir = './public/assets';
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// List of all image URLs from the codebase
const imageUrls = [
  // From app/home/page.tsx
  'http://127.0.0.1:3845/assets/d3dba0b0cb1feee304dbbd69afead3d2ea2ca879.svg',
  'http://127.0.0.1:3845/assets/5a5299a801da7c54ffba6f086126da822b7f3d1f.svg',
  'http://127.0.0.1:3845/assets/f3a44bf21a820f451f56656c46677978a048468f.svg',
  'http://127.0.0.1:3845/assets/ea397aae0fda15c2d2b2f304d688288d245d1b6b.png',
  'http://127.0.0.1:3845/assets/b99c41590a5feaa5041785b60fbacf2f2ec5ca09.svg',
  'http://127.0.0.1:3845/assets/5722dfd57d26be6ab9ad7aafc4df77851db93557.png',
  'http://127.0.0.1:3845/assets/c041de1bfc6f14fb2fef6597fa7ccd4a0a5ffa11.svg',
  'http://127.0.0.1:3845/assets/35ee8b307c0b6ed22a30894836ed033da0d084ec.svg',
  'http://127.0.0.1:3845/assets/c445f12b2fee3ee4f0d15b856d3a3bec2a88a67e.svg',
  'http://127.0.0.1:3845/assets/03cb4a3d8e358b8c0f7f60c02b34e9806db1d23c.svg',
  'http://127.0.0.1:3845/assets/d9e0664629c9c42a8b79c0330042e390131424a.svg',
  'http://127.0.0.1:3845/assets/bcca8611c13c7d4d7984956ef8e3b767746e25e3.svg',
  'http://127.0.0.1:3845/assets/510b053acd6d587b2a46ad5d59b8c6f2447ef746.svg',
  'http://127.0.0.1:3845/assets/d98fad8d700ba70833c1b8f6704460d4b18ed65a.svg',
  'http://127.0.0.1:3845/assets/9c21c4983baf1823547401a70629e40595547484.svg',
  'http://127.0.0.1:3845/assets/3314ee7e951cf05c9219dd4f684cede478100eef.svg',
  'http://127.0.0.1:3845/assets/27454c06bcdca23409bdb532def000ff6aefbaad.svg',
  'http://127.0.0.1:3845/assets/48c2ebf54d03ba399e58085e3e89303771894ccc.svg',
  'http://127.0.0.1:3845/assets/9103652f4fea6a21d0291308a1d4800e305af677.svg',
  'http://127.0.0.1:3845/assets/1b069213552349c1e15cb0744dc53c15e8776fb0.svg',
  'http://127.0.0.1:3845/assets/199d3b8eed878f2d44f30de2761792ac0a2c488c.svg',
  'http://127.0.0.1:3845/assets/b8e14bed1d6c5580ae7887218c884f1a1f7c1344.svg',
  'http://127.0.0.1:3845/assets/52fbe94b5cc076f546db8f789b24854d359a2d34.svg',
  'http://127.0.0.1:3845/assets/4a295a23c598139000af3f8a9340a2f864bf1b2a.svg',
  'http://127.0.0.1:3845/assets/58359145e422e32c536d702cc842d4ab0c72d501.svg',
  'http://127.0.0.1:3845/assets/9c1763aa72af8fa64092dd2b419069f16c179919.svg',
  'http://127.0.0.1:3845/assets/46b4c0c521b4102b5a13eb5ab65e9be46926b40c.png',
  'http://127.0.0.1:3845/assets/a703cfe4db5a2a6f7b3afecbf392320bcc7a032b.png',
  // From app/results/page.tsx
  'http://127.0.0.1:3845/assets/691e0080682678198e2ad1ac268e8e756fe5ba5a.svg',
  'http://127.0.0.1:3845/assets/7ebd0341fa75cd5678645adbf5c296a81ddeff14.svg',
  'http://127.0.0.1:3845/assets/82b87c21e69cdc28c62d7673b222136c94b71eb5.svg',
  'http://127.0.0.1:3845/assets/eeaaec72cc6e69d9ec5e8424c2d9a8492e8e43bf.svg',
  'http://127.0.0.1:3845/assets/245480856dd44b51e294e4e8e3c74450f151f129.svg',
  'http://127.0.0.1:3845/assets/acc2dbe8cf8469734c9f510c11d968d06cd8900a.svg',
  'http://127.0.0.1:3845/assets/12df63f461380acd17ca3177ac44359e76088a1a.svg',
  // From components/ui/Search/Search.tsx
  'http://127.0.0.1:3845/assets/ee0a40d38be0656746c619c76fff6975bd749a11.svg',
  'http://127.0.0.1:3845/assets/3f8c5ea9d474b3b369dbc1837797153b710ab70e.svg',
  'http://127.0.0.1:3845/assets/636f929860f83a62021c31013359b5bfe024f61d.svg',
  'http://127.0.0.1:3845/assets/b7045855ea0a4225ec990bfc3de6ddb0b7e8fdfe.svg',
  'http://127.0.0.1:3845/assets/13c0bec278ae1eec9d0317bb356d0e55cc2cdc29.svg',
  'http://127.0.0.1:3845/assets/28132a640da70bc7baf7405f44d665314f7b13c1.svg',
  'http://127.0.0.1:3845/assets/cb6a32382843a158aabd898d57dae9ef1e60d8e3.svg',
  'http://127.0.0.1:3845/assets/20360552a8af13849f6a0189eda38d4de8b3ede6.svg',
  'http://127.0.0.1:3845/assets/9efb35a720037b169504fa578936569d651daeb0.svg',
  'http://127.0.0.1:3845/assets/09653b56fbb076059ea55eb006249b1a181f073b.svg',
  'http://127.0.0.1:3845/assets/479a1aea3d0d8c233e3376d0d6624f71331dbc45.svg',
  'http://127.0.0.1:3845/assets/32ccd25a3105bb740ce5a547f7367865f77fe36c.svg',
];

function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(filepath);
    
    protocol.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Handle redirect
        return downloadFile(response.headers.location, filepath).then(resolve).catch(reject);
      }
      
      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(filepath);
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
      reject(err);
    });
  });
}

async function downloadAll() {
  console.log(`Downloading ${imageUrls.length} assets...`);
  
  for (const url of imageUrls) {
    const filename = url.split('/').pop();
    const filepath = `${assetsDir}/${filename}`;
    
    // Skip if already exists
    if (fs.existsSync(filepath)) {
      console.log(`✓ Already exists: ${filename}`);
      continue;
    }
    
    try {
      await downloadFile(url, filepath);
      console.log(`✓ Downloaded: ${filename}`);
    } catch (error) {
      console.error(`✗ Failed to download ${filename}:`, error.message);
    }
  }
  
  console.log('Done!');
}

downloadAll();



