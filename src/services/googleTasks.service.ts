import type { Task } from "../query/useCreateTask"
import type { TaskFilters } from "../query/useGetTasksFromList"
import type { UpdateTask } from "../query/useUpdateTask"
import { api } from "./api"

export async function fetchTaskLists() {
    const response = await api.get('/users/@me/lists')
    return response.data
}


export const fetchTasksFromList = async (listId: string, filters?: TaskFilters) => {
    const params = new URLSearchParams();

    if (filters?.dueMin) params.append("dueMin", filters.dueMin);
    if (filters?.dueMax) params.append("dueMax", filters.dueMax);
    if (filters?.showCompleted !== undefined)
        params.append("showCompleted", String(filters.showCompleted));
    if (filters?.showHidden !== undefined)
        params.append("showHidden", String(filters.showHidden));

    const response = await api.get(`/lists/${listId}/tasks?${params.toString()}`)
    return response.data
}

export const createTask = async (task: Task) => {
    const response = await api.post(`/lists/${task.listId}/tasks`, {
        title: task.title,
        notes: task.notes,
        due: task.due,
        status: task.status,
    })
    return response.data
}

export const updateTask = async (task: UpdateTask) => {
    const response = await api.put(`/lists/${task.listId}/tasks/${task.id}`, task)
    return response.data
}

export const deleteTask = async (taskId: string, listId: string) => {
    const response = await api.delete(`/lists/${listId}/tasks/${taskId}`)
    return response.data
}
