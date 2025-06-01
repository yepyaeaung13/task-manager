
import { useQuery } from '@tanstack/react-query'
import { fetchTasksFromList } from '../services/googleTasks.service'

export interface TaskFilters {
  dueMin?: string;
  dueMax?: string;
  showCompleted?: boolean;
  showHidden?: boolean;
};

export function useGetTasksFromList(taskListId: string, filters?: TaskFilters) {
  return useQuery({
    queryKey: ['taskLists', taskListId, filters],
    enabled: !!taskListId,
    queryFn: () => fetchTasksFromList(taskListId, filters),
  })
}
