import TaskItem from './TaskItem.jsx'

function TaskList({ tasks, onToggle, onDelete }) {
  if (tasks.length === 0) {
    return <div className="empty-state">No tasks yet. Add one above!</div>
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </ul>
  )
}

export default TaskList
