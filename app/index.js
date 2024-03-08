const express = require("express");
const { v4: uuid } = require("uuid");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(express.json());

const sampleTodo = {
  id: uuid(),
  task: "Some task to be done",
  is_done: false,
  created_at: Date.now(),
  updated_at: Date.now(),
};

let todos = [sampleTodo];

const findTodoById = (id) => {
  return todos.find((todo) => todo.id === id);
};

const sendNotFoundResponse = (res) => {
  res.status(404).json({
    message: "No such todo with this ID",
  });
};

const sendSuccessResponse = (res, data, message) => {
  res.status(200).json({
    data,
    message,
  });
};

const sendErrorResponse = (res, statusCode, message) => {
  res.status(statusCode).json({
    message,
  });
};

app.get("/", (req, res) => {
  res.send("Hello Express");
});

app.get("/todos", (req, res) => {
  sendSuccessResponse(res, todos, "Todos fetched successfully");
});

app.get("/todos/:id", (req, res) => {
  const { id } = req.params;
  const todo = findTodoById(id);

  if (!todo) {
    sendNotFoundResponse(res);
    return;
  }

  sendSuccessResponse(res, todo, "Todo item fetched successfully");
});

app.post("/todos", (req, res) => {
  const { task } = req.body;

  if (!task) {
    sendErrorResponse(res, 400, "No task was set");
    return;
  }

  const todo = {
    id: uuid(),
    task,
    is_done: false,
    created_at: Date.now(),
    updated_at: Date.now(),
  };

  todos.push(todo);
  sendSuccessResponse(res, todo, "Successfully created todo");
});

app.patch("/todos/:id", (req, res) => {
  const { id } = req.params;
  const { task, is_done } = req.body;

  const targetTodo = findTodoById(id);

  if (!targetTodo) {
    sendNotFoundResponse(res);
    return;
  }

  const targetTodoIndex = todos.findIndex((todo) => todo.id == id);
  todos[targetTodoIndex] = {
    ...targetTodo,
    task,
    is_done,
    updated_at: Date.now(),
  };

  sendSuccessResponse(res, todos[targetTodoIndex], "Successfully updated todo");
});

app.delete("/todos/:id", (req, res) => {
  const { id } = req.params;
  const targetTodo = findTodoById(id);

  if (!targetTodo) {
    sendNotFoundResponse(res);
    return;
  }

  todos = todos.filter((todo) => todo.id !== id);

  sendSuccessResponse(res, targetTodo, "Successfully deleted todo");
});

app.listen(PORT);
console.log(`Server listening on port ${PORT}`);
