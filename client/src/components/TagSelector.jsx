import { useState, useEffect } from 'react';
import { getTags, createTag } from '../api';
import './TagSelector.css';

function TagSelector({ selectedTags, onChange, compact = false }) {
  const [tags, setTags] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [showNewTagInput, setShowNewTagInput] = useState(false);

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

  const handleToggleTag = (tagId) => {
    if (selectedTags.includes(tagId)) {
      onChange(selectedTags.filter((id) => id !== tagId));
    } else {
      onChange([...selectedTags, tagId]);
    }
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;

    try {
      const response = await createTag(newTagName.trim());
      setTags([...tags, response.data]);
      setNewTagName('');
      setShowNewTagInput(false);
      onChange([...selectedTags, response.data.id]);
    } catch (error) {
      console.error('Failed to create tag:', error);
      alert(error.response?.data?.error || 'Failed to create tag');
    }
  };

  const selectedTagObjects = tags.filter((tag) => selectedTags.includes(tag.id));

  return (
    <div className={`tag-selector ${compact ? 'compact' : ''}`}>
      <div className="selected-tags">
        {selectedTagObjects.length > 0 ? (
          selectedTagObjects.map((tag) => (
            <span key={tag.id} className="tag">
              {tag.name}
              <button
                onClick={() => handleToggleTag(tag.id)}
                className="remove-tag"
              >
                ×
              </button>
            </span>
          ))
        ) : (
          <span className="no-tags">No tags selected</span>
        )}
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="add-tag-button"
        >
          + Add Tag
        </button>
      </div>

      {showDropdown && (
        <>
          <div
            className="dropdown-overlay"
            onClick={() => setShowDropdown(false)}
          />
          <div className="tags-dropdown">
            <div className="tags-list">
              {tags.map((tag) => (
                <label key={tag.id} className="tag-option">
                  <input
                    type="checkbox"
                    checked={selectedTags.includes(tag.id)}
                    onChange={() => handleToggleTag(tag.id)}
                  />
                  {tag.name}
                </label>
              ))}
            </div>
            {showNewTagInput ? (
              <div className="new-tag-input">
                <input
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="New tag name"
                  autoFocus
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateTag()}
                />
                <button onClick={handleCreateTag}>Create</button>
                <button onClick={() => {
                  setShowNewTagInput(false);
                  setNewTagName('');
                }}>
                  Cancel
                </button>
              </div>
            ) : (
              <button
                className="create-new-tag-btn"
                onClick={() => setShowNewTagInput(true)}
              >
                + Create New Tag
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default TagSelector;
