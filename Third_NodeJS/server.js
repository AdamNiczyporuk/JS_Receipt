const express = require('express');
const cors = require('cors');
const app = express();
let nextId = 0;
app.use(cors());
// Middleware do obsługi JSON w ciele żądania
app.use(express.json());

// Prosta lista przedmiotów (symulacja bazy danych)
let items = [];

// Endpoint GET - pobierz wszystkie przedmioty
app.get('/items', (req, res) => {
    res.json(items);
});

// Endpoint POST - dodaj nowy przedmiot
app.post('/items', (req, res) => {
    const newItem = req.body;
    newItem.id = nextId++;  // Przypisanie nowego ID
    items.push(newItem);
    res.json(newItem);  // Odpowiedź z nowym przedmiotem
});


// Endpoint PUT - edytuj istniejący przedmiot
app.put('/items/:id', (req, res) => {
  const itemId = parseInt(req.params.id);
  const updatedItem = req.body;

  let item = items.find(i => i.id === itemId);
  if (item) {
      item.name = updatedItem.name || item.name;
      item.quantity = updatedItem.quantity || item.quantity;
      item.price = updatedItem.unitPrice || item.price; // Poprawka, używamy unitPrice zamiast price
      res.json(item);
  } else {
      res.status(404).json({ message: "Item not found" });
  }
});

// Endpoint DELETE - usuń przedmiot
app.delete('/items/:id', (req, res) => {
  const itemId = parseInt(req.params.id);
  const index = items.findIndex(i => i.id === itemId);

  if (index !== -1) {
      const deletedItem = items.splice(index, 1);
      res.json(deletedItem);
  } else {
      res.status(404).json({ message: "Item not found" });
  }
});


// Ustawienie portu serwera
const port = 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
