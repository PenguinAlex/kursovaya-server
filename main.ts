import mongoose, {connect, model} from "mongoose";
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

require('dotenv').config()
const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors());
const Schema = mongoose.Schema;

export interface TodoI {
    id: number,
    value: string,
    isCompleted: boolean,
    date:string
}
const todoScheme = new Schema<TodoI>({
    id: Number,
    value: String,
    isCompleted: Boolean,
    date:String
})

const Todo = model<TodoI>("Todo", todoScheme)
run().catch(err => console.log(err));
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server running on port ${port}`));

app.post('/todos', async (req:any, res:any) => {
    const {id, value, isCompleted, date}=  req.body
    console.log(req.body)
    const todo = new Todo({ id, value, isCompleted, date });
    try {
        await todo.save();
        res.status(201).send(todo);
    } catch (error) {
        res.status(400).send(error);
    }
});

app.get('/todos', async (req:any, res:any) => {
    const todos = await Todo.find();
    res.send(todos);
});

app.get('/todos/:id', async (req:any, res:any) => {
    try {
        const todo = await Todo.find({id:req.params.id});
        res.send(todo);
    } catch (error) {
        res.status(404).send({ message: 'Todo not found' });
    }
});

app.put('/todos/:id', async (req:any, res:any) => {
    try {
        const todo = await Todo.findOneAndUpdate({id:req.body.id}, req.body, { new: true });
        res.send(todo);
    } catch (error) {
        res.status(404).send({ message: 'Todo not found' });
    }
});

app.delete('/todos/:id', async (req:any, res:any) => {
    try {
        const todo = await Todo.findOneAndDelete({id:req.params.id});
        if (!todo) return res.status(404).send({ message: 'Todo not found' });
        res.status(200).send({ message: 'Todo deleted' });
    } catch (error) {
        res.status(500).send(error);
    }
});


async function run() {
    console.log(`${process.env["DB"]}/todolist`)
    await connect(`${process.env["DB"]}/todolist`);

}
