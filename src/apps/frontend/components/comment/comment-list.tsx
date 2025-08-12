import React from 'react';

import CommentItem from './comment-item';
import CommentForm from './comment-form';
import { Comment, CommentFormData } from 'frontend/types';

interface CommentListProps {
  comments: Comment[];
  onAddComment: (data: CommentFormData) => void;
  onEditComment?: (commentId: string, newContent: string) => void;
  onDeleteComment?: (commentId: string) => void;
  currentUserId?: string;
  isLoading?: boolean;
  showForm?: boolean;
}

const CommentList: React.FC<CommentListProps> = ({
  comments = [],
  onAddComment,
  onEditComment,
  onDeleteComment,
  currentUserId,
  isLoading = false,
  showForm = true,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-body-color">
          Comments ({comments.length})
        </h3>
      </div>

      {showForm && (
        <CommentForm onSubmit={onAddComment} isLoading={isLoading} />
      )}

      <div
        className="border border-gray-200 rounded-lg p-2"
        style={{ maxHeight: '400px', overflowY: 'auto' }}
      >
        <div className="space-y-0">
          {comments.length === 0 ? (
            <div className="py-8 text-center text-body-color/60">
              No comments yet. Be the first to comment!
            </div>
          ) : (
            comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onEdit={onEditComment}
                onDelete={onDeleteComment}
                canEdit={currentUserId === comment.account_id}
                canDelete={currentUserId === comment.account_id}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentList;
