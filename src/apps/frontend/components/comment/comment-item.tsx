import React, { useState } from 'react';

import Button from 'frontend/components/button';
import { Comment } from 'frontend/types';
import { ButtonKind, ButtonType } from 'frontend/types/button';

interface CommentItemProps {
  comment: Comment;
  onEdit?: (commentId: string, newContent: string) => void;
  onDelete?: (commentId: string) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onEdit,
  onDelete,
  canEdit = false,
  canDelete = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const handleEdit = () => {
    if (onEdit) {
      onEdit(comment.id, editContent);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditContent(comment.content);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (onDelete && window.confirm('Are you sure you want to delete this comment?')) {
      onDelete(comment.id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="border-b border-stroke py-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-medium text-body-color">
            {comment.author_name || 'Anonymous'}
          </span>
          <span className="text-sm text-body-color/60">
            {formatDate(comment.created_at)}
          </span>
          {comment.updated_at !== comment.created_at && (
            <span className="text-sm text-body-color/40">(edited)</span>
          )}
        </div>
        {(canEdit || canDelete) && (
          <div className="flex gap-2">
            {canEdit && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-sm text-primary hover:text-primary/80"
              >
                Edit
              </button>
            )}
            {canDelete && !isEditing && (
              <button
                onClick={handleDelete}
                className="text-sm text-red-500 hover:text-red-600"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-2">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full rounded-lg border border-stroke p-3 outline-none focus:border-primary"
            rows={3}
          />
          <div className="flex gap-2">
            <Button
              type={ButtonType.BUTTON}
              kind={ButtonKind.PRIMARY}
              onClick={handleEdit}
            >
              Save
            </Button>
            <Button
              type={ButtonType.BUTTON}
              kind={ButtonKind.TERTIARY}
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="whitespace-pre-wrap text-body-color">
          {comment.content}
        </div>
      )}
    </div>
  );
};

export default CommentItem;