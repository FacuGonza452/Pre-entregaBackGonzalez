const fs = require('fs');

class ProductManager {
  constructor() {
    this.products = [];
    this.filePath = 'productos.txt'; // Nombre del archivo donde se guardarán los productos
    this.loadProducts(); // Cargar productos existentes al iniciar la instancia
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
    this.saveProducts(); // Guardar productos después de agregar uno nuevo
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
    this.saveProducts(); // Guardar productos después de actualizar uno existente
  }

  deleteProduct(id) {
    const productIndex = this.products.findIndex((product) => product.id === id);

    if (productIndex === -1) {
      throw new Error('Producto no encontrado.');
    }

    this.products.splice(productIndex, 1);
    this.saveProducts(); // Guardar productos después de eliminar uno existente
  }

  loadProducts() {
    try {
      const data = fs.readFileSync(this.filePath, 'utf8');
      const lines = data.split('\n');
      this.products = lines
        .filter((line) => line.trim() !== '')
        .map((line) => JSON.parse(line));
    } catch (error) {
      // Si hay un error al leer el archivo (puede ser porque no existe), no hacer nada.
      // Puedes agregar más manejo de errores según tus necesidades.
    }
  }

  saveProducts() {
    const data = this.products.map((product) => JSON.stringify(product)).join('\n');
    fs.writeFileSync(this.filePath, data, 'utf8');
  }
}

const manager = new ProductManager();

// Agregar un producto
const nuevoProducto = {
  title: 'Iphone 11',
  description: 'Este es un producto prueba',
  price: 200,
  thumbnail: 'Sin imagen',
  code: 'abc123',
  stock: 25,
};

try {
  manager.addProduct(nuevoProducto);
  console.log('Producto agregado con éxito.');
} catch (error) {
  console.error('Error al agregar producto:', error.message);
}

// Llamar a getProducts nuevamente, ahora debe mostrar el producto recién agregado
console.log('Productos después de agregar:', manager.getProducts());

// Obtener un producto por ID
try {
  const productoEncontrado = manager.getProductById(nuevoProducto.id);
  console.log('Producto encontrado por ID:', productoEncontrado);
} catch (error) {
  console.error('Error al buscar producto por ID:', error.message);
}

// Actualizar un producto
try {
  const updatedFields = {
    title: 'Producto actualizado',
    description: 'Este es un producto actualizado',
    price: 250,
  };
  manager.updateProduct(nuevoProducto.id, updatedFields);
  console.log('Producto actualizado con éxito.');
} catch (error) {
  console.error('Error al actualizar producto:', error.message);
}

// Eliminar un producto
try {
  manager.deleteProduct(nuevoProducto.id);
  console.log('Producto eliminado con éxito.');
} catch (error) {
  console.error('Error al eliminar producto:', error.message);
}
