import { deleteNote } from "@/api/NoteApi"
import { useAuth } from "@/hooks/useAuth"
import type { Note } from "@/types/index"
import { formatDate } from "@/utils/utils"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useMemo } from "react"
import { useLocation, useParams } from "react-router-dom"
import { toast } from "react-toastify"

type NoteDetailsProps = {
    note: Note
}

const NoteDetail = ({note}: NoteDetailsProps) => {
    const {data, isLoading} = useAuth()
    const canDelete = useMemo(() => data && data?._id.toString() === note.createdBy._id.toString(), [data, note.createdBy._id])
    const {projectId} = useParams()
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const taskId = queryParams.get('viewTask')!
    const queryClient = useQueryClient()
    const {mutate} = useMutation({
        mutationFn: deleteNote,
        onError: (error) =>{
            toast.error(error.message)
        },
        onSuccess: (data) =>{
            toast.success(data)
            queryClient.invalidateQueries({queryKey: ['task', taskId]})
            queryClient.invalidateQueries({queryKey: ['projectDetails', projectId]})
        }
    })

    if(isLoading) return 'Cargando...'
  if (data) return (
    <div className="p-3 flex justify-between items-center">
        <div>
        <p>{note.content} por: <span className="font-bold">{note.createdBy.name}</span></p>
        <p className="text-xs text-slate-500"> {formatDate(note.createdAt)}</p>
        </div>
      {canDelete && (
        <button onClick={() => mutate({noteId: note._id, projectId:projectId!, taskId})} type="button" className="bg-red-700 hover:bg-red-500 p-2 text-xs text-white font-bold cursor-pointer transition-colors">
        Eliminar
      </button>
      )}
    </div>
  )
}

export default NoteDetail
