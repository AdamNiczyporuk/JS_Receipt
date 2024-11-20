const express = require('express');
const cors = require('cors');
const app = express();
let nextId = 0;
app.use(cors());

app.use(express.json());


let items = [];


app.get('/items', (req, res) => {
    res.json(items);
});


app.post('/items', (req, res) => { 
    const newItem = req.body;
    newItem.id = nextId++;  
    items.push(newItem);
    res.json(newItem); 
});



app.put('/items/:id', (req, res) => {
  const itemId = parseInt(req.params.id);
  const updatedItem = req.body;

  let item = items.find(i => i.id === itemId);
  if (item) {
      item.name = updatedItem.name || item.name;
      item.quantity = updatedItem.quantity || item.quantity;
      item.price = updatedItem.unitPrice || item.price; 
      res.json(item);
  } else {
      res.status(404).json({ message: "Item not found" });
  }
});


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



const port = 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
