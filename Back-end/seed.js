
const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Products.js');

console.log("Seed.js démarré");
console.log("MONGO_URI =", process.env.MONGO_URI);

const products = [
  { "name" : "AC1 Phone1", "type" : "phone", "price" : 200.05, "rating" : 3.8, "warranty_years" : 1, "available" : true },
  { "name" : "AC2 Phone2", "type" : "phone", "price" : 147.21, "rating" : 1, "warranty_years" : 3, "available" : false },
  { "name" : "AC3 Phone3", "type" : "phone", "price" : 150, "rating" : 2, "warranty_years" : 1, "available" : true },
  { "name" : "AC4 Phone4", "type" : "phone", "price" : 50.20, "rating" : 3, "warranty_years" : 2, "available" : true }
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connecté");

    await Product.deleteMany();
    console.log("Collection vidée");

    await Product.insertMany(products);
    console.log("Produits insérés");

    process.exit();
  })
  .catch(err => {
    console.error(" Erreur MongoDB :", err);
    process.exit(1);
  });


