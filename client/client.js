// client.js

document.addEventListener('DOMContentLoaded', function () {
  const io = require('socket.io-client');
  const socket = io('http://localhost:3000');

  socket.on('connect', () => {
    console.log('Connected to the server');

    // Müzayede oluştur
    socket.emit('createAuction', { item: 'Painting', startingBid: 100 });

    // Teklif ver
    socket.emit('placeBid', { auctionId: '1', bid: 150 });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});
