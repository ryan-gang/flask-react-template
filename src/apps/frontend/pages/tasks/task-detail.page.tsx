import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { Button, CommentList, H2 } from 'frontend/components';
import { ButtonKind, ButtonType } from 'frontend/types/button';
import { Task, Comment, CommentFormData } from 'frontend/types';
import { TaskService, CommentService } from 'frontend/services';
import { useAccountContext } from 'frontend/contexts';

const TaskDetailPage: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const { accountDetails } = useAccountContext();
  
  const [task, setTask] = useState<Task | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const taskService = new TaskService();
  const commentService = new CommentService();

  useEffect(() => {
    if (taskId) {
      loadTaskAndComments();
    }
  }, [taskId]);

  const loadTaskAndComments = async () => {
    if (!taskId || !accountDetails?.id) {
      setError('Missing task ID or account');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const [taskResponse, commentsResponse] = await Promise.all([
        taskService.getTask(accountDetails.id, taskId),
        commentService.getComments(accountDetails.id, taskId)
      ]);

      if (!taskResponse.error && taskResponse.data) {
        setTask(taskResponse.data);
      } else {
        const errorMessage = taskResponse.error?.message || 'Failed to load task';
        setError(errorMessage);
        toast.error(errorMessage);
      }

      if (!commentsResponse.error && commentsResponse.data) {
        setComments(commentsResponse.data.comments);
      }
    } catch (err) {
      const errorMessage = 'Failed to load task';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error loading task and comments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddComment = async (data: CommentFormData) => {
    if (!taskId || !accountDetails?.id) return;

    try {
      setIsSubmittingComment(true);

      const response = await commentService.createComment(accountDetails.id, taskId, {
        content: data.content
      });

      if (!response.error && response.data) {
        setComments(prevComments => [...(prevComments || []), response.data!]);
        toast.success('Comment added successfully');
      } else {
        toast.error(response.error?.message || 'Failed to add comment');
      }
    } catch (err) {
      toast.error('Failed to add comment');
      console.error('Error adding comment:', err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleEditComment = async (commentId: string, newContent: string) => {
    if (!taskId || !accountDetails?.id) return;

    try {
      const response = await commentService.updateComment(accountDetails.id, taskId, commentId, {
        content: newContent
      });

      if (!response.error && response.data) {
        setComments(prevComments =>
          (prevComments || []).map(comment =>
            comment.id === commentId ? response.data! : comment
          )
        );
        toast.success('Comment updated successfully');
      } else {
        toast.error(response.error?.message || 'Failed to update comment');
      }
    } catch (err) {
      toast.error('Failed to update comment');
      console.error('Error updating comment:', err);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!taskId || !accountDetails?.id) return;

    try {
      const response = await commentService.deleteComment(accountDetails.id, taskId, commentId);

      if (!response.error) {
        setComments(prevComments =>
          (prevComments || []).filter(comment => comment.id !== commentId)
        );
        toast.success('Comment deleted successfully');
      } else {
        toast.error(response.error?.message || 'Failed to delete comment');
      }
    } catch (err) {
      toast.error('Failed to delete comment');
      console.error('Error deleting comment:', err);
    }
  };

  const handleBackToTasks = () => {
    navigate('/tasks');
  };

  const handleEditTask = () => {
    navigate(`/tasks/${taskId}/edit`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">Loading task...</div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-red-600">{error || 'Task not found'}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <Button
          type={ButtonType.BUTTON}
          kind={ButtonKind.TERTIARY}
          onClick={handleBackToTasks}
        >
          ← Back to Tasks
        </Button>
        <Button
          type={ButtonType.BUTTON}
          kind={ButtonKind.SECONDARY}
          onClick={handleEditTask}
        >
          Edit Task
        </Button>
      </div>

      <div className="bg-white border border-stroke rounded-lg p-6">
        <H2>{task.title}</H2>
        <p className="text-body-color/60 mt-2 mb-4">
          Created on {new Date(task.created_at).toLocaleDateString()}
        </p>
        <div className="whitespace-pre-wrap text-body-color">
          {task.description}
        </div>
      </div>

      <div className="bg-white border border-stroke rounded-lg p-6">
        <CommentList
          comments={comments}
          onAddComment={handleAddComment}
          onEditComment={handleEditComment}
          onDeleteComment={handleDeleteComment}
          currentUserId={accountDetails?.id}
          isLoading={isSubmittingComment}
        />
      </div>
    </div>
  );
};

export default TaskDetailPage;