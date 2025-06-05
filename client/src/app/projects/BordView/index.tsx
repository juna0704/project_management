// Import necessary hooks, components, and libraries
import { useGetTasksQuery, useUpdateTaskStatusMutation } from '@/state/api'; // RTK query hooks for fetching and updating tasks
import React from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd'; // Drag and drop hooks
import { HTML5Backend } from 'react-dnd-html5-backend'; // Backend for DnD
import { Task as TaskType } from '@/state/api'; // Type for Task object
import { EllipsisVertical, MessageSquareMore, Plus } from 'lucide-react'; // Icon components
import { format } from 'date-fns'; // For date formatting
import Image from 'next/image'; // Next.js optimized image component

// Props for the main board
type BoardProps = {
  id: string; // Project ID
  setIsModalNewTaskOpen: (isOpen: boolean) => void; // Function to open modal
};

// List of task statuses (columns)
const taskStatus = ['To Do', 'Work In Progress', 'Under Review', 'Completed'];

/**
 * Main component that displays the board view.
 * It fetches tasks for a project and distributes them across task status columns.
 */
const BoardView = ({ id, setIsModalNewTaskOpen }: BoardProps) => {
  const {
    data: tasks,
    isLoading,
    error,
  } = useGetTasksQuery({ projectId: Number(id) }); // Fetch tasks from API
  const [updateTaskStatus] = useUpdateTaskStatusMutation(); // Mutation to update task status

  // Called when a task is moved to another column
  const moveTask = (taskId: number, toStatus: string) => {
    updateTaskStatus({ taskId, status: toStatus });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred while fetching tasks</div>;

  return (
    <DndProvider backend={HTML5Backend}>
      {/* Layout for columns */}
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-4">
        {taskStatus.map((status) => (
          <TaskColumn
            key={status}
            status={status}
            tasks={tasks || []}
            moveTask={moveTask}
            setIsModalNewTaskOpen={setIsModalNewTaskOpen}
          />
        ))}
      </div>
    </DndProvider>
  );
};

// Props for individual column
type TaskColumnProps = {
  status: string;
  tasks: TaskType[];
  moveTask: (taskId: number, toStatus: string) => void;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

/**
 * Represents a single column in the board (e.g., "To Do", "Completed").
 * Handles drop behavior and renders tasks of the given status.
 */
const TaskColumn = ({
  status,
  tasks,
  moveTask,
  setIsModalNewTaskOpen,
}: TaskColumnProps) => {
  // Enables drop behavior for tasks
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'task',
    drop: (item: { id: number }) => moveTask(item.id, status), // When dropped, update status
    collect: (monitor: any) => ({
      isOver: !!monitor.isOver(), // Highlight drop area
    }),
  }));

  // Count tasks matching current column status
  const tasksCount = tasks.filter((task) => task.status === status).length;

  // Colors for each status
  const statusColor: any = {
    'To Do': '#2563EB',
    'Work In Progress': '#059669',
    'Under Review': '#D97706',
    Completed: '#000000',
  };

  return (
    <div
      ref={(instance) => {
        drop(instance); // Register drop target
      }}
      className={`sl:py-4 rounded-lg py-2 xl:px-2 ${isOver ? 'bg-blue-100 dark:bg-neutral-950' : ''}`}
    >
      {/* Column header */}
      <div className="mb-3 flex w-full">
        <div
          className={`w-2 !bg-[${statusColor[status]}] rounded-s-lg`}
          style={{ backgroundColor: statusColor[status] }}
        />
        <div className="flex w-full items-center justify-between rounded-e-lg bg-white px-5 py-4 dark:bg-dark-secondary">
          <h3 className="flex items-center text-lg font-semibold dark:text-white">
            {status}{' '}
            <span
              className="ml-2 inline-block rounded-full bg-gray-200 p-1 text-center text-sm leading-none dark:bg-dark-tertiary"
              style={{ width: '1.5rem', height: '1.5rem' }}
            >
              {tasksCount}
            </span>
          </h3>
          <div className="flex items-center gap-1">
            <button className="flex h-6 w-5 items-center justify-center dark:text-neutral-500">
              <EllipsisVertical size={26} />
            </button>
            <button
              className="flex h-6 w-6 items-center justify-center rounded bg-gray-200 dark:bg-dark-tertiary dark:text-white"
              onClick={() => setIsModalNewTaskOpen(true)} // Open modal to add new task
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Render each task */}
      {tasks
        .filter((task) => task.status === status)
        .map((task) => (
          <Task key={task.id} task={task} />
        ))}
    </div>
  );
};

