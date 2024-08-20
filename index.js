const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
morgan.token('body', request => request.method === 'POST' || request.method === 'PUT' ? JSON.stringify(request.body) : '')

const app = express()

require('dotenv').config()
const Person = require('./models/person')

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/info', (request, response) => {
    const datetime = new Date()
    Person.find({}).then(persons => {
        const resp = `
            <p>Phonebook has info for ${persons.length} people</p>
            <p>${datetime}</p>
        `
        response.send(resp)
    })
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(p => p.id === id)

    if (person) {
        response.json(person)
    }
    else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()
})

app.put('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const body = request.body

    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }

    if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: id
    }

    persons = persons.map(p => p.id === person.id ? person : p)
    
    response.json(person)
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }

    if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    }

    const duplicate = persons.find(p => p.name === body.name)
    if (duplicate) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const id = String(Math.floor(Math.random() * 10000))
    const person = {
        name: body.name,
        number: body.number,
        id: id
    }

    persons = persons.concat(person)
    
    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
