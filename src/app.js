const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8080;

// Configura el sistema de archivos
const productosFilePath = path.join(__dirname, 'productos.json');
const carritosFilePath = path.join(__dirname, 'carrito.json');

// Middleware para manejar datos JSON en las solicitudes
app.use(express.json());

// Función para leer el archivo de productos
function leerProductosDesdeArchivo() {
  try {
    const data = fs.readFileSync(productosFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // Si ocurre un error (por ejemplo, el archivo no existe), devuelve un array vacío
    return [];
  }
}

// Función para escribir en el archivo de productos
function escribirProductosEnArchivo(productos) {
  const data = JSON.stringify(productos, null, 2);
  fs.writeFileSync(productosFilePath, data, 'utf-8');
}

// Función para leer el archivo de carritos
function leerCarritosDesdeArchivo() {
  try {
    const data = fs.readFileSync(carritosFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // Si ocurre un error devuelve un array vacío
    return [];
  }
}

// Función para escribir en el archivo de carritos
function escribirCarritosEnArchivo(carritos) {
  const data = JSON.stringify(carritos, null, 2);
  fs.writeFileSync(carritosFilePath, data, 'utf-8');
}

// Obtener todos los productos
app.get('/api/products', (req, res) => {
  const productos = leerProductosDesdeArchivo();
  res.json(productos);
});

// Obtener un producto por ID
app.get('/api/products/:pid', (req, res) => {
  const productId = req.params.pid;
  const productos = leerProductosDesdeArchivo();
  const product = productos.find(producto => producto.id === productId);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

// Crear un nuevo producto
app.post('/api/products', (req, res) => {
  const { title, description, code, price, stock, category, thumbnails } = req.body;

  if (!title || !description || !code || !price || !stock || !category) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios, excepto thumbnails' });
  }

  const newProductId = Math.random().toString(36).substr(2, 9);
  const newProduct = {
    id: newProductId,
    title,
    description,
    code,
    price,
    status: true,
    stock,
    category,
    thumbnails: thumbnails || [],
  };

  const productos = leerProductosDesdeArchivo();
  productos.push(newProduct);
  escribirProductosEnArchivo(productos);

  res.status(201).json(newProduct);
});

// Actualizar un producto por ID
app.put('/api/products/:pid', (req, res) => {
  const productId = req.params.pid;
  const updatedFields = req.body;

  const productos = leerProductosDesdeArchivo();
  const existingProduct = productos.find(producto => producto.id === productId);

  if (!existingProduct) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  const updatedProduct = { ...existingProduct, ...updatedFields };
  const updatedProducts = productos.map(producto => (producto.id === productId ? updatedProduct : producto));
  escribirProductosEnArchivo(updatedProducts);

  res.json(updatedProduct);
});

// Eliminar un producto por ID
app.delete('/api/products/:pid', (req, res) => {
  const productId = req.params.pid;

  const productos = leerProductosDesdeArchivo();
  const remainingProducts = productos.filter(producto => producto.id !== productId);
  escribirProductosEnArchivo(remainingProducts);

  res.json({ message: 'Producto eliminado exitosamente' });
});

// Obtener productos de un carrito por ID
app.get('/api/carts/:cid', (req, res) => {
  const cartId = req.params.cid;
  const carritos = leerCarritosDesdeArchivo();
  const existingCart = carritos.find(carrito => carrito.id === cartId);

  if (!existingCart) {
    return res.status(404).json({ error: 'Carrito no encontrado' });
  }

  res.json(existingCart.products);
});

// Agregar un producto a un carrito por ID
app.post('/api/carts/:cid/product/:pid', (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const { quantity } = req.body;

  const carritos = leerCarritosDesdeArchivo();
  const existingCart = carritos.find(carrito => carrito.id === cartId);

  if (!existingCart) {
    return res.status(404).json({ error: 'Carrito no encontrado' });
  }

  const existingProduct = existingCart.products.find(item => item.product === productId);

  if (existingProduct) {
    existingProduct.quantity += quantity || 1;
  } else {
    existingCart.products.push({
      product: productId,
      quantity: quantity || 1,
    });
  }

  escribirCarritosEnArchivo(carritos);

  res.json(existingCart);
});

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});