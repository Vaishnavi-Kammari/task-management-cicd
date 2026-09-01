function TaskItem({ task, onToggle, onDelete }) {
  return (
    <li className={`task-card ${task.completed ? 'completed' : ''}`}>
      <div className="task-content">
        <label className="task-checkbox">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggle(task)}
          />
          <span className="checkmark"></span>
        </label>
        <div className="task-text">
          <h3 className="task-title">{task.title}</h3>
          {task.description && <p className="task-description">{task.description}</p>}
        </div>
      </div>
      <button className="btn btn-delete" onClick={() => onDelete(task.id)}>
        Delete
      </button>
    </li>
  )
}

export default TaskItem
