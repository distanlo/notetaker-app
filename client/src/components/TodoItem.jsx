import { useState } from 'react';
import TagSelector from './TagSelector';
import './TodoItem.css';

function TodoItem({ todo, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(todo.text);
  const [dueDate, setDueDate] = useState(todo.due_date || '');
  const [selectedTags, setSelectedTags] = useState(todo.tags?.map(t => t.id) || []);

  const handleSave = () => {
    onUpdate(todo.id, {
      text,
      due_date: dueDate || null,
      completed: todo.completed,
      in_calendar: todo.in_calendar,
      tags: selectedTags,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setText(todo.text);
    setDueDate(todo.due_date || '');
    setSelectedTags(todo.tags?.map(t => t.id) || []);
    setIsEditing(false);
  };

  const handleToggleComplete = () => {
    onUpdate(todo.id, {
      ...todo,
      completed: !todo.completed,
      tags: todo.tags?.map(t => t.id) || [],
    });
  };

  const handleToggleCalendar = () => {
    onUpdate(todo.id, {
      ...todo,
      in_calendar: !todo.in_calendar,
      tags: todo.tags?.map(t => t.id) || [],
    });
  };

  if (isEditing) {
    return (
      <div className="todo-item editing">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="todo-text-input"
          autoFocus
        />
        <div className="todo-edit-section">
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="todo-date-input"
          />
          <TagSelector selectedTags={selectedTags} onChange={setSelectedTags} compact />
        </div>
        <div className="todo-actions">
          <button onClick={handleSave} className="save-btn">
            Save
          </button>
          <button onClick={handleCancel} className="cancel-btn">
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-main">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggleComplete}
          className="todo-checkbox"
        />
        <span className="todo-text">{todo.text}</span>
      </div>
      <div className="todo-meta">
        {todo.due_date && (
          <span className="todo-due-date">Due: {todo.due_date}</span>
        )}
        {todo.tags && todo.tags.length > 0 && (
          <div className="todo-tags">
            {todo.tags.map((tag) => (
              <span key={tag.id} className="tag">
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="todo-actions">
        <label className="calendar-checkbox">
          <input
            type="checkbox"
            checked={todo.in_calendar}
            onChange={handleToggleCalendar}
          />
          In Calendar
        </label>
        <button onClick={() => setIsEditing(true)} className="edit-btn">
          Edit
        </button>
        <button onClick={() => onDelete(todo.id)} className="delete-btn">
          Delete
        </button>
      </div>
    </div>
  );
}

export default TodoItem;
