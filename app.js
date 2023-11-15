const express = require('express');
const fs = require('fs');

const app = express();
const port = 8080;

// Middleware para el manejo de JSON
app.use(express.json());

// Ruta para obtener todos los productos
app.get('/products', (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
  const products = JSON.parse(fs.readFileSync('products.json'));
  if (limit) {
    res.json(products.slice(0, limit));
  } else {
    res.json(products);
  }
});

// Ruta para obtener un producto por ID
app.get('/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const products = JSON.parse(fs.readFileSync('products.json'));
  const product = products.find(p => p.id === productId);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

app.listen(port, () => {
  console.log(`Servidor Express en ejecución en el puerto ${port}`);
});