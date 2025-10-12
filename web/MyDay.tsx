/**
 * ParentFlow POC - Hebrew RTL React Interface
 * Locale: he-IL | TZ: Asia/Jerusalem | RTL UI
 * No PII in logs.
 */

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import './MyDay.css';
import MessageProcessor from './MessageProcessor';
import VersionDisplay, { VersionStatusIndicator, FeatureFlag } from './VersionDisplay';
import VersionManager from './versionManager';

interface Task {
  id: string;
  title: string;
  category: string;
  priority: 'normal' | 'high';
  status: 'open' | 'done';
  dueDate: string;
  createdAt: string;
}

interface Event {
  id: string;
  title: string;
  startTime: string;
  location?: string;
}

interface Analytics {
  totalMinutesSaved: number;
  averageDailyMinutes: number;
  recentData: Array<{
    date: string;
    timeSavedMinutes: number;
  }>;
}

export default function MyDay() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMessageProcessor, setShowMessageProcessor] = useState(false);

  const today = new Date();
  const todayFormatted = format(today, 'EEEE, d MMMM yyyy', { locale: he });

  useEffect(() => {
    loadTodayData();
  }, []);

  const loadTodayData = async () => {
    try {
      setLoading(true);
      setError(null);

      const todayStr = format(today, 'yyyy-MM-dd');
      const versionManager = VersionManager.getInstance();
      const versionHeaders = versionManager.getVersionHeaders();
      
      // Load tasks
      const tasksResponse = await fetch(`/api/tasks?dateFrom=${todayStr}&dateTo=${todayStr}`, {
        headers: versionHeaders
      });
      if (!tasksResponse.ok) throw new Error('Failed to load tasks');
      const tasksData = await tasksResponse.json();
      setTasks(tasksData.tasks || []);

      // Load events
      const eventsResponse = await fetch(`/api/events?dateFrom=${todayStr}&dateTo=${todayStr}`, {
        headers: versionHeaders
      });
      if (!eventsResponse.ok) throw new Error('Failed to load events');
      const eventsData = await eventsResponse.json();
      setEvents(eventsData.events || []);

      // Load analytics
      const analyticsResponse = await fetch('/api/analytics', {
        headers: versionHeaders
      });
      if (!analyticsResponse.ok) throw new Error('Failed to load analytics');
      const analyticsData = await analyticsResponse.json();
      setAnalytics(analyticsData);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'שגיאה בטעינת הנתונים');
    } finally {
      setLoading(false);
    }
  };

  const completeTask = async (taskId: string) => {
    try {
      const versionManager = VersionManager.getInstance();
      const versionHeaders = versionManager.getVersionHeaders();
      
      const response = await fetch(`/api/tasks/${taskId}/complete`, {
        method: 'PUT',
        headers: versionHeaders
      });
      
      if (!response.ok) throw new Error('Failed to complete task');
      
      // Update local state
      setTasks(prev => prev.map(task => 
        task.id === taskId 
          ? { ...task, status: 'done' as const }
          : task
      ));
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'שגיאה בסימון המשימה');
    }
  };

  const handleNewTasksAndEvents = (data: { tasks: any[], events: any[] }) => {
    // Add new tasks and events from message processing
    if (data.tasks && data.tasks.length > 0) {
      setTasks(prev => [...prev, ...data.tasks]);
    }
    if (data.events && data.events.length > 0) {
      setEvents(prev => [...prev, ...data.events]);
    }
    
    // Close message processor after successful processing
    setShowMessageProcessor(false);
    
    // Refresh analytics
    loadTodayData();
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'equipment': return '🎒';
      case 'homework': return '📚';
      case 'payment': return '💳';
      case 'gift': return '🎁';
      default: return '📋';
    }
  };

  const pendingTasks = tasks.filter(task => task.status === 'open');
  const completedTasks = tasks.filter(task => task.status === 'done');

  if (loading) {
    return (
      <div className="my-day-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>טוען נתונים...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-day-container">
        <div className="error">
          <h2>❌ שגיאה</h2>
          <p>{error}</p>
          <button onClick={loadTodayData} className="retry-button">
            נסה שוב
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="my-day-container">
      {/* Version update banner */}
      <VersionDisplay showUpdateBanner={true} />
      
      {/* Version status indicator (for debugging) */}
      <VersionStatusIndicator />
      
      <header className="my-day-header">
        <h1>� ParentFlow - מערכת תקשורת הורים</h1>
        <p className="date">{todayFormatted}</p>
        <div className="header-actions">
          <button onClick={loadTodayData} className="refresh-button">
            🔄 רענן
          </button>
          <button 
            onClick={() => setShowMessageProcessor(!showMessageProcessor)} 
            className="process-message-button"
          >
            {showMessageProcessor ? '✖️ סגור עיבוד' : '📥 עבד הודעה חדשה'}
          </button>
        </div>
      </header>

      {/* Message Processor */}
      {showMessageProcessor && (
        <MessageProcessor onTasksAndEventsExtracted={handleNewTasksAndEvents} />
      )}

      {/* Analytics Section */}
      <FeatureFlag feature="advancedAnalytics" fallback={
        analytics && (
          <section className="analytics-section">
            <h2>📊 סטטיסטיקות בסיסיות</h2>
            <div className="analytics-grid">
              <div className="analytics-card">
                <div className="analytics-number">{pendingTasks.length}</div>
                <div className="analytics-label">משימות להיום</div>
              </div>
              <div className="analytics-card">
                <div className="analytics-number">{completedTasks.length}</div>
                <div className="analytics-label">הושלמו היום</div>
              </div>
            </div>
          </section>
        )
      }>
        {analytics && (
          <section className="analytics-section">
            <h2>📊 סטטיסטיקות מתקדמות</h2>
            <div className="analytics-grid">
              <div className="analytics-card">
                <div className="analytics-number">{analytics.totalMinutesSaved}</div>
                <div className="analytics-label">דקות שנחסכו סה"כ</div>
              </div>
              <div className="analytics-card">
                <div className="analytics-number">{analytics.averageDailyMinutes}</div>
                <div className="analytics-label">ממוצע יומי</div>
              </div>
              <div className="analytics-card">
                <div className="analytics-number">{pendingTasks.length}</div>
                <div className="analytics-label">משימות להיום</div>
              </div>
              <div className="analytics-card">
                <div className="analytics-number">{Math.round((completedTasks.length / (pendingTasks.length + completedTasks.length)) * 100)}%</div>
                <div className="analytics-label">אחוז השלמה</div>
              </div>
            </div>
          </section>
        )}
      </FeatureFlag>

      {/* Pending Tasks */}
      <section className="tasks-section">
        <h2>📝 משימות להיום ({pendingTasks.length})</h2>
        {pendingTasks.length > 0 ? (
          <div className="tasks-list">
            {pendingTasks.map(task => (
              <div 
                key={task.id} 
                className={`task-item ${task.priority === 'high' ? 'high-priority' : ''}`}
              >
                <div className="task-content">
                  <div className="task-title">
                    {getCategoryIcon(task.category)} {task.title}
                  </div>
                  <div className="task-meta">
                    {task.category && <span className="category">{task.category}</span>}
                    {task.priority === 'high' && <span className="priority">⚠️ חשוב</span>}
                  </div>
                </div>
                <button 
                  onClick={() => completeTask(task.id)}
                  className="complete-button"
                  title="סמן כהושלם"
                >
                  ✓
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>🎉 אין משימות להיום!</p>
          </div>
        )}
      </section>

      {/* Events */}
      <section className="events-section">
        <h2>🗓️ אירועים להיום ({events.length})</h2>
        {events.length > 0 ? (
          <div className="events-list">
            {events.map(event => (
              <div key={event.id} className="event-item">
                <div className="event-title">{event.title}</div>
                <div className="event-meta">
                  <span className="event-time">
                    ⏰ {event.startTime.split('T')[1]?.substring(0, 5)}
                  </span>
                  {event.location && (
                    <span className="event-location">📍 {event.location}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>אין אירועים מתוכננים להיום</p>
          </div>
        )}
      </section>

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <section className="completed-section">
          <h2>✅ הושלמו היום ({completedTasks.length})</h2>
          <div className="tasks-list">
            {completedTasks.map(task => (
              <div key={task.id} className="task-item completed">
                <div className="task-content">
                  <div className="task-title">
                    {getCategoryIcon(task.category)} {task.title}
                  </div>
                </div>
                <span className="completed-check">✓</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <footer className="my-day-footer">
        <p>📱 ParentFlow POC - חוסך זמן יקר להורים</p>
        <p>עודכן: {format(new Date(), 'HH:mm')}</p>
        <VersionDisplay showInFooter={true} compact={false} />
      </footer>
    </div>
  );
}