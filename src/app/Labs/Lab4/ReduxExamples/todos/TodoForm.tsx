import { Button, FormControl } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addTodo, updateTodo, setTodo } from "./todosReducer";
import { RootState } from "../../store";

export default function TodoForm() {
  const dispatch = useDispatch();
  const { todo } = useSelector((state: RootState) => state.todosReducer);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setTodo({ ...todo, title: e.target.value }));
  };

  return (
    <div className="d-flex align-items-center mb-3">
      <FormControl
        type="text"
        value={todo.title}
        onChange={handleChange}
        placeholder="Enter a new task..."
        className="me-2"
        style={{ maxWidth: "300px" }}
      />
      <Button
        variant="warning"
        className="me-2 px-3"
        onClick={() => dispatch(updateTodo(todo))}
      >
        Update
      </Button>
      <Button variant="success" className="px-3" onClick={() => dispatch(addTodo(todo))}>
        Add
      </Button>
    </div>
  );
}
