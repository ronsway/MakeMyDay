import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './components/LanguageSwitcher'
import TaskStats from './components/TaskStats'
import './App.css'

function App() {
  const { t, i18n } = useTranslation();
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Welcome to MakeMyDay! 🌟', completed: false },
    { id: 2, text: 'Try adding your first task below', completed: false }
  ])
  const [newTaskText, setNewTaskText] = useState('')
  const [filter, setFilter] = useState('all') // all, active, completed
  const [editingTask, setEditingTask] = useState(null)
  const [editText, setEditText] = useState('')

  // Set initial document direction and language
  useEffect(() => {
    document.documentElement.dir = i18n.language === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const addTask = (text) => {
    if (text.trim()) {
      setTasks([...tasks, { id: Date.now(), text: text.trim(), completed: false }])
      setNewTaskText('')
    }
  }

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  const clearCompleted = () => {
    setTasks(tasks.filter(task => !task.completed))
  }

  const startEditing = (task) => {
    setEditingTask(task.id)
    setEditText(task.text)
  }

  const saveEdit = () => {
    if (editText.trim()) {
      setTasks(tasks.map(task => 
        task.id === editingTask ? { ...task, text: editText.trim() } : task
      ))
    }
    setEditingTask(null)
    setEditText('')
  }

  const cancelEdit = () => {
    setEditingTask(null)
    setEditText('')
  }

  const handleEditKeyPress = (e) => {
    if (e.key === 'Enter') {
      saveEdit()
    } else if (e.key === 'Escape') {
      cancelEdit()
    }
  }

  const handleAddClick = () => {
    addTask(newTaskText)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      addTask(e.target.value.trim())
    }
  }

  // Filter tasks based on current filter
  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed
    if (filter === 'completed') return task.completed
    return true // 'all'
  })

  // Calculate stats
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(task => task.completed).length
  const activeTasks = totalTasks - completedTasks
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <div className="App">
      <LanguageSwitcher />
      
      <header className="App-header">
        <h1>🌟 {t('app.title')}</h1>
        <p>{t('app.subtitle')}</p>
      </header>
      
      <main className="main-content">
        <div className="task-container">
          <h2>{t('tasks.title')}</h2>
          
          {/* Task Statistics */}
          <TaskStats 
            total={totalTasks}
            completed={completedTasks}
            active={activeTasks}
            progress={progressPercentage}
          />
          
          {/* Add Task Section */}
          <div className="add-task">
            <div className="add-task-input-group">
              <input
                type="text"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                placeholder={t('tasks.placeholder')}
                onKeyPress={handleKeyPress}
                aria-label={t('accessibility.add_task')}
              />
              <button 
                onClick={handleAddClick}
                className="add-task-button"
                disabled={!newTaskText.trim()}
                aria-label={t('actions.add')}
              >
                {t('actions.add')}
              </button>
            </div>
          </div>
          
          {/* Task Filters */}
          <div className="task-filters">
            <button 
              className={`filter-button ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              {t('filters.all')} ({totalTasks})
            </button>
            <button 
              className={`filter-button ${filter === 'active' ? 'active' : ''}`}
              onClick={() => setFilter('active')}
            >
              {t('filters.active')} ({activeTasks})
            </button>
            <button 
              className={`filter-button ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              {t('filters.completed')} ({completedTasks})
            </button>
          </div>
          
          {/* Task List */}
          <div className="task-list">
            {filteredTasks.length === 0 ? (
              <div className="empty-message">
                <p>{filter === 'all' ? t('tasks.empty') : t(`tasks.empty_${filter}`)}</p>
              </div>
            ) : (
              filteredTasks.map(task => (
                <div key={task.id} className={`task ${task.completed ? 'completed' : ''}`}>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    aria-label={t('accessibility.task_checkbox')}
                  />
                  
                  {editingTask === task.id ? (
                    <div className="edit-task-container">
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyPress={handleEditKeyPress}
                        onBlur={saveEdit}
                        className="edit-task-input"
                        autoFocus
                      />
                      <div className="edit-actions">
                        <button onClick={saveEdit} className="save-button" title={t('actions.save')}>
                          ✓
                        </button>
                        <button onClick={cancelEdit} className="cancel-button" title={t('actions.cancel')}>
                          ×
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <span onDoubleClick={() => startEditing(task)}>{task.text}</span>
                      <div className="task-actions">
                        <button
                          onClick={() => startEditing(task)}
                          className="edit-button"
                          aria-label={t('accessibility.edit_task')}
                          title={t('actions.edit')}
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="delete-button"
                          aria-label={t('accessibility.delete_task')}
                          title={t('actions.delete')}
                        >
                          ×
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
          
          {/* Bulk Actions */}
          {completedTasks > 0 && (
            <div className="bulk-actions">
              <button 
                onClick={clearCompleted}
                className="clear-completed-button"
              >
                {t('actions.clear_completed')} ({completedTasks})
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App