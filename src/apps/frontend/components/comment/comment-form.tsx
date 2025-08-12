import React, { useState } from 'react';

import Button from 'frontend/components/button';
import { ButtonKind, ButtonType } from 'frontend/types/button';
import { CommentFormData } from 'frontend/types';

interface CommentFormProps {
  onSubmit: (data: CommentFormData) => void;
  isLoading?: boolean;
  placeholder?: string;
}

const CommentForm: React.FC<CommentFormProps> = ({
  onSubmit,
  isLoading = false,
  placeholder = 'Add a comment...',
}) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit({ content: content.trim() });
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-stroke p-3 outline-none focus:border-primary"
        rows={3}
        disabled={isLoading}
      />
      <div className="flex justify-end">
        <Button
          type={ButtonType.SUBMIT}
          kind={ButtonKind.PRIMARY}
          disabled={!content.trim() || isLoading}
          isLoading={isLoading}
        >
          Add Comment
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;