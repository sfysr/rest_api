const express = require('express');
const mongoose = require('mongoose');
const uri = 'mongodb+srv://<username>:<password>@cluster0.qnd5thx.mongodb.net/';
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');

// MongoDB bağlantısı
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Veritabanı şema tanımı
const dataItemSchema = new mongoose.Schema({
  label: String,
  key: String,
  value: String,
  description: String,
  lastUpdate: Date,
});

const DataItem = mongoose.model('DataItem', dataItemSchema);

app.use(cors());

app.use(express.json());

// CREATE: Yeni bir veri eklemek için
app.post('/api/dataitem', (req, res) => {
  const newDataItem = new DataItem({
    label: req.body.label,
    key: req.body.key,
    value: req.body.value,
    description: req.body.description,
    lastUpdate: new Date(),
  });

  newDataItem
    .save()
    .then((dataItem) => {
      res.json(dataItem);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

// READ: Tüm verileri getirmek için
app.get('/api/dataitem', (req, res) => {
  DataItem.find()
    .then((dataItems) => {
      res.json(dataItems);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

// UPDATE: Veri güncellemek için
app.put('/api/dataitem/:id', (req, res) => {
  DataItem.findByIdAndUpdate(
    req.params.id,
    {
      label: req.body.label,
      key: req.body.key,
      value: req.body.value,
      description: req.body.description,
      lastUpdate: new Date(),
    },
    { new: true }
  )
    .then((dataItem) => {
      res.json(dataItem);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

// DELETE: Veri silmek için
app.delete('/api/dataitem/:id', (req, res) => {
  DataItem.findByIdAndRemove(req.params.id)
    .then(() => {
      res.json({ message: 'Veri silindi..' });
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});
  
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
