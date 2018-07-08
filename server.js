const express = require('express');
const app = express();
const Joi = require('joi');

let veggies = [
  { id: 1, name: "cucumber" },
  { id: 2, name: "tomato" },
  { id: 3, name: "parsley" },
  { id: 4, name: "carrot" },
  { id: 5, name: "salad" },
]

app.use(express.json());

app.get('/', (request, response) => response.send('Hi this is Marek`s app!'))
/////
//Read list
////
app.get('/api/veggies', (req, res) => {
  res.send(veggies);
})
/////
//Create new item
/////
app.post('/api/veggies', (req, res) => {
  const { error } = validateVeggie(req.body)
  if (error) return res.status(400).send(error.details[0].message);

  const newVeg = {
    id: veggies.length + 1,
    name: req.body.name
  }
  veggies.push(newVeg);
  res.send(veggies);
})
/////
//Update current item
/////
app.put('/api/veggies/:id', (req, res) => {
  const veggie = veggies.find(c => c.id === parseInt(req.params.id));
  if (!veggie) return res.status(404).send('The veggie with the given ID doesn`t exist, please try again.');
  const { error } = validateVeggie(req.body)
  if (error) return res.status(400).send(error.details[0].message);

  const index = veggies.indexOf(veggie);
  const newVeg = {
    id: req.params.id,
    name: req.body.name
  }
  veggies[index] = newVeg;
  res.send(veggies);
})

/////
//Delete one item by id
/////
app.delete('/api/veggies/:id', (req, res) => {
  const veggie = veggies.find(c => c.id === parseInt(req.params.id));
  if (!veggie) return res.status(404).send('The veggie with the given ID wasn`t found');

  const index = veggies.indexOf(veggie);
  veggies.splice(index, 1);
  res.send(veggies);
})



const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`))

function validateVeggie(veg) {
  const shema = {
    name: Joi.string().min(3).required()
  }
  return Joi.validate(veg, shema);
}