import { isAxiosError } from "axios";
import { UserSchema, type CheckPasswordForm, type ForgotPasswordForm, type NewPasswordForm, type NewPasswordTokenForm, type RequestConfirmationCodeForm, type UserConfirmAccountForm, type UserLoginForm, type UserRegistrationForm } from "../types";
import api from "@/lib/axios";

export async function createAccount(formData: UserRegistrationForm){
    try {
        const {data} = await api.post<string>('/auth/create-account', formData)
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}

export async function confirmAccount(token: UserConfirmAccountForm){
    try {
        const {data} = await api.post<string>('/auth/confirm-account', token)
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}

export async function requestConfirmationCode(email: RequestConfirmationCodeForm){
    try {
        const {data} = await api.post<string>('/auth/request-code', email)
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}

export async function authenticateUser(formData: UserLoginForm){
    try {
        const {data} = await api.post<string>('/auth/login', formData)
        localStorage.setItem('AUTH_TOKEN', data)
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}

export async function forgotPassword(formData: ForgotPasswordForm){
    try {
        const {data} = await api.post<string>('/auth/forgot-password', formData)
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}

export async function validateToken(token: NewPasswordTokenForm){
    try {
        const {data} = await api.post<string>('/auth/validate-token', token)
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}

export async function updatePassword({formData, token}: {formData:NewPasswordForm, token: NewPasswordTokenForm['token']}){
    try {
        const {data} = await api.post<string>(`/auth/update-password/${token}`, formData)
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}

export async function getUser(){
    try {
        const {data} = await api('/auth/user')
        const response = UserSchema.safeParse(data)
        if(response.success){
            return response.data
        }
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}

export async function checkPassword(formData : CheckPasswordForm){
    try {
        const {data} = await api.post<string>('/auth/check-password', formData)
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}