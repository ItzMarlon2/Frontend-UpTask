import { updateProject } from "@/api/ProjectApi"
import ProjectForm from "@/components/projects/ProjectForm"
import type { Project, ProjectFormData } from "@/types/index"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

type EditProjectFormProps = {
    project: ProjectFormData,
    projectId: Project['_id']
}

const EditProjectForm = ({project, projectId}: EditProjectFormProps) => {

    const {register, handleSubmit, formState: {errors}} = useForm({defaultValues:{
        projectName: project.projectName,
        clientName: project.clientName,
        description: project.description
    }})
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const {mutate} = useMutation({
        mutationFn: updateProject,
        onError: (error) =>{
            toast.error(error.message)
        },
        onSuccess: (data) =>{
            queryClient.invalidateQueries({queryKey: ['projects']})
            queryClient.invalidateQueries({queryKey: ['editProject', projectId]})
            queryClient.invalidateQueries({queryKey: ['projectDetails', projectId]})

            toast.success(data)
            navigate('/')
        }
    })

    const handleForm = (formData: ProjectFormData) => {
        const data = {
            formData,
            projectId
        }
        mutate(data)
    }
  return (
    <>
    <div className="max-w-3xl mx-auto ">

    <h1 className="text-5xl font-black">Editar Proyecto</h1> 
        <p className="text-2xl font-ligth text-gray-500 mt-5">Llena el siguiente formulario para editar el proyecto</p>
        <nav className="my-5">

        <Link to={"/"} className="bg-purple-400 hover:bg-purple-500 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors">
        Volver A Proyectos
        </Link>
        </nav>

        <form 
            onSubmit={handleSubmit(handleForm)} 
            className="mt-10 bg-white shadow-lg p-10 rounded-lg"
            noValidate
        >
            <ProjectForm register={register} errors={errors}/>
            <input type="submit" value="Guardar Cambios" className="bg-fuchsia-600 w-full p-3 text-white uppercase hover:bg-fuchsia-700 font-bold cursor-pointer transition-colors" />

        </form>
        </div>
    </>
  )
}

export default EditProjectForm
