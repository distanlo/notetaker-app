import { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getTags, createNote, updateNote } from '../api';
import { getTodosByNote, createTodo, updateTodo, deleteTodo } from '../api';
import TodoItem from './TodoItem';
import TagSelector from './TagSelector';
import './NoteEditor.css';

function NoteEditor({ note, onSave, onCancel }) {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [date, setDate] = useState(note?.date || '');
  const [selectedTags, setSelectedTags] = useState(note?.tags?.map(t => t.id) || []);
  const [todos, setTodos] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedText, setSelectedText] = useState('');
  const quillRef = useRef(null);

  useEffect(() => {
    if (note?.id) {
      loadTodos();
    }
  }, [note?.id]);

  const loadTodos = async () => {
    if (note?.id) {
      try {
        const response = await getTodosByNote(note.id);
        setTodos(response.data);
      } catch (error) {
        console.error('Failed to load todos:', error);
      }
    }
  };

  const handleSave = async () => {
    try {
      const noteData = {
        title,
        content,
        date,
        tags: selectedTags,
      };

      if (note?.id) {
        await updateNote(note.id, noteData);
      } else {
        await createNote(noteData);
      }

      onSave();
    } catch (error) {
      console.error('Failed to save note:', error);
    }
  };

  const handleContextMenu = (e) => {
    e.preventDefault();

    const quill = quillRef.current?.getEditor();
    if (!quill) return;

    const selection = quill.getSelection();
    if (!selection || selection.length === 0) return;

    const text = quill.getText(selection.index, selection.length);
    if (!text.trim()) return;

    setSelectedText(text.trim());

    // Position context menu, keeping it on screen
    let x = e.clientX;
    let y = e.clientY;

    // Adjust position on mobile to avoid going off screen
    if (window.innerWidth < 768) {
      x = Math.min(x, window.innerWidth - 200);
      y = Math.min(y, window.innerHeight - 100);
    }

    setContextMenu({ x, y });
  };

  const handleCreateTodoFromText = async () => {
    if (!note?.id) {
      alert('Please save the note first before creating todos');
      return;
    }

    try {
      await createTodo({
        note_id: note.id,
        text: selectedText,
        tags: [],
      });
      loadTodos();
      setContextMenu(null);
      setSelectedText('');
    } catch (error) {
      console.error('Failed to create todo:', error);
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
    try {
      await deleteTodo(todoId);
      loadTodos();
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
      ['clean'],
    ],
  };

  return (
    <div className="note-editor">
      <div className="editor-header">
        <input
          type="text"
          placeholder="Note Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="title-input"
        />
        <div className="editor-actions">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="date-input"
          />
          <button onClick={handleSave} className="save-button">
            Save
          </button>
          <button onClick={onCancel} className="cancel-button">
            Cancel
          </button>
        </div>
      </div>

      <TagSelector selectedTags={selectedTags} onChange={setSelectedTags} />

      <div onContextMenu={handleContextMenu}>
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={content}
          onChange={setContent}
          modules={modules}
          placeholder="Start writing your note... (Right-click selected text to create a todo)"
        />
      </div>

      {contextMenu && (
        <>
          <div className="context-menu-overlay" onClick={() => setContextMenu(null)} />
          <div
            className="context-menu"
            style={{ top: contextMenu.y, left: contextMenu.x }}
          >
            <button onClick={handleCreateTodoFromText}>
              Create Todo from "{selectedText.substring(0, 30)}..."
            </button>
          </div>
        </>
      )}

      {note?.id && (
        <div className="todos-section">
          <h3>To-Do Items</h3>
          {todos.length === 0 ? (
            <p className="no-todos">No todos yet. Right-click text above to create one.</p>
          ) : (
            <div className="todos-list">
              {todos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onUpdate={handleTodoUpdate}
                  onDelete={handleTodoDelete}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default NoteEditor;
