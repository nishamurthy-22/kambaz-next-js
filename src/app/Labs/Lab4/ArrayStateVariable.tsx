/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "./store";
import { ListGroup, ListGroupItem, Button } from "react-bootstrap";

export default function ArrayStateVariable() {
  const { todos } = useSelector((state: RootState) => state.todosReducer);
  const [array, setArray] = useState([1, 2, 3, 4, 5]);

  const addElement = () => {
    setArray([...array, Math.floor(Math.random() * 100)]);
  };

  const deleteElement = (index: number) => {
    setArray(array.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h4>Array State Variable</h4>

      <Button
        variant="success"
        className="mb-3 w-100"
        onClick={addElement}
        id="wd-add-element"
      >
        Add Element
      </Button>

      <ListGroup className="mb-3">
        {array.map((item, index) => (
          <ListGroupItem
            key={index}
            className="d-flex justify-content-between align-items-center"
          >
            <span>{item}</span>
            <Button
              variant="danger"
              size="sm"
              onClick={() => deleteElement(index)}
              id={`wd-delete-${index}`}
            >
              Delete
            </Button>
          </ListGroupItem>
        ))}
      </ListGroup>
      <hr />

      <ListGroup>
        {todos.map((todo: any) => (
          <ListGroupItem key={todo.id}>{todo.title}</ListGroupItem>
        ))}
      </ListGroup>
            <hr />
    </div>
  );
}
