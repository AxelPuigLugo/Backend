const express = require('express');
const app = express();
const PORT = 3000;
const fs = require('fs');

/* app.get('/products', (req, res) => {
  fs.readFile('productos.json', { encoding: 'utf-8' }, (error, datos) => {
    if (error) {
      console.log(`Error: ${error}`);
      res.status(500).send('Error interno del servidor');
    } else {
      res.send(datos);
    }
  });
}); */

app.get('/products', (req, res) => {
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

  
app.get('/products/:id', (req, res) => {
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
  
const server = app.listen(PORT, () => {
  console.log(`Server on line en puerto: ${PORT}`);
});
