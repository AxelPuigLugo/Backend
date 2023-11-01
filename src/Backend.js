const fs = require('fs'); 

class ProductManager {
  constructor(path) {
    this.products = [];
    this.productIdCounter = 1;
    this.path = path;
  }

  addProduct(product) {
    if (!product.nombre || !product.descripcion || !product.precio || !product.imagen || !product.sku || !product.stock) {
      console.error("Todos los campos deben estar llenos.");
      return;
    }

    if (this.products.some(p => p.sku === product.sku)) {
      console.error("El SKU ya está en uso.");
      return;
    }

    product.id = this.productIdCounter++;
    this.products.push(product);
    this.saveToFile(); // Guardar en el archivo
    console.log("Producto agregado:", product);
  }

  getProducts() {
    console.log("Objetniendo todos los productos");
    return this.products;
  }

  getProductById(id) {
    const product = this.products.find(p => p.id === id);
    if (product) {
      return product;
    } else {
      console.error("Producto no encontrado");
    }
  }

  updateProduct(id, updatedFields) {
    const productIndex = this.products.findIndex(p => p.id === id);
    if (productIndex !== -1) {
      this.products[productIndex] = {
        ...this.products[productIndex],
        ...updatedFields
      };
      this.saveToFile(); // Guardar en el archivo
      console.log(`Producto con ID ${id} actualizado.`);
    } else {
      console.error("Producto no encontrado");
    }
  }

  deleteProduct(id) {
    const productIndex = this.products.findIndex(p => p.id === id);
    if (productIndex !== -1) {
      this.products.splice(productIndex, 1);
      this.saveToFile(); // Guardar en el archivo
      console.log(`Producto con ID ${id} eliminado.`);
    } else {
      console.error("Producto no encontrado");
    }
  }

  saveToFile() {
    fs.writeFile(this.path, JSON.stringify(this.products, null, 2), err => {
      if (err) {
        console.error("Error al guardar en el archivo:", err);
      }
    });
  }
}

// Ejemplo de uso
const manager = new ProductManager('productos.json');

const producto1 = {
  nombre: "Producto 1",
  descripcion: "Descripción del producto 1",
  precio: 10.99,
  imagen: "/ruta/imagen1.jpg",
  sku: "SKU123",
  stock: 100
};

const producto2 = {
  nombre: "Producto 2",
  descripcion: "Descripción del producto 2",
  precio: 15.99,
  imagen: "/ruta/imagen2.jpg",
  sku: "SKU124",
  stock: 50
};

manager.addProduct(producto1);
manager.addProduct(producto2);

console.log(manager.getProducts());

const productoEncontrado = manager.getProductById(2);
console.log(productoEncontrado);

// Actualizar un producto (por ejemplo, cambiar el precio)
manager.updateProduct(1, { precio: 12.99 });

// Eliminar un producto
manager.deleteProduct(2);

// Mostrar productos actualizados
console.log(manager.getProducts());
