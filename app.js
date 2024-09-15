const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/signup', (req, res) => {
    const userData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password 
    };

    fs.readFile('users.json', 'utf8', (err, data) => {
        let users = [];
        if (err && err.code !== 'ENOENT') {
            return res.status(500).send('Error reading data');
        }
        if (data) {
            try {
                users = JSON.parse(data);
            } catch (parseErr) {
                return res.status(500).send('Error parsing data');
            }
        }

        users.push(userData);

        fs.writeFile('users.json', JSON.stringify(users, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Error saving data');
            }
            res.send('Signup successful');
        });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
