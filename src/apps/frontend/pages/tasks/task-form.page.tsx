import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { Button, FormControl, H2, Input } from 'frontend/components';
import { ButtonKind, ButtonType } from 'frontend/types/button';
import { TaskFormData } from 'frontend/types';
import { TaskService } from 'frontend/services';
import { useAccountContext } from 'frontend/contexts';

const TaskFormPage: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const { accountDetails } = useAccountContext();
  const isEditing = taskId !== 'new' && !!taskId;

  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<TaskFormData>>({});

  const taskService = new TaskService();

  useEffect(() => {
    if (isEditing && taskId) {
      loadTask();
    }
  }, [isEditing, taskId]);

  const loadTask = async () => {
    if (!taskId || !accountDetails?.id) {
      setError('Missing task ID or account');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await taskService.getTask(accountDetails.id, taskId);

      if (!response.error && response.data) {
        const task = response.data;
        setFormData({
          title: task.title,
          description: task.description
        });
      } else {
        const errorMessage = response.error?.message || 'Failed to load task';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (err) {
      const errorMessage = 'Failed to load task';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error loading task:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<TaskFormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !accountDetails?.id) {
      if (!accountDetails?.id) {
        toast.error('Account not found');
      }
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      let response;
      if (isEditing && taskId) {
        response = await taskService.updateTask(accountDetails.id, taskId, formData);
      } else {
        response = await taskService.createTask(accountDetails.id, formData);
      }

      if (!response.error && response.data) {
        const successMessage = isEditing ? 'Task updated successfully' : 'Task created successfully';
        toast.success(successMessage);
        navigate(`/tasks/${response.data.id}`);
      } else {
        const errorMessage = response.error?.message || 'Failed to save task';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (err) {
      const errorMessage = 'Failed to save task';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error saving task:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof TaskFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleCancel = () => {
    if (isEditing && taskId) {
      navigate(`/tasks/${taskId}`);
    } else {
      navigate('/tasks');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">Loading task...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <H2>{isEditing ? 'Edit Task' : 'Create New Task'}</H2>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
          {error}
        </div>
      )}

      <div className="bg-white border border-stroke rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormControl label="Title *" error={errors.title}>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter task title"
            />
          </FormControl>

          <FormControl label="Description *" error={errors.description}>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter task description"
              className="w-full rounded-lg border border-stroke p-4 outline-none focus:border-primary"
              rows={6}
            />
          </FormControl>

          <div className="flex gap-4 pt-4">
            <Button
              type={ButtonType.SUBMIT}
              kind={ButtonKind.PRIMARY}
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              {isEditing ? 'Update Task' : 'Create Task'}
            </Button>
            <Button
              type={ButtonType.BUTTON}
              kind={ButtonKind.TERTIARY}
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskFormPage;