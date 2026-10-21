
import { useCallback, useEffect, useState } from 'react'
import './App.css'

const emptyTask = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  due_date: '',
}

async function api(path, options = {}, token = '') {
  const response = await fetch(`/api${path}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const message = data.message ||
      Object.values(data.errors || {}).flat().join(' ') ||
      'Request failed'
    throw new Error(message)
  }

  return data
}

export default function App() {
  const [token, setToken] = useState(
    () => localStorage.getItem('tm_token') || ''
  )
  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem('tm_user') || 'null')
  )
  const [authMode, setAuthMode] = useState('login')
  const [authForm, setAuthForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  })
  const [tasks, setTasks] = useState([])
  const [form, setForm] = useState(emptyTask)
  const [editingId, setEditingId] = useState(null)
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const fetchTasks = useCallback(async () => {
    if (!token) return

    setLoading(true)
    setError('')

    try {
      const params = new URLSearchParams({ page: String(page) })
      if (status) params.set('status', status)

      const data = await api(`/tasks?${params}`, {}, token)
      setTasks(data.data || [])
      setLastPage(data.last_page || 1)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [token, page, status])

  useEffect(() => {
    if (token) fetchTasks()
  }, [token, fetchTasks])

  function saveSession(data) {
    localStorage.setItem('tm_token', data.token)
    localStorage.setItem('tm_user', JSON.stringify(data.user))
    setToken(data.token)
    setUser(data.user)
    setError('')
    setNotice(data.message || 'Welcome!')
  }

  async function submitAuth(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const endpoint = authMode === 'login' ? '/login' : '/register'
      const data = await api(endpoint, {
        method: 'POST',
        body: JSON.stringify(authForm),
      })
      saveSession(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function logout() {
    try {
      await api('/logout', { method: 'POST' }, token)
    } catch {
      // Clear the local session even if the token has expired.
    }

    localStorage.removeItem('tm_token')
    localStorage.removeItem('tm_user')
    setToken('')
    setUser(null)
    setTasks([])
    setForm(emptyTask)
    setEditingId(null)
    setNotice('')
    setError('')
  }

  function editTask(task) {
    setEditingId(task.id)
    setForm({
      title: task.title || '',
      description: task.description || '',
      status: task.status || 'todo',
      priority: task.priority || 'medium',
      due_date: task.due_date
        ? String(task.due_date).slice(0, 10)
        : '',
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

async function submitTask(e) {
  e.preventDefault();

  console.log('1. Task form submitted');
  console.log('2. Form data:', form);

  setSaving(true);
  setError('');
  setNotice('');

  try {
    const payload = {
      ...form,
      due_date: form.due_date || null,
      description: form.description || null,
    };

    console.log('3. Sending POST request:', payload);

    const data = await api(
      editingId ? `/tasks/${editingId}` : '/tasks',
      {
        method: editingId ? 'PUT' : 'POST',
        body: JSON.stringify(payload),
      },
      token
    );

    console.log('4. API response:', data);

    setNotice(data.message);
    setForm(emptyTask);
    setEditingId(null);
    await fetchTasks();
  } catch (err) {
    console.error('Task save error:', err);
    setError(err.message);
  } finally {
    setSaving(false);
  }
}


  async function deleteTask(id) {
    if (!window.confirm('Delete this task?')) return

    setError('')
    setNotice('')

    try {
      const data = await api(`/tasks/${id}`, {
        method: 'DELETE',
      }, token)

      setNotice(data.message)
      await fetchTasks()
    } catch (err) {
      setError(err.message)
    }
  }

  if (!token) {
    return (
      <main className="auth-page">
        <form className="panel auth-panel" onSubmit={submitAuth}>
          <h1>Task Manager</h1>
          <p className="muted">Organize your work, one task at a time.</p>

          <div className="tabs">
            <button type="button"
              className={authMode === 'login' ? 'active' : ''}
              onClick={() => { setAuthMode('login'); setError('') }}>
              Login
            </button>
            <button type="button"
              className={authMode === 'register' ? 'active' : ''}
              onClick={() => { setAuthMode('register'); setError('') }}>
              Register
            </button>
          </div>

          {authMode === 'register' && (
            <label>
              Name
              <input required maxLength={100}
                value={authForm.name}
                onChange={e => setAuthForm({
                  ...authForm, name: e.target.value
                })} />
            </label>
          )}

          <label>
            Email
            <input type="email" required
              value={authForm.email}
              onChange={e => setAuthForm({
                ...authForm, email: e.target.value
              })} />
          </label>

          <label>
            Password
            <input type="password" required minLength={8}
              value={authForm.password}
              onChange={e => setAuthForm({
                ...authForm, password: e.target.value
              })} />
          </label>

          {authMode === 'register' && (
            <label>
              Confirm password
              <input type="password" required minLength={8}
                value={authForm.password_confirmation}
                onChange={e => setAuthForm({
                  ...authForm,
                  password_confirmation: e.target.value
                })} />
            </label>
          )}

          {error && <p className="error">{error}</p>}

          <button className="primary full" disabled={loading}>
            {loading ? 'Please wait...' :
              authMode === 'login' ? 'Login' : 'Create account'}
          </button>
        </form>
      </main>
    )
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <h1>Task Manager</h1>
          <p className="muted">
            {user?.name} · {user?.role || 'user'}
          </p>
        </div>
        <button className="secondary" onClick={logout}>Logout</button>
      </header>

      {error && <p className="alert error">{error}</p>}
      {notice && <p className="alert success">{notice}</p>}

      <section className="panel">
        <h2>{editingId ? 'Edit task' : 'Create a task'}</h2>

        <form onSubmit={submitTask} className="task-form">
          <label className="wide">
            Title
            <input required maxLength={150}
              placeholder="What needs to be done?"
              value={form.title}
              onChange={e => setForm({
                ...form, title: e.target.value
              })} />
          </label>

          <label className="wide">
            Description
            <textarea rows={3} maxLength={5000}
              value={form.description}
              onChange={e => setForm({
                ...form, description: e.target.value
              })} />
          </label>

          <label>
            Status
            <select value={form.status}
              onChange={e => setForm({
                ...form, status: e.target.value
              })}>
              <option value="todo">To do</option>
              <option value="in_progress">In progress</option>
              <option value="done">Done</option>
            </select>
          </label>

          <label>
            Priority
            <select value={form.priority}
              onChange={e => setForm({
                ...form, priority: e.target.value
              })}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>

          <label>
            Due date
            <input type="date" value={form.due_date}
              onChange={e => setForm({
                ...form, due_date: e.target.value
              })} />
          </label>

          <div className="actions wide">
            <button className="primary" disabled={saving}>
              {saving ? 'Saving...' :
                editingId ? 'Save changes' : 'Add task'}
            </button>
            {editingId && (
              <button type="button" className="secondary"
                onClick={() => {
                  setEditingId(null)
                  setForm(emptyTask)
                }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="panel">
        <div className="list-heading">
          <div>
            <h2>{user?.role === 'admin' ? 'All tasks' : 'My tasks'}</h2>
            <p className="muted">
              Filter tasks and manage your progress.
            </p>
          </div>
          <label>
            Filter by status
            <select value={status}
              onChange={e => {
                setStatus(e.target.value)
                setPage(1)
              }}>
              <option value="">All statuses</option>
              <option value="todo">To do</option>
              <option value="in_progress">In progress</option>
              <option value="done">Done</option>
            </select>
          </label>
        </div>

        {loading ? (
          <p>Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="muted">No tasks found. Add your first task above.</p>
        ) : (
          <div className="task-list">
            {tasks.map(task => (
              <article className="task-card" key={task.id}>
                <div className="task-content">
                  <h3>{task.title}</h3>
                  <p>{task.description || 'No description'}</p>
                  <div className="chips">
                    <span className={`chip status-${task.status}`}>
                      {task.status.replace('_', ' ')}
                    </span>
                    <span className={`chip priority-${task.priority}`}>
                      {task.priority} priority
                    </span>
                    {task.due_date && (
                      <span className="chip">
                        Due {String(task.due_date).slice(0, 10)}
                      </span>
                    )}
                  </div>
                  {task.user && (
                    <small className="muted">
                      Owner: {task.user.name} ({task.user.email})
                    </small>
                  )}
                </div>

                <div className="actions">
                  <button className="secondary"
                    onClick={() => editTask(task)}>Edit</button>
                  <button className="danger"
                    onClick={() => deleteTask(task.id)}>Delete</button>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="pagination">
          <button className="secondary"
            disabled={page <= 1 || loading}
            onClick={() => setPage(p => p - 1)}>
            Previous
          </button>
          <span>Page {page} of {lastPage}</span>
          <button className="secondary"
            disabled={page >= lastPage || loading}
            onClick={() => setPage(p => p + 1)}>
            Next
          </button>
        </div>
      </section>
    </main>
  )
}
