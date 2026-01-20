import {z} from "zod";

//Auth and Users
const AuthSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    current_password: z.string(),
    password: z.string(),
    password_confirmation: z.string(),
    token: z.string()
})

type Auth = z.infer<typeof AuthSchema>
export type UserLoginForm = Pick<Auth, 'email' | 'password'> 
export type UserRegistrationForm = Pick<Auth, 'email' | 'name' | 'password' | 'password_confirmation'> 
export type UserConfirmAccountForm = Pick<Auth, 'token'>
export type NewPasswordTokenForm = Pick<Auth, 'token'>
export type RequestConfirmationCodeForm = Pick<Auth, 'email'>
export type ForgotPasswordForm = Pick<Auth, 'email'>
export type NewPasswordForm = Pick<Auth, 'password' | 'password_confirmation'>
export type UpdateCurrentUserPasswordForm = Pick<Auth, 'current_password' | 'password' | 'password_confirmation'>
export type CheckPasswordForm = Pick<Auth, 'password'>


export const UserSchema = AuthSchema.pick({
    name: true,
    email:true
}).extend({
    _id: z.string()
})

export type User = z.infer<typeof UserSchema>
export type UserProfileForm = Pick<User, 'name' | 'email'>

//Notes

export const NoteSchema = z.object({
    _id: z.string(),
    content: z.string(),
    createdBy: UserSchema,
    task: z.string(),
    createdAt:z.string()

})

export type Note = z.infer<typeof NoteSchema>
export type NoteFormData = Pick<Note, 'content'>

//Task Schema
export const TaskStatusSchema = z.enum(['pending', 'onHold', 'inProgress', 'underReview', 'completed'])
export type TaskStatus = z.infer<typeof TaskStatusSchema>
export const TaskSchema = z.object({
    _id: z.string(),
    name: z.string(),
    description: z.string(),
    project: z.string(),
    status: TaskStatusSchema,
    createdAt: z.string(),
    updatedAt: z.string(),
    completedBy: z.array(
        z.object({
            _id: z.string(),
            user: UserSchema,
            status: TaskStatusSchema
        })
    ),
    notes: z.array(NoteSchema.extend({
        createdBy: UserSchema
    }))
})

export const TaskProjectSchema = TaskSchema.pick({
    _id: true,
    name: true,
    description: true,
    status: true,
})
export type Task = z.infer<typeof TaskSchema>
export type TaskFormData = Pick<Task, 'name' | 'description'>
export type TaskProject = z.infer<typeof TaskProjectSchema>

//Projects Schema

export const ProjectSchema = z.object({
    _id: z.string(),
    projectName: z.string(),
    clientName: z.string(),
    description: z.string(),
    manager: z.string(),
    tasks: z.array(TaskProjectSchema),
    team: z.array(z.string())
})

export const DashboardProjectSchema = z.array(
    ProjectSchema.pick({
        _id: true,
        clientName: true,
        projectName:true,
        description: true,
        manager: true
    })
)

export const EditProjectSchema = ProjectSchema.pick({
    clientName: true,
    projectName:true,
    description: true,
})

export type Project = z.infer<typeof ProjectSchema>
export type ProjectFormData = Pick<Project, "projectName" | "clientName" | "description">

//Team Schema

const TeamMemberSchema = UserSchema.pick({
    name: true,
    email:true,
    _id: true
})

export const TeamMembersSchema = z.array(TeamMemberSchema)

export type TeamMember = z.infer<typeof TeamMemberSchema>
export type TeamMemberFormData = Pick<TeamMember, 'email'>