const express = require('express');
const app = express();
const PORT = 8080;
const fs = require('fs');
const productsRouter = require('./productsRouter');
const cartRouter = require('./cartRouter'); // Importa el router del carrito

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.status(200).send('Bienvenido a mi primera entrega');
});

// Usa los routers en las rutas correspondientes
app.use('/api/products', productsRouter);
app.use('/api/carts', cartRouter);

const server = app.listen(PORT, () => {
  console.log(`Server en línea en puerto: ${PORT}`);
});
