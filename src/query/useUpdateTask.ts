import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTask } from "../services/googleTasks.service";
import toast from '../../node_modules/react-hot-toast/src/index';

export interface UpdateTask {
    id: string;
    title: string;
    notes?: string;
    status: string;
    due?: string;
    listId?: string;
    completed?: boolean;
    updated?: string;
}

export function useUpdateStatusTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (newTask: UpdateTask) => updateTask(newTask),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['taskLists'] });

            toast.success(
                `Task ${variables.status === 'completed' ? 'marked as completed' : 'marked as pending'} successfully`
            );
        },
        onError: (error) => {
            console.error("Error updating task:", error);
            toast.error("Failed to update task");
        }
    });
}

export function useUpdateTask(handleCancel?: () => void) {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: (newTask: UpdateTask) => updateTask(newTask),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['taskLists'] });
        toast.success('Task updated successfully');
        handleCancel?.();
      },
      onError: (error) => {
        toast.error(`Failed to update task: ${error.message}`);
      },
    });
  }
  