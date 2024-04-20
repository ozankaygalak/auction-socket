const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

// App setup
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Static files
app.use(express.static('public')); // index.html dosyanızı sunmak için

// Müzayede verilerini saklamak için bir obje
let auctions = {};

// Sunucu tarafındaki socket.io işlevleri içinde
// Sunucu tarafındaki socket.io işlevleri içinde
io.on('connection', (socket) => {
  socket.on('createAuction', (data) => {
      const auctionId = generateAuctionId();
      auctions[auctionId] = {
          item: data.item,
          startingBid: data.startingBid,
          bids: [],
          auctionId:auctionId
      };
      // Tüm bağlı istemcilere yeni müzayede bilgilerini gönder
      io.emit('auctionData', auctions);
      console.log('Auction created:', auctions[auctionId]);
  });

  // Teklif verme isteğini işle
  socket.on('placeBid', data => {
      const auction = auctions[data.auctionId];
      if (auction && data.bid > auction.startingBid) {
          auction.bids.push(data.bid);
          auction.startingBid = data.bid;
          io.emit('auctionData', auctions); // Tüm kullanıcılara güncel müzayede verisini gönder
          console.log('Bid placed on auction:', data.auctionId, 'with bid:', data.bid);
      } else {
          socket.emit('error', 'Invalid bid or auction ID.');
      }
  });

  socket.on('disconnect', () => {
      console.log('User disconnected');
  });
});


// Server'ı başlat
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// Benzersiz müzayede ID'si üretmek için basit bir fonksiyon
function generateAuctionId() {
  return Math.random().toString(36).substr(2, 9);
}
