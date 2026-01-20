import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { getNotes, createNote, deleteNote } from '../api';
import NoteEditor from './NoteEditor';
import './NotesPage.css';

function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [editingNote, setEditingNote] = useState(null);
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    loadNotes();
  }, [selectedDate]);

  const loadNotes = async () => {
    try {
      const response = await getNotes(selectedDate);
      setNotes(response.data);
    } catch (error) {
      console.error('Failed to load notes:', error);
    }
  };

  const handleCreateNote = () => {
    setEditingNote({ title: '', content: '', date: selectedDate, tags: [] });
    setShowEditor(true);
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setShowEditor(true);
  };

  const handleDeleteNote = async (noteId) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await deleteNote(noteId);
        loadNotes();
      } catch (error) {
        console.error('Failed to delete note:', error);
      }
    }
  };

  const handleSaveNote = async () => {
    setShowEditor(false);
    setEditingNote(null);
    loadNotes();
  };

  const handleCancel = () => {
    setShowEditor(false);
    setEditingNote(null);
  };

  return (
    <div className="notes-page">
      <div className="notes-header">
        <h1>Notes</h1>
        <div className="date-selector">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <button onClick={handleCreateNote} className="create-button">
            + New Note
          </button>
        </div>
      </div>

      {showEditor ? (
        <NoteEditor
          note={editingNote}
          onSave={handleSaveNote}
          onCancel={handleCancel}
        />
      ) : (
        <div className="notes-list">
          {notes.length === 0 ? (
            <div className="empty-state">
              <p>No notes for {format(new Date(selectedDate), 'MMMM d, yyyy')}</p>
              <button onClick={handleCreateNote}>Create your first note</button>
            </div>
          ) : (
            notes.map((note) => (
              <div key={note.id} className="note-card">
                <div className="note-header">
                  <h3>{note.title}</h3>
                  <div className="note-actions">
                    <button onClick={() => handleEditNote(note)}>Edit</button>
                    <button onClick={() => handleDeleteNote(note.id)} className="delete">
                      Delete
                    </button>
                  </div>
                </div>
                <div
                  className="note-content"
                  dangerouslySetInnerHTML={{ __html: note.content }}
                />
                {note.tags && note.tags.length > 0 && (
                  <div className="note-tags">
                    {note.tags.map((tag) => (
                      <span key={tag.id} className="tag">
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default NotesPage;
