const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

const uploadFolder = path.join(__dirname, 'Files');
if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadFolder),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

app.use('/Files', express.static(uploadFolder));
app.use(express.static(__dirname));

app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No se subió ninguna imagen.' });

  const imageUrl = `${req.protocol}://${req.get('host')}/Files/${req.file.filename}`;
  res.json({ url: imageUrl });
});

app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});