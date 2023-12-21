require('dotenv').config();
const fs = require('fs')
const express = require('express')
const app = express();

app.use(express.urlencoded({ extended: true }))

const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => {
    return b !== 0 ? a / b : "Can't divide by zero";
}

const cals = [add, subtract, multiply, divide]

app.engine('html', (filePath, options, callback) => { 
    fs.readFile(filePath, (err, content) => {
        const rendered = content.toString()
            .replace('{{x}}', `${options.x}`)
            .replace('{{y}}', `${options.y}`)
            .replace('{{result}}', `${options.result}`)
            .replace('option selected', 'option')
            .replace(`option value="${options.indexCal}"`, `option selected value="${options.indexCal}"`)
        return callback(null, rendered)
    })
})

app.set('views', './views') 
app.set('view engine', 'html') 

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
})

app.get('/calc', (req, res) => {
    const x = parseFloat(req.query.x),
        y = parseFloat(req.query.y),
        indexCal = parseInt(req.query.cal);

    const result = cals[indexCal](x, y);
    
    res.json({ x, y, result, indexCal });
})

const port = process.env.PORT || 2000
const hostname = 'localhost'

app.listen(port, hostname, (req, res) => {
    console.log(`server running on port ${port}`
    );
})

