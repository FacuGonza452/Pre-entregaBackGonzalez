const express = require('express');
const fs = require('fs');

class ProductManager {
  constructor() {
    this.products = [];
    this.filePath = 'productos.txt';
    this.loadProducts();
  }

  generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }

  getProducts() {
    return this.products;
  }

  addProduct(productData) {
    if (this.products.some((product) => product.code === productData.code)) {
      throw new Error('El código de producto ya está en uso.');
    }

    productData.id = this.generateUniqueId();
    this.products.push(productData);
    this.saveProducts();
  }

  getProductById(id) {
    const product = this.products.find((product) => product.id === id);

    if (!product) {
      throw new Error('Producto no encontrado.');
    }

    return product;
  }

  updateProduct(id, updatedFields) {
    const productIndex = this.products.findIndex((product) => product.id === id);

    if (productIndex === -1) {
      throw new Error('Producto no encontrado.');
    }

    this.products[productIndex] = { ...this.products[productIndex], ...updatedFields };
    this.saveProducts();
  }

  deleteProduct(id) {
    const productIndex = this.products.findIndex((product) => product.id === id);

    if (productIndex === -1) {
      throw new Error('Producto no encontrado.');
    }

    this.products.splice(productIndex, 1);
    this.saveProducts();
  }

  loadProducts() {
    try {
      const data = fs.readFileSync(this.filePath, 'utf8');
      const lines = data.split('\n');
      this.products = lines
        .filter((line) => line.trim() !== '')
        .map((line) => JSON.parse(line));
    } catch (error) {
      // Manejo de errores al leer el archivo
    }
  }

  saveProducts() {
    const data = this.products.map((product) => JSON.stringify(product)).join('\n');
    fs.writeFileSync(this.filePath, data, 'utf8');
  }

  getAllProductsJSON() {
    return JSON.stringify(this.getProducts(), null, 2);
  }
}

const app = express();
const port = 8080;

app.use(express.json());

const manager = new ProductManager();

app.get('/api/products', (req, res) => {
  try {
    const productsJSON = manager.getAllProductsJSON();
    res.json(JSON.parse(productsJSON));
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

app.get('/api/products/:id', (req, res) => {
  const productId = req.params.id;

  try {
    const product = manager.getProductById(productId);
    res.json(product);
  } catch (error) {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

app.post('/api/products', (req, res) => {
  const newProductData = req.body;

  try {
    manager.addProduct(newProductData);
    res.json({ message: 'Producto agregado con éxito' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/products/:id', (req, res) => {
  const productId = req.params.id;
  const updatedFields = req.body;

  try {
    manager.updateProduct(productId, updatedFields);
    res.json({ message: 'Producto actualizado con éxito' });
  } catch (error) {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

app.delete('/api/products/:id', (req, res) => {
  const productId = req.params.id;

  try {
    manager.deleteProduct(productId);
    res.json({ message: 'Producto eliminado con éxito' });
  } catch (error) {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

app.listen(port, () => {
  console.log(`Servidor Express en ejecución en el puerto ${port}`);
});