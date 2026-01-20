import { isAxiosError } from "axios";
import { TeamMembersSchema, type Project, type TeamMember, type TeamMemberFormData } from "../types";
import api from "@/lib/axios";



export async function findMemberByEmail({projectId, email}: {projectId: Project['_id'], email: TeamMemberFormData}){
    try {
        const {data} = await api.post(`/projects/${projectId}/team/find`, email)
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}

export async function addUserToProject({projectId, id}: {projectId: Project['_id'], id: TeamMember['_id']}){
    try {
        const {data} = await api.post<string>(`/projects/${projectId}/team`, {id})
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}

export async function getProjectTeam(projectId: Project['_id']){
    try {
        const {data} = await api(`/projects/${projectId}/team`)
        const result = TeamMembersSchema.safeParse(data)
        if(result.success){
            return result.data
        }
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}

export async function deleteUserFromProject({projectId, id}: {projectId: Project['_id'], id: TeamMember['_id']}){
    try {
        const {data} = await api.delete<string>(`/projects/${projectId}/team/${id}`, )
        return data 
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}
