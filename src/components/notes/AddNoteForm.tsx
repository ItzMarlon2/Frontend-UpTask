import type { NoteFormData } from "@/types/index"
import { useForm } from "react-hook-form"
import ErrorMessage from "../ErrorMessage"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createNote } from "@/api/NoteApi"
import { toast } from "react-toastify"
import { useLocation, useParams } from "react-router-dom"

const AddNoteForm = () => {
    const initialValues: NoteFormData = {
        content: ""
    }
    const {projectId} = useParams()
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const taskId = queryParams.get('viewTask')!
    const queryClient = useQueryClient()
    const {register, handleSubmit, reset, formState:{errors}}  = useForm({defaultValues: initialValues})
    const {mutate} = useMutation({
        mutationFn: createNote,
        onError: (error) =>{
            toast.error(error.message)
        },
        onSuccess: (data) =>{
            reset()
            toast.success(data)
            queryClient.invalidateQueries({queryKey: ['task', taskId]})
            queryClient.invalidateQueries({queryKey: ['projectDetails', projectId]})
        }
    })

    const handleForm = (formData: NoteFormData) => mutate({formData, projectId: projectId!, taskId})
        
    
  return (
    <form onSubmit={handleSubmit(handleForm)} className="space-y-3" noValidate>
        <div className="flex flex-col gap-2">
            <label htmlFor="content" className="font-bold">Crear Nota:</label>
            <input
             id="content"
             type="text"
             placeholder="Contenido de la nota"
             className="w-full p-3 border border-gray-300"
             {...register("content", {
                required: "El contenido de la nota es obligatorio",
             })}
            />
            {errors.content &&(
                <ErrorMessage>{errors.content.message}</ErrorMessage>
            )}
            <input type="submit" value="Crear nota" className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-2 text-white font-black cursor-pointer" />

        </div>
    </form>
  )
}

export default AddNoteForm
