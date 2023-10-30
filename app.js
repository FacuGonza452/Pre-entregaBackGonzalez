class ProductManager {
    constructor() {
    this.products = [];
    }

    generateUniqueId() {
      // Genera un ID único basado en la marca de tiempo (timestamp)
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }

    getProducts() {
    return this.products;
    }

    addProduct(productData) {
      // Verifica si el código ya existe en algún producto
        if (this.products.some((product) => product.code === productData.code)) {
        throw new Error('El código de producto ya está en uso.');
    }

      // Genera un ID único para el producto
    productData.id = this.generateUniqueId();

      // Agrega el producto al arreglo de productos
    this.products.push(productData);
    }

    getProductById(id) {
    const product = this.products.find((product) => product.id === id);

    if (!product) {
        throw new Error('Producto no encontrado.');
    }

        return product;
    }
}

  // Crear una instancia de ProductManager
const manager = new ProductManager();

  // Llamar a getProducts,arreglo vacío
    console.log('Productos iniciales:', manager.getProducts());

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
}   catch (error) {
    console.error('Error al agregar producto:', error.message);
}


console.log('Productos después de agregar:', manager.getProducts());

// Intentar agregar el mismo producto nuevamente (error)
try {
manager.addProduct(nuevoProducto);
console.log('Producto agregado con éxito.');
} catch (error) {
    console.error('Error al agregar producto:', error.message);
}

  // Obtener un producto por ID
try {
    const productoEncontrado = manager.getProductById(nuevoProducto.id);
    console.log('Producto encontrado por ID:', productoEncontrado);
} catch (error) {
    console.error('Error al buscar producto por ID:', error.message);
}