import api from "@/lib/axios";
import { DashboardProjectSchema, EditProjectSchema, ProjectSchema, type Project, type ProjectFormData } from "@/types/index";
import { isAxiosError } from "axios";
import { safeParse } from "zod";

export async function createProject(formData: ProjectFormData){
    try {
        const {data} = await api.post('/projects', formData)
        return data
        
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }        
    }
}

export async function getProjects(){
    try {
        const {data} = await api('/projects')
        const response = safeParse(DashboardProjectSchema, data)
        if(response.success){
            return response.data
        }
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }        
    }
}

export async function getProjectById(projectId: Project['_id']){
    try {
        const {data} = await api(`/projects/${projectId}`)
        const response = EditProjectSchema.safeParse(data)
        if(response.success){
            return response.data
        }
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }        
    }
}

export async function getFullProject(projectId: Project['_id']){
    try {
        const {data} = await api(`/projects/${projectId}`)
        const response = ProjectSchema.safeParse(data)
        if(response.success){
            return response.data
        }
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }        
    }
}

type UpdateProjectProps = {
    formData: ProjectFormData,
    projectId: Project['_id']
}

export async function updateProject({formData, projectId}: UpdateProjectProps){
    try {
        const {data} = await api.put<string>(`/projects/${projectId}`, formData)
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }        
    }
}

export async function deleteProject(projectId: Project['_id']){
    try {
        const {data} = await api.delete<string>(`/projects/${projectId}`)
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }        
    }
}
