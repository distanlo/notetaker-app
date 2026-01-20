import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTags, createTag, deleteTag } from '../api';
import './TagsPage.css';

function TagsPage() {
  const [tags, setTags] = useState([]);
  const [newTagName, setNewTagName] = useState('');
  const [showNewTagInput, setShowNewTagInput] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      const response = await getTags();
      setTags(response.data);
    } catch (error) {
      console.error('Failed to load tags:', error);
    }
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;

    try {
      await createTag(newTagName.trim());
      setNewTagName('');
      setShowNewTagInput(false);
      loadTags();
    } catch (error) {
      console.error('Failed to create tag:', error);
      alert(error.response?.data?.error || 'Failed to create tag');
    }
  };

  const handleDeleteTag = async (tagId, tagName) => {
    if (window.confirm(`Are you sure you want to delete the tag "${tagName}"? This will remove it from all notes and todos.`)) {
      try {
        await deleteTag(tagId);
        loadTags();
      } catch (error) {
        console.error('Failed to delete tag:', error);
      }
    }
  };

  const handleTagClick = (tagId) => {
    navigate(`/tags/${tagId}`);
  };

  return (
    <div className="tags-page">
      <div className="tags-header">
        <h1>All Tags</h1>
        {showNewTagInput ? (
          <div className="new-tag-form">
            <input
              type="text"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder="Tag name"
              autoFocus
              onKeyPress={(e) => e.key === 'Enter' && handleCreateTag()}
            />
            <button onClick={handleCreateTag} className="create-button">
              Create
            </button>
            <button onClick={() => {
              setShowNewTagInput(false);
              setNewTagName('');
            }} className="cancel-button">
              Cancel
            </button>
          </div>
        ) : (
          <button onClick={() => setShowNewTagInput(true)} className="create-button">
            + New Tag
          </button>
        )}
      </div>

      <div className="tags-grid">
        {tags.length === 0 ? (
          <div className="empty-state">
            <p>No tags yet</p>
            <button onClick={() => setShowNewTagInput(true)}>Create your first tag</button>
          </div>
        ) : (
          tags.map((tag) => (
            <div key={tag.id} className="tag-card">
              <div className="tag-name" onClick={() => handleTagClick(tag.id)}>
                {tag.name}
              </div>
              <button
                onClick={() => handleDeleteTag(tag.id, tag.name)}
                className="delete-tag-btn"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TagsPage;
