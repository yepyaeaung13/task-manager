import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask } from "../services/googleTasks.service";
import toast from '../../node_modules/react-hot-toast/src/index';

export interface Task {
    title: string;
    status: string;
    due?: string; // ISO date string    
    notes?: string;
    listId: string;
}

export function useCreateTask(handleCancel?: () => void) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (newTask: Task) => createTask(newTask),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['taskLists'],
            });
            handleCancel?.();
            toast.success('Task created successfully');
        },
        onError: (error) => {
            toast.error(`Failed to create task: ${error.message}`);
        }
    });
}