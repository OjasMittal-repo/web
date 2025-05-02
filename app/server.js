const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;

// Middleware to parse JSON and form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public')); // To serve static files (like images)

app.post('/create-account', (req, res) => {
  const { name, email, password, profilePic } = req.body;

  // Read existing accounts
  fs.readFile('accounts.json', (err, data) => {
    if (err) {
      res.status(500).send('Error reading data.');
      return;
    }

    let accounts = JSON.parse(data);
    
    // Add the new account
    accounts.push({ name, email, password, profilePic });
    
    // Write back to the file
    fs.writeFile('accounts.json', JSON.stringify(accounts), (err) => {
      if (err) {
        res.status(500).send('Error saving account data.');
        return;
      }
      res.status(200).send('Account created successfully!');
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
const multer = require('multer');

// Set up storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Modify the POST route to handle image uploads
app.post('/create-account', upload.single('profilePic'), (req, res) => {
  const { name, email, password } = req.body;
  const profilePic = req.file ? req.file.filename : '';

  // Read existing accounts
  fs.readFile('accounts.json', (err, data) => {
    if (err) {
      res.status(500).send('Error reading data.');
      return;
    }

    let accounts = JSON.parse(data);

    // Add the new account
    accounts.push({ name, email, password, profilePic });

    // Write back to the file
    fs.writeFile('accounts.json', JSON.stringify(accounts), (err) => {
      if (err) {
        res.status(500).send('Error saving account data.');
        return;
      }
      res.status(200).send('Account created successfully!');
    });
  });
});
