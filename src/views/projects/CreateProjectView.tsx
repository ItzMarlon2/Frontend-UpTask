import ProjectForm from "@/components/projects/ProjectForm"
import { useForm } from "react-hook-form"
import { Link, useNavigate  } from "react-router-dom"
import type { ProjectFormData } from "@/types/index"
import { createProject } from "@/api/ProjectApi"
import { toast } from "react-toastify"
import { useMutation } from "@tanstack/react-query"

const CreateProjectView = () => {
    const initialValues: ProjectFormData = {
        projectName: "",
        clientName: "",
        description: ""
    }
    const {register, handleSubmit, formState:{errors}} = useForm({defaultValues:initialValues})
    const navigate = useNavigate()
    const {mutate} = useMutation({
        mutationFn: createProject,
        onError: (error) =>{
            toast.error(error.message)
        },
        onSuccess: (data) =>{
            toast.success(data)
            navigate('/')
        }
    })

    const handleForm = (formData: ProjectFormData) => mutate(formData)    

  return (
    <>
    <div className="max-w-3xl mx-auto ">

    <h1 className="text-5xl font-black">Crear Proyecto</h1> 
        <p className="text-2xl font-ligth text-gray-500 mt-5">Llena el siguiente formulario para crear un proyecto</p>
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
            <input type="submit" value="Crear Proyecto" className="bg-fuchsia-600 w-full p-3 text-white uppercase hover:bg-fuchsia-700 font-bold cursor-pointer transition-colors" />

        </form>
        </div>
    </>
  )
}

export default CreateProjectView
