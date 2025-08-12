import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { Button, H2 } from 'frontend/components';
import { ButtonKind, ButtonType } from 'frontend/types/button';
import { Task } from 'frontend/types';
import { TaskService } from 'frontend/services';
import { useAccountContext } from 'frontend/contexts';

const TaskListPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { accountDetails, isAccountLoading } = useAccountContext();

  const taskService = new TaskService();

  useEffect(() => {
    if (!isAccountLoading && accountDetails?.id) {
      loadTasks();
    }
  }, [isAccountLoading, accountDetails?.id]);

  const loadTasks = async () => {
    if (!accountDetails?.id) {
      setError('Account not found');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await taskService.getTasks(accountDetails.id);
      if (!response.error && response.data) {
        setTasks(response.data.tasks);
      } else {
        const errorMessage = response.error?.message || 'Failed to load tasks';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (err) {
      const errorMessage = 'Failed to load tasks';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error loading tasks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskClick = (taskId: string) => {
    navigate(`/tasks/${taskId}`);
  };

  const handleNewTask = () => {
    navigate('/tasks/new');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">Loading tasks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <H2>Tasks</H2>
        <Button
          type={ButtonType.BUTTON}
          kind={ButtonKind.PRIMARY}
          onClick={handleNewTask}
        >
          New Task
        </Button>
      </div>

      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-body-color/60 mb-4">No tasks found</div>
            <Button
              type={ButtonType.BUTTON}
              kind={ButtonKind.PRIMARY}
              onClick={handleNewTask}
            >
              Create your first task
            </Button>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => handleTaskClick(task.id)}
              className="bg-white border border-stroke rounded-lg p-4 cursor-pointer hover:border-primary transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-body-color mb-1">
                    {task.title}
                  </h3>
                  <p className="text-body-color/60 text-sm line-clamp-2">
                    {task.description}
                  </p>
                </div>
                <div className="text-sm text-body-color/40">
                  {new Date(task.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskListPage;