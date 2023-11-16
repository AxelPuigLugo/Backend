const socket = io();

socket.on('updateProducts', () => {
  // Actualizar la lista de productos en la vista de tiempo real
  fetch('/api/products')
    .then(response => response.json())
    .then(data => {
    });
});
