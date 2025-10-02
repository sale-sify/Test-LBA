const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const Product = require('./models/Products')
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('API is running');
});



// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("MongoDB Atlas connected ✅");
  app.listen(5000, () => console.log("Server running on http://localhost:5000"));
})
.catch(err => console.error("MongoDB connection error",err));



// Route en GET pour la recuperation de donnees 
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch(err) {
        res.status(500).json({ error: "Erreur serveur" })
    }
});



// Route en POST pour ajouter un produit a la base de donnees 
app.post('/products', async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});



// Route en PUT pour la modification de donnees 
app.put('/products/:id', async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid ID' })
    }
    try {
        const modifiedProduct = await Product.findByIdAndUpdate(
            id, 
            req.body,
            { new: true, runValidators: true }
        );
        if (!modifiedProduct) return res.status(404).json({ error: 'Product not found' });
        res.json(modifiedProduct);
    } catch(err) {
        console.error(err.message);
        res.status(400).json({ error: 'MongoDB connection error' });
    }
});



// Route en DELETE pour la suppression de donnees 
app.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Product not found' })
    }
    try {
        const deletedProduct = await Product.findByIdAndDelete(id)
        if (!deletedProduct) {
            return res.status(404).json('Product not found');
        } else {
            res.status(200).json('Product deleted successfully')
        }
    } catch (err) {
        res.status(500).json('Internal error while deleting product')
    }
});

