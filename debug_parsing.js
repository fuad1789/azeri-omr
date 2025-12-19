const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'public', '14.12.2025 -  SUMQAYIT (mərkəz) AŞAĞI SİNİF BİLİK YARIŞMASI - 1.txt');
const content = fs.readFileSync(filePath, 'utf-8');
// remove backticks if any
const clean = content.replace(/`/g, '');
const lines = clean.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);

const asyaLine = lines.find(l => l.includes('ASYA') && l.includes('MAHUDOVA'));

if (asyaLine) {
    console.log('Line found:');
    console.log(asyaLine);
    console.log('Length:', asyaLine.length);
    console.log('Char at 58:', `'${asyaLine[58]}'`);
    console.log('Char at 59:', `'${asyaLine[59]}'`);
    console.log('Char at 60:', `'${asyaLine[60]}'`);
    
    const slice59 = asyaLine.slice(59);
    console.log('Slice(59):', `'${slice59}'`);
    console.log('Slice(59) length:', slice59.length);
    console.log('Slice(59)[39]:', `'${slice59[39]}'`);
    
    const slice60 = asyaLine.slice(60);
    console.log('Slice(60):', `'${slice60}'`);
    console.log('Slice(60)[39]:', `'${slice60[39]}'`);
    
} else {
    console.log('Asya line not found');
}
