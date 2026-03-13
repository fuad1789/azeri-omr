const { MongoClient } = require('mongodb');

const branches = [
  {
    name: "Elmlər",
    address: "Hüseyn Cavid prospekti, 87-89, Bakı",
    phone: "+994 51 633-33-77",
    email: "marketing@dersenvi.az",
    mapUrl: "https://www.google.com/maps?q=Elmler+Metro+Baki&output=embed",
    displayOrder: 0,
    isActive: true,
  },
  {
    name: "Xətai",
    address: "Nəsrəddin Rəfiyev küçəsi, 82, Bakı",
    phone: "+994 51 633-33-77",
    email: "marketing@dersenvi.az",
    mapUrl: "https://www.google.com/maps?q=Xetai+Metro+Baki&output=embed",
    displayOrder: 1,
    isActive: true,
  },
  {
    name: "Gənclik",
    address: "9a, Ziya Bünyadov prospekti, Bakı",
    phone: "+994 51 633-33-77",
    email: "marketing@dersenvi.az",
    mapUrl: "https://www.google.com/maps?q=Genclik+Metro+Baki&output=embed",
    displayOrder: 2,
    isActive: true,
  },
];

async function seedBranches() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/azeriedu_local';
  
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log('MongoDB-yə qoşuldu');

    const db = client.db();
    const branchesCollection = db.collection('branches');

    // Əvvəlcə mövcud filialları təmizlə
    await branchesCollection.deleteMany({});
    console.log('Köhnə filiallar təmizləndi');

    // Yeni filialları əlavə et
    const result = await branchesCollection.insertMany(branches);
    console.log(`${result.insertedCount} filial uğurla əlavə edildi`);

    await client.close();
    console.log('Bağlandı');
  } catch (error) {
    console.error('Xəta:', error);
    process.exit(1);
  }
}

seedBranches();