import { getTaskById } from "@/api/TaskApi"
import { useQuery } from "@tanstack/react-query"
import { Navigate, useLocation, useParams } from "react-router-dom"
import EditTaskModal from "./EditTaskModal"

const EditTaskData = () => {
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const editTask = queryParams.get('editTask')!
    const {projectId} = useParams()

    const {data, isError} = useQuery({
        queryKey: ['task', editTask],
        queryFn: () => getTaskById({taskId: editTask, projectId: projectId!}),
        enabled: !!editTask,
        retry: false
    })

    if(isError) return <Navigate to='404'/>
    
  if(data) return <EditTaskModal task={data}/>
}

export default EditTaskData
