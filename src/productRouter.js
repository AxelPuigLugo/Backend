const express = require('express');
const fs = require('fs');
const router = express.Router();

// Ruta raíz GET /api/products/
router.get('/', (req, res) => {
  const limit = req.query.limit; // Obtener el valor de 'limit' de los query params

  fs.readFile('productos.json', { encoding: 'utf-8' }, (error, datos) => {
    if (error) {
      console.log(`Error: ${error}`);
      res.status(500).send('Error interno del servidor');
    } else {
      let productos = JSON.parse(datos);

      if (limit) {
        productos = productos.slice(0, parseInt(limit)); // Aplicar el límite si se proporciona
      }

      res.send(productos);
    }
  });
});

// Ruta GET /api/products/:id
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);

  fs.readFile('productos.json', { encoding: 'utf-8' }, (error, datos) => {
    if (error) {
      console.log(`Error: ${error}`);
      res.status(500).send('Error interno del servidor');
    } else {
      const productos = JSON.parse(datos);
      const producto = productos.find(producto => producto.id === id);

      if (producto) {
        res.send(producto);
      } else {
        res.status(404).send('Producto no encontrado');
      }
    }
  });
});

// Ruta raíz POST /api/products/
router.post('/', (req, res) => {
  fs.readFile('productos.json', { encoding: 'utf-8' }, (error, datos) => {
    if (error) {
      console.log(`Error: ${error}`);
      res.status(500).send('Error interno del servidor');
    } else {
      const productos = JSON.parse(datos);
      const newProduct = req.body;

      // Autogenerar el ID
      const maxId = Math.max(...productos.map(producto => producto.id), 0);
      newProduct.id = maxId + 1;

      // Agregar el nuevo producto
      productos.push(newProduct);

      fs.writeFile('productos.json', JSON.stringify(productos, null, 2), (err) => {
        if (err) {
          console.error("Error al guardar en el archivo:", err);
          res.status(500).send('Error interno del servidor');
        } else {
          res.status(201).send('Producto agregado correctamente');
        }
      });
    }
  });
});

// Ruta PUT /api/products/:id
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);

  fs.readFile('productos.json', { encoding: 'utf-8' }, (error, datos) => {
    if (error) {
      console.log(`Error: ${error}`);
      res.status(500).send('Error interno del servidor');
    } else {
      const productos = JSON.parse(datos);
      const productIndex = productos.findIndex(producto => producto.id === id);

      if (productIndex !== -1) {
        const updatedFields = req.body;
        productos[productIndex] = {
          ...productos[productIndex],
          ...updatedFields
        };

        fs.writeFile('productos.json', JSON.stringify(productos, null, 2), (err) => {
          if (err) {
            console.error("Error al guardar en el archivo:", err);
            res.status(500).send('Error interno del servidor');
          } else {
            res.send(`Producto con ID ${id} actualizado.`);
          }
        });
      } else {
        res.status(404).send('Producto no encontrado');
      }
    }
  });
});

// Ruta DELETE /api/products/:id
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);

  fs.readFile('productos.json', { encoding: 'utf-8' }, (error, datos) => {
    if (error) {
      console.log(`Error: ${error}`);
      res.status(500).send('Error interno del servidor');
    } else {
      const productos = JSON.parse(datos);
      const productIndex = productos.findIndex(producto => producto.id === id);

      if (productIndex !== -1) {
        productos.splice(productIndex, 1);

        fs.writeFile('productos.json', JSON.stringify(productos, null, 2), (err) => {
          if (err) {
            console.error("Error al guardar en el archivo:", err);
            res.status(500).send('Error interno del servidor');
          } else {
            res.send(`Producto con ID ${id} eliminado.`);
          }
        });
      } else {
        res.status(404).send('Producto no encontrado');
      }
    }
  });
});

module.exports = router;
