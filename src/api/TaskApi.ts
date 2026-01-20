import { isAxiosError } from "axios";
import { TaskSchema, type Project, type Task, type TaskFormData } from "../types";
import api from "@/lib/axios";

type TaskApiProps = {
    formData: TaskFormData,
    projectId: Project['_id'],
    taskId: Task['_id'],
    status: Task['status']
}

export async function createTask ({formData, projectId}: Pick<TaskApiProps, 'formData' | 'projectId'>){
    try {
        const {data} = await api.post<string>(`/projects/${projectId}/tasks`, formData)
        
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}

export async function getTaskById({taskId, projectId}: Pick<TaskApiProps, 'taskId' | 'projectId'>){
    try {
        const {data} = await api(`/projects/${projectId}/tasks/${taskId}`)    
        console.log(data);
            
        const response = TaskSchema.safeParse(data)
        console.log(response);
        
        if(response.success){
            return response.data
        }
        
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.message)
        }
    }
}

export async function editTask ({formData, taskId, projectId}: Pick<TaskApiProps, 'formData' | 'taskId' | 'projectId'>){
    try {
        const {data} = await api.put<string>(`/projects/${projectId}/tasks/${taskId}`, formData)
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}

export async function deleteTask({taskId, projectId}: Pick<TaskApiProps, 'taskId' | 'projectId'>){
    try {
        const {data} = await api.delete<string>(`/projects/${projectId}/tasks/${taskId}`)
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.message)
        }
    }
}

export async function updateStatus({taskId, projectId, status}: Pick<TaskApiProps, 'taskId' | 'projectId' | 'status'>){
    try {
        const {data} = await api.post<string>(`/projects/${projectId}/tasks/${taskId}/status`, {status})
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.message)
        }
    }
}