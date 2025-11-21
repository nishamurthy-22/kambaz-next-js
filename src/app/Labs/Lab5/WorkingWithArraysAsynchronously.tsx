/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { TiDelete } from "react-icons/ti";
import * as client from "./client";
import { FormControl, ListGroup, ListGroupItem } from "react-bootstrap";
import { FaTrash } from "react-icons/fa6";
export default function WorkingWithArraysAsynchronously() {
  const [todos, setTodos] = useState<any[]>([]);
    const [errorMessage, setErrorMessage] = useState(null);
    const editTodo = (todo: any) => {
    const updatedTodos = todos.map(
      (t) => t.id === todo.id ? { ...todo, editing: true } : t );
    setTodos(updatedTodos);
  };
  const updateTodo = async (todo: any) => {
    try {
    await client.updateTodo(todo);
    setTodos(todos.map((t) => (t.id === todo.id ? todo : t)));
        } catch (error: any) {
      setErrorMessage(error.response.data.message);
    }

  };

    const createNewTodo = async () => {
    const todos = await client.createNewTodo();
    setTodos(todos);
  };
  const postNewTodo = async () => {
    const newTodo = await client.postNewTodo({ title: "New Posted Todo", completed: false, });
    setTodos([...todos, newTodo]);
  };
  const fetchTodos = async () => {
    const todos = await client.fetchTodos();
    setTodos(todos);
  };

  const removeTodo = async (todo: any) => {
  try {
    const updatedTodos = await client.removeTodo(todo);
    setTodos(updatedTodos);
  } catch (error: any) {
    setErrorMessage(error.response?.data?.message || `Unable to delete Todo with ID ${todo.id}`);
  }
};

    const deleteTodo = async (todo: any) => {
    try {
    await client.deleteTodo(todo);
    const newTodos = todos.filter((t) => t.id !== todo.id);
    setTodos(newTodos);
        } catch (error: any) {
      console.log(error);
      setErrorMessage(error.response.data.message);
    }

  };
  useEffect(() => {
    fetchTodos();
  }, []);
  return (
    <div id="wd-asynchronous-arrays">
      <h3>Working with Arrays Asynchronously</h3>
      {errorMessage && (<div id="wd-todo-error-message" className="alert alert-danger mb-2 mt-2">{errorMessage}</div>)}
      <h4>Todos <FaPlusCircle onClick={createNewTodo} className="text-success float-end fs-3" />
      <FaPlusCircle onClick={postNewTodo}   className="text-primary float-end fs-3 me-3" id="wd-post-todo"   />
      </h4>
<ListGroup>
  {todos.map((todo) => (
    <ListGroupItem
      key={todo.id}
      className="d-flex align-items-center justify-content-between"
      style={{ flexWrap: "nowrap" }}
    >
      <div className="d-flex align-items-center gap-2 flex-grow-1" style={{ flexWrap: "nowrap" }}>

        <input
          type="checkbox"
          checked={todo.completed}
          onChange={(e) => updateTodo({ ...todo, completed: e.target.checked })}
          className="form-check-input"
        />

        {!todo.editing ? (
          <span
            style={{
              textDecoration: todo.completed ? "line-through" : "none",
              whiteSpace: "nowrap",
            }}
          >
            {todo.title}
          </span>
        ) : (
          <FormControl
            defaultValue={todo.title}
            onChange={(e) => updateTodo({ ...todo, title: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === "Enter") updateTodo({ ...todo, editing: false });
            }}
            className="flex-grow-1"
            style={{ minWidth: "0" }}
          />
        )}
      </div>
      <div className="d-flex align-items-center gap-2 flex-shrink-0">
        <FaPencil onClick={() => editTodo(todo)} className="text-primary" />
        <TiDelete onClick={() => deleteTodo(todo)} className="text-danger fs-4" />
        <FaTrash onClick={() => removeTodo(todo)} className="text-danger" />
      </div>

    </ListGroupItem>
  ))}
</ListGroup>
 <hr />
    </div>
);}
