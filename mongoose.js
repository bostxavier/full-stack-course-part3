const mongoose = require('mongoose')

if (!(process.argv.length === 3 || process.argv.length === 5)) {
    console.log('give password, and optionnally new username and number as arguments')
    process.exit(1)
}

const password = process.argv[2]

const url = 
    `mongodb+srv://xavierbost:${password}@cluster0.nnigg.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 5) {
    const name = process.argv[3]
    const number = process.argv[4]
    const person = new Person({name, number})
    person.save().then(result => {
        console.log('person saved!')
        mongoose.connection.close()
    })
}
else {
    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(person => {
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })
}