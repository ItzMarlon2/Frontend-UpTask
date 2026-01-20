import { deleteTask } from "@/api/TaskApi";
import type { TaskProject } from "@/types/index";
import { Menu, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Fragment } from "react/jsx-runtime";
import { useDraggable } from "@dnd-kit/core";

type TaskCardProps = {
  task: TaskProject
  canEdit: boolean
};

const TaskCard = ({ task, canEdit}: TaskCardProps) => {
  const {attributes, listeners, setNodeRef, transform, isDragging} = useDraggable({
    id: task._id,
  })
  const navigate = useNavigate()
  const {projectId} = useParams()
  const queryClient = useQueryClient()
  const {mutate} = useMutation({
    mutationFn: deleteTask,
    onError: (error) =>{
      toast.error(error.message)
    },
    onSuccess: (data) =>{
      toast.success(data)
      queryClient.invalidateQueries({queryKey: ['projectDetails', projectId]})
    }
  })

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition: isDragging ? 'none' : 'transform 0.2s ease',
    zIndex: isDragging ? 1000 : 1,
    boxShadow: isDragging ? '0px 4px 12px rgba(0, 0, 0, 0.15)' : undefined,
    position: isDragging ? 'relative' : undefined,
  } as React.CSSProperties;

  return (
    <li
    
         
    style={style} className="relative bg-white shadow-md border border-gray-200 rounded-lg p-5 transition hover:shadow-lg hover:border-gray-300 flex justify-between gap-3">
      <div 
        ref={setNodeRef}
         {...listeners}
         {...attributes}
        className="min-w-0 flex flex-col gap-y-4">
        <button
          type="button"
          className="text-xl font-bold text-slate-600 text-left"
          onClick={() => navigate(location.pathname+`?viewTask=${task._id}`)}
        >
          {task.name}
        </button>
        <p className="text-slate-500">{task.description}</p>
      </div>
      <div className="flex shrink-0  gap-x-6">
        <Menu as="div" className="relative flex-none">
          <Menu.Button className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
            <span className="sr-only">opciones</span>
            <EllipsisVerticalIcon className="h-9 w-9" aria-hidden="true" />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
              <Menu.Item>
                <button
                  onClick={() => navigate(location.pathname+`?viewTask=${task._id}`)}
                  type="button"
                  className="block px-3 py-1 text-sm leading-6 text-gray-900"
                >
                  Ver Tarea
                </button>
              </Menu.Item>
              {canEdit && (
                <>
                <Menu.Item>
                <button
                  onClick={() => navigate(location.pathname+`?editTask=${task._id}`)}
                  type="button"
                  className="block px-3 py-1 text-sm leading-6 text-gray-900"
                >
                  Editar Tarea
                </button>
              </Menu.Item>

              <Menu.Item>
                <button
                  onClick={() => mutate({projectId: projectId!, taskId: task._id})}
                  type="button"
                  className="block px-3 py-1 text-sm leading-6 text-red-500"
                >
                  Eliminar Tarea
                </button>
              </Menu.Item>
                </>
              )}
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </li>
  );
};

export default TaskCard;
