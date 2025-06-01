import {  useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTask } from "../services/googleTasks.service";
import toast from '../../node_modules/react-hot-toast/src/index';

export function useDeleteTask(handleDeleteCancel?: () => void) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ taskId, listId }: { taskId: string; listId: string }) => deleteTask(taskId, listId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['taskLists'],
            });

            handleDeleteCancel?.();
            toast.success('Task deleted successfully');
        },
        onError: (error) => {
            console.error("Error deleting task:", error);
            toast.error(`Failed to delete task: ${error.message}`);
        }
    });
}