// Props for a single Task card
type TaskProps = {
  task: TaskType;
};

/**
 * Represents a draggable task card.
 * Displays task details like title, priority, tags, assignee, comments, etc.
 */
const Task = ({ task }: TaskProps) => {
  // Makes task draggable
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'task',
    item: { id: task.id }, // Send ID on drag
    collect: (monitor: any) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const taskTagsSplit = task.tags ? task.tags.split(',') : [];

  const formattedStartDate = task.startDate
    ? format(new Date(task.startDate), 'P')
    : '';
  const formattedDueDate = task.dueDate
    ? format(new Date(task.dueDate), 'P')
    : '';

  const numberOfComments = (task.comments && task.comments.length) || 0;

  // Priority color badges
  const PriorityTag = ({ priority }: { priority: TaskType['priority'] }) => (
    <div
      className={`rounded-full px-2 py-1 text-xs font-semibold ${
        priority === 'Urgent'
          ? 'bg-red-200 text-red-700'
          : priority === 'High'
            ? 'bg-yellow-200 text-yellow-700'
            : priority === 'Medium'
              ? 'bg-green-200 text-green-700'
              : priority === 'Low'
                ? 'bg-blue-200 text-blue-700'
                : 'bg-gray-200 text-gray-700'
      }`}
    >
      {priority}
    </div>
  );

  return (
    <div
      ref={(instance) => {
        drag(instance); // Register drag target
      }}
      className={`mb-4 rounded-md bg-white shadow dark:bg-dark-secondary ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
    >
      {/* If task has attachments, show image */}
      {task.attachments && task.attachments.length > 0 && (
        <Image
          src={`/${task.attachments[0].fileURL}`}
          alt={task.attachments[0].fileName}
          width={400}
          height={200}
          className="h-auto w-full rounded-t-md"
        />
      )}
      <div className="p-4 md:p-6">
        {/* Top: Priority & Tags */}
        <div className="flex items-start justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-2">
            {task.priority && <PriorityTag priority={task.priority} />}
            <div className="flex gap-2">
              {taskTagsSplit.map((tag) => (
                <div
                  key={tag}
                  className="rounded-full bg-blue-100 px-2 py-1 text-xs"
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>
          <button className="flex h-6 w-4 flex-shrink-0 items-center justify-center dark:text-neutral-500">
            <EllipsisVertical size={26} />
          </button>
        </div>

        {/* Title & Points */}
        <div className="my-3 flex justify-between">
          <h4 className="text-md font-bold dark:text-white">{task.title}</h4>
          {typeof task.points === 'number' && (
            <div className="text-xs font-semibold dark:text-white">
              {task.points} pts
            </div>
          )}
        </div>

        {/* Dates */}
        <div className="text-xs text-gray-500 dark:text-neutral-500">
          {formattedStartDate && <span>{formattedStartDate} - </span>}
          {formattedDueDate && <span>{formattedDueDate}</span>}
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-neutral-500">
          {task.description}
        </p>

        <div className="mt-4 border-t border-gray-200 dark:border-stroke-dark" />

        {/* Assignees and comments */}
        <div className="mt-3 flex items-center justify-between">
          {/* Avatars */}
          <div className="flex -space-x-[6px] overflow-hidden">
            {task.assignee && (
              <Image
                key={task.assignee.userId}
                src={`/${task.assignee.profilePictureUrl!}`}
                alt={task.assignee.username}
                width={30}
                height={30}
                className="h-8 w-8 rounded-full border-2 border-white object-cover dark:border-dark-secondary"
              />
            )}
            {task.author && (
              <Image
                key={task.author.userId}
                src={`/${task.author.profilePictureUrl!}`}
                alt={task.author.username}
                width={30}
                height={30}
                className="h-8 w-8 rounded-full border-2 border-white object-cover dark:border-dark-secondary"
              />
            )}
          </div>
          {/* Comment count */}
          <div className="flex items-center text-gray-500 dark:text-neutral-500">
            <MessageSquareMore size={20} />
            <span className="ml-1 text-sm dark:text-neutral-400">
              {numberOfComments}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardView;
