const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'public', '14.12.2025 -  SUMQAYIT (mərkəz) AŞAĞI SİNİF BİLİK YARIŞMASI - 1.txt');
const content = fs.readFileSync(filePath, 'utf-8');
const clean = content.replace(/`/g, '');
const lines = clean.split(/\r?\n/).map(l => l.trimEnd()).filter(l => l.length > 0); // TrimEnd only

const asyaLine = lines.find(l => l.includes('ASYA') && l.includes('MAHUDOVA'));

if (asyaLine) {
    console.log('Line: ' + asyaLine);
    console.log('Total Length: ' + asyaLine.length);
    for (let i = 50; i < 65; i++) {
        console.log(`Index ${i}: '${asyaLine[i]}'`);
    }
} else {
    console.log('Not found');
}
