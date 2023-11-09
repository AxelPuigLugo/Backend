const express = require('express');
const fs = require('fs');
const router = express.Router();

// Ruta raíz POST /api/carts/
router.post('/', (req, res) => {
  fs.readFile('carritos.json', { encoding: 'utf-8' }, (error, datos) => {
    if (error) {
      console.log(`Error: ${error}`);
      res.status(500).send('Error interno del servidor');
    } else {
      const carritos = JSON.parse(datos);
      const newCart = {
        id: generateUniqueId(carritos),
        products: []
      };

      carritos.push(newCart);

      fs.writeFile('carritos.json', JSON.stringify(carritos, null, 2), (err) => {
        if (err) {
          console.error("Error al guardar en el archivo:", err);
          res.status(500).send('Error interno del servidor');
        } else {
          res.status(201).send('Carrito creado correctamente');
        }
      });
    }
  });
});

// Ruta GET /api/carts/:cid
router.get('/:cid', (req, res) => {
  const cid = req.params.cid;

  fs.readFile('carritos.json', { encoding: 'utf-8' }, (error, datos) => {
    if (error) {
      console.log(`Error: ${error}`);
      res.status(500).send('Error interno del servidor');
    } else {
      const carritos = JSON.parse(datos);
      const carrito = carritos.find(c => c.id === cid);

      if (carrito) {
        res.send(carrito.products);
      } else {
        res.status(404).send('Carrito no encontrado');
      }
    }
  });
});

// Ruta POST /api/carts/:cid/product/:pid
router.post('/:cid/product/:pid', (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  const quantity = parseInt(req.body.quantity);

  fs.readFile('carritos.json', { encoding: 'utf-8' }, (error, datos) => {
    if (error) {
      console.log(`Error: ${error}`);
      res.status(500).send('Error interno del servidor');
    } else {
      const carritos = JSON.parse(datos);
      const carrito = carritos.find(c => c.id === cid);

      if (carrito) {
        const productToAdd = {
          product: pid,
          quantity: quantity
        };

        const existingProduct = carrito.products.find(p => p.product === pid);

        if (existingProduct) {
          existingProduct.quantity += quantity;
        } else {
          carrito.products.push(productToAdd);
        }

        fs.writeFile('carritos.json', JSON.stringify(carritos, null, 2), (err) => {
          if (err) {
            console.error("Error al guardar en el archivo:", err);
            res.status(500).send('Error interno del servidor');
          } else {
            res.status(201).send('Producto agregado al carrito correctamente');
          }
        });
      } else {
        res.status(404).send('Carrito no encontrado');
      }
    }
  });
});

// Función para generar un ID único
function generateUniqueId(carritos) {
  const usedIds = carritos.map(c => c.id);
  let newId = Math.floor(Math.random() * 1000);

  while (usedIds.includes(newId)) {
    newId = Math.floor(Math.random() * 1000);
  }

  return newId.toString();
}

module.exports = router;
