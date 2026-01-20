import type { Project, TaskProject, TaskStatus } from "@/types/index";
import TaskCard from "./TaskCard";
import { statusTranslations } from "@/locales/es";
import DropTask from "./DropTask";
import { DndContext, type DragEndEvent} from "@dnd-kit/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateStatus } from "@/api/TaskApi";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

type TaskListProps = {
  tasks: TaskProject[]
  canEdit: boolean
};

type GroupTasks = {
  [key: string]: TaskProject[];
};

const initialStatusGroups: GroupTasks = {
  pending: [],
  onHold: [],
  inProgress: [],
  underReview: [],
  completed: [],
};


const statusColors : {[key:string]: string} = {
    pending: 'border-slate-300',
    onHold: 'border-red-300',
    inProgress: 'border-blue-300',
    underReview: 'border-amber-300',
    completed: 'border-emerald-300',
}

const TaskList = ({ tasks, canEdit}: TaskListProps) => {
  
  const groupedTasks = tasks.reduce((acc, task) => {
    let currentGroup = acc[task.status] ? [...acc[task.status]] : [];
    currentGroup = [...currentGroup, task];
    return { ...acc, [task.status]: currentGroup };
  }, initialStatusGroups);
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const {projectId} = useParams()
  const {mutate} = useMutation({
    mutationFn: updateStatus,
    onError: (error) =>{
        toast.error(error.message)
    },
    onSuccess: (data) =>{
        toast.success(data)
        queryClient.invalidateQueries({queryKey: ['projectDetails', projectId]})

        navigate(location.pathname, {replace: true})
    }
})

  const handleDragEnd = (e: DragEndEvent) =>{
    const {over, active} = e
    if(over && over.id){
      const taskId = active.id.toString()
      const status = over.id as TaskStatus
      mutate({taskId, projectId: projectId!, status})
      queryClient.setQueryData(['projectDetails', projectId], (prevData: Project) => {
        const updatedTask = prevData.tasks.map((task) =>{
          if(task._id === taskId){
            return {
              ...task,
              status
            }
          }
          return task
        })
        return {
          ...prevData,
          tasks: updatedTask
        }
      })
    }
  }
  
  return (
    <>
      <h2 className="text-5xl font-black my-10">Tareas</h2>

      <div className="flex gap-5 overflow-x-scroll 2xl:overflow-auto pb-32">
        <DndContext onDragEnd={handleDragEnd}>
        {Object.entries(groupedTasks).map(([status, tasks]) => (
          <div key={status} className="min-w-[300px] 2xl:min-w-0 2xl:w-1/5">
            <h3 
                className={`capitalize text-xl font-light border bg-white p-3 border-t-8 ${statusColors[status]}`}
            >
                {statusTranslations[status]}
            </h3>
            <DropTask status={status}/>
            <ul className="mt-5 space-y-5">
              {tasks.length === 0 ? (
                <li className="text-gray-500 text-center pt-3">
                  No Hay tareas
                </li>
              ) : (
                tasks.map((task) => <TaskCard key={task._id} task={task} canEdit={canEdit} />)
              )}
            </ul>
          </div> 
        ))} 
        </DndContext>
      </div>
    </>
  );
};

export default TaskList;
