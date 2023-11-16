const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const exphbs = require('express-handlebars');
const fs = require('fs');
const productsRouter = require('./productsRouter');
const cartRouter = require('./cartRouter');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Configuración de Handlebars
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Rutas
app.get('/', (req, res) => {
  res.render('home', { products: getProductList() });
});

app.use('/api/products', productsRouter);
app.use('/api/carts', cartRouter);

// Configuración de Socket.io
io.on('connection', (socket) => {
  console.log('Usuario conectado');

  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
  });
});

// Función para obtener la lista de productos
function getProductList() {
  const rawData = fs.readFileSync('productos.json');
  return JSON.parse(rawData);
}

http.listen(8080, () => {
  console.log('Servidor en línea en puerto: 8080');
});
