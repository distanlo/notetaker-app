import { useState, useEffect } from 'react';
import { getTodos, updateTodo, deleteTodo } from '../api';
import TodoItem from './TodoItem';
import './TodosPage.css';

function TodosPage() {
  const [todos, setTodos] = useState([]);
  const [includeCompleted, setIncludeCompleted] = useState(true);
  const [onlyNotInCalendar, setOnlyNotInCalendar] = useState(false);

  useEffect(() => {
    loadTodos();
  }, [includeCompleted, onlyNotInCalendar]);

  const loadTodos = async () => {
    try {
      const response = await getTodos(
        includeCompleted,
        onlyNotInCalendar
      );
      setTodos(response.data);
    } catch (error) {
      console.error('Failed to load todos:', error);
    }
  };

  const handleTodoUpdate = async (todoId, updates) => {
    try {
      await updateTodo(todoId, updates);
      loadTodos();
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  const handleTodoDelete = async (todoId) => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      try {
        await deleteTodo(todoId);
        loadTodos();
      } catch (error) {
        console.error('Failed to delete todo:', error);
      }
    }
  };

  return (
    <div className="todos-page">
      <div className="todos-header">
        <h1>All To-Do Items</h1>
        <div className="filters">
          <label className="filter-checkbox">
            <input
              type="checkbox"
              checked={includeCompleted}
              onChange={(e) => setIncludeCompleted(e.target.checked)}
            />
            Show Completed
          </label>
          <label className="filter-checkbox">
            <input
              type="checkbox"
              checked={onlyNotInCalendar}
              onChange={(e) => setOnlyNotInCalendar(e.target.checked)}
            />
            Only Not in Calendar
          </label>
        </div>
      </div>

      <div className="todos-list">
        {todos.length === 0 ? (
          <div className="empty-state">
            <p>No todos found with current filters</p>
          </div>
        ) : (
          todos.map((todo) => (
            <div key={todo.id} className="todo-with-context">
              <div className="todo-context">
                <span className="note-title">From: {todo.note_title}</span>
              </div>
              <TodoItem
                todo={todo}
                onUpdate={handleTodoUpdate}
                onDelete={handleTodoDelete}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TodosPage;
