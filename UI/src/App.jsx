import { useEffect, useState } from 'react'
import TaskForm from './components/TaskForm.jsx'
import TaskList from './components/TaskList.jsx'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

function App() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchTasks = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_URL}/api/tasks`)
      if (!res.ok) throw new Error('Failed to load tasks')
      const data = await res.json()
      setTasks(data)
    } catch (err) {
      setError('Could not load tasks. Please make sure the API is running.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const addTask = async (title, description) => {
    setError('')
    try {
      const res = await fetch(`${API_URL}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      })
      if (!res.ok) throw new Error('Failed to add task')
      await fetchTasks()
    } catch (err) {
      setError('Could not add task. Please try again.')
    }
  }

  const toggleTask = async (task) => {
    setError('')
    try {
      const res = await fetch(`${API_URL}/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...task, completed: !task.completed }),
      })
      if (!res.ok) throw new Error('Failed to update task')
      await fetchTasks()
    } catch (err) {
      setError('Could not update task. Please try again.')
    }
  }

  const deleteTask = async (id) => {
    setError('')
    try {
      const res = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete task')
      await fetchTasks()
    } catch (err) {
      setError('Could not delete task. Please try again.')
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Task Management</h1>
        <p className="subtitle">A simple app to demonstrate CI/CD</p>
      </header>

      <main className="app-main">
        <TaskForm onAdd={addTask} />

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Loading tasks...</div>
        ) : (
          <TaskList tasks={tasks} onToggle={toggleTask} onDelete={deleteTask} />
        )}
      </main>
    </div>
  )
}

export default App
 
