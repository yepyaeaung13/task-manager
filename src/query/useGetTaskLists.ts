import { useQuery } from '@tanstack/react-query'
import { fetchTaskLists } from '../services/googleTasks.service'

export function useGetTaskLists() {
  return useQuery({
    queryKey: ['taskLists'],
    queryFn: fetchTaskLists,
  })
}
