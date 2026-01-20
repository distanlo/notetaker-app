import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getItemsByTag, getTags } from '../api';
import './TagDetailPage.css';

function TagDetailPage() {
  const { tagId } = useParams();
  const navigate = useNavigate();
  const [tagName, setTagName] = useState('');
  const [notes, setNotes] = useState([]);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [tagId]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Get tag name
      const tagsResponse = await getTags();
      const tag = tagsResponse.data.find(t => t.id === parseInt(tagId));
      if (tag) {
        setTagName(tag.name);
      }

      // Get items with this tag
      const response = await getItemsByTag(tagId);
      setNotes(response.data.notes || []);
      setTodos(response.data.todos || []);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="tag-detail-page"><p>Loading...</p></div>;
  }

  return (
    <div className="tag-detail-page">
      <div className="page-header">
        <button onClick={() => navigate('/tags')} className="back-button">
          ← Back to Tags
        </button>
        <h1>Tag: {tagName}</h1>
      </div>

      <div className="sections">
        <section className="notes-section">
          <h2>Notes ({notes.length})</h2>
          {notes.length === 0 ? (
            <p className="empty-message">No notes with this tag</p>
          ) : (
            <div className="items-list">
              {notes.map((note) => (
                <div key={note.id} className="item-card note-card">
                  <h3>{note.title}</h3>
                  <div
                    className="note-content"
                    dangerouslySetInnerHTML={{ __html: note.content }}
                  />
                  <div className="item-meta">
                    <span className="date">Date: {note.date}</span>
                    {note.tags && note.tags.length > 0 && (
                      <div className="tags">
                        {note.tags.map((tag) => (
                          <span key={tag.id} className="tag">
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="todos-section">
          <h2>To-Do Items ({todos.length})</h2>
          {todos.length === 0 ? (
            <p className="empty-message">No todos with this tag</p>
          ) : (
            <div className="items-list">
              {todos.map((todo) => (
                <div key={todo.id} className={`item-card todo-card ${todo.completed ? 'completed' : ''}`}>
                  <div className="todo-main">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      readOnly
                      disabled
                    />
                    <span className="todo-text">{todo.text}</span>
                  </div>
                  <div className="item-meta">
                    <span className="note-ref">From: {todo.note_title}</span>
                    {todo.due_date && (
                      <span className="due-date">Due: {todo.due_date}</span>
                    )}
                    {todo.in_calendar && (
                      <span className="in-calendar">In Calendar</span>
                    )}
                    {todo.tags && todo.tags.length > 0 && (
                      <div className="tags">
                        {todo.tags.map((tag) => (
                          <span key={tag.id} className="tag">
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default TagDetailPage;
