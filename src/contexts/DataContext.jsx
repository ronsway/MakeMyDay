import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

// Mock data for development
const MOCK_CHILDREN = [
  { id: '1', name: 'שרה', age: 8, avatar: '👧' },
  { id: '2', name: 'דני', age: 12, avatar: '👦' },
  { id: '3', name: 'מיה', age: 5, avatar: '👶' },
];

const MOCK_TASKS = [
  {
    id: '1',
    title: 'הכנת כריכים לבית הספר',
    description: 'הכן כריכים לשרה ודני',
    status: 'open',
    priority: 'normal',
    dueDate: new Date().toISOString().split('T')[0],
    childId: '1',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'אישור מבחן מתמטיקה',
    description: 'לחתום על מבחן המתמטיקה של דני',
    status: 'done',
    priority: 'urgent',
    dueDate: new Date().toISOString().split('T')[0],
    childId: '2',
    createdAt: new Date().toISOString(),
  },
];

const MOCK_EVENTS = [
  {
    id: '1',
    title: 'פגישת הורים',
    description: 'פגישה עם המורה של שרה',
    startTime: new Date().toISOString().split('T')[0] + 'T16:00:00',
    endTime: new Date().toISOString().split('T')[0] + 'T17:00:00',
    childId: '1',
    location: 'בית הספר',
    type: 'meeting',
  },
];

const DataContext = createContext(null);

export function DataProvider({ children: childrenProp }) {
  const { isAuthenticated, user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChildId, setSelectedChildId] = useState('all');

  // Load data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    } else {
      setTasks([]);
      setEvents([]);
      setChildren([]);
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Mock data loading functions for development
  async function loadAllData() {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Load mock data from localStorage or use defaults
      const savedTasks = JSON.parse(localStorage.getItem('parentflow_tasks') || 'null');
      const savedEvents = JSON.parse(localStorage.getItem('parentflow_events') || 'null');
      const savedChildren = JSON.parse(localStorage.getItem('parentflow_children') || 'null');
      
      setTasks(savedTasks || MOCK_TASKS);
      setEvents(savedEvents || MOCK_EVENTS);
      setChildren(savedChildren || MOCK_CHILDREN);
      
      // Save to localStorage if not already saved
      if (!savedTasks) localStorage.setItem('parentflow_tasks', JSON.stringify(MOCK_TASKS));
      if (!savedEvents) localStorage.setItem('parentflow_events', JSON.stringify(MOCK_EVENTS));
      if (!savedChildren) localStorage.setItem('parentflow_children', JSON.stringify(MOCK_CHILDREN));
      
    } catch (error) {
      console.error('Failed to load data:', error);
      // Fallback to mock data
      setTasks(MOCK_TASKS);
      setEvents(MOCK_EVENTS);
      setChildren(MOCK_CHILDREN);
    } finally {
      setLoading(false);
    }
  }

  function saveToLocalStorage() {
    localStorage.setItem('parentflow_tasks', JSON.stringify(tasks));
    localStorage.setItem('parentflow_events', JSON.stringify(events));
    localStorage.setItem('parentflow_children', JSON.stringify(children));
  }

  // Task operations (mock implementations)
  async function createTask(taskData) {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newTask = {
        id: Date.now().toString(),
        ...taskData,
        createdAt: new Date().toISOString(),
        status: taskData.status || 'open',
      };
      
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      localStorage.setItem('parentflow_tasks', JSON.stringify(updatedTasks));
      
      toast.success('המשימה נוספה בהצלחה! ✅');
      return { success: true, task: newTask };
    } catch (error) {
      console.error('Failed to create task:', error);
      toast.error('שגיאה ביצירת משימה');
      return { success: false };
    }
  }

  async function updateTask(taskId, updates) {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const updatedTasks = tasks.map((t) => 
        t.id === taskId ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
      );
      
      setTasks(updatedTasks);
      localStorage.setItem('parentflow_tasks', JSON.stringify(updatedTasks));
      
      const updatedTask = updatedTasks.find(t => t.id === taskId);
      toast.success('המשימה עודכנה! ✓');
      return { success: true, task: updatedTask };
    } catch (error) {
      console.error('Failed to update task:', error);
      toast.error('שגיאה בעדכון משימה');
      return { success: false };
    }
  }

  async function deleteTask(taskId) {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const updatedTasks = tasks.filter((t) => t.id !== taskId);
      setTasks(updatedTasks);
      localStorage.setItem('parentflow_tasks', JSON.stringify(updatedTasks));
      
      toast.success('המשימה נמחקה');
      return { success: true };
    } catch (error) {
      console.error('Failed to delete task:', error);
      toast.error('שגיאה במחיקת משימה');
      return { success: false };
    }
  }

  async function toggleTask(taskId) {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const newStatus = task.status === 'done' ? 'open' : 'done';
    return updateTask(taskId, { status: newStatus });
  }

  // Event operations (mock implementations)
  async function createEvent(eventData) {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newEvent = {
        id: Date.now().toString(),
        ...eventData,
        createdAt: new Date().toISOString(),
      };
      
      const updatedEvents = [...events, newEvent];
      setEvents(updatedEvents);
      localStorage.setItem('parentflow_events', JSON.stringify(updatedEvents));
      
      toast.success('האירוע נוסף בהצלחה! 📅');
      return { success: true, event: newEvent };
    } catch (error) {
      console.error('Failed to create event:', error);
      toast.error('שגיאה ביצירת אירוע');
      return { success: false };
    }
  }

  async function updateEvent(eventId, updates) {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const updatedEvents = events.map((e) => 
        e.id === eventId ? { ...e, ...updates, updatedAt: new Date().toISOString() } : e
      );
      
      setEvents(updatedEvents);
      localStorage.setItem('parentflow_events', JSON.stringify(updatedEvents));
      
      const updatedEvent = updatedEvents.find(e => e.id === eventId);
      toast.success('האירוע עודכן! ✓');
      return { success: true, event: updatedEvent };
    } catch (error) {
      console.error('Failed to update event:', error);
      toast.error('שגיאה בעדכון אירוע');
      return { success: false };
    }
  }

  async function deleteEvent(eventId) {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const updatedEvents = events.filter((e) => e.id !== eventId);
      setEvents(updatedEvents);
      localStorage.setItem('parentflow_events', JSON.stringify(updatedEvents));
      
      toast.success('האירוע נמחק');
      return { success: true };
    } catch (error) {
      console.error('Failed to delete event:', error);
      toast.error('שגיאה במחיקת אירוע');
      return { success: false };
    }
  }

  // Helper function to enrich items with child information
  const enrichWithChildInfo = (items) => {
    if (!Array.isArray(items) || !Array.isArray(children)) return [];
    
    return items.map(item => {
      const child = children.find(c => c.id === item.childId);
      return {
        ...item,
        child: child || null
      };
    });
  };

  // Filtered data (with safety checks and child info)
  const allTasksWithChildren = enrichWithChildInfo(Array.isArray(tasks) ? tasks : []);
  const allEventsWithChildren = enrichWithChildInfo(Array.isArray(events) ? events : []);

  const filteredTasks =
    selectedChildId === 'all'
      ? allTasksWithChildren
      : allTasksWithChildren.filter((t) => t.childId === selectedChildId);

  const filteredEvents =
    selectedChildId === 'all'
      ? allEventsWithChildren
      : allEventsWithChildren.filter((e) => e.childId === selectedChildId);

  // Today's tasks and events
  const today = new Date().toISOString().split('T')[0];
  const todaysTasks = filteredTasks.filter((t) => t.dueDate === today);
  const todaysEvents = filteredEvents.filter((e) => e.startTime?.startsWith(today));

  // Stats
  const stats = {
    totalTasks: filteredTasks.length,
    completedTasks: filteredTasks.filter((t) => t.status === 'done').length,
    activeTasks: filteredTasks.filter((t) => t.status === 'open').length,
    todaysTasks: todaysTasks.length,
    todaysEvents: todaysEvents.length,
    urgentTasks: filteredTasks.filter((t) => t.priority === 'urgent' && t.status === 'open').length,
  };

  const value = {
    // Data
    tasks: filteredTasks,
    events: filteredEvents,
    children,
    loading,
    
    // Today's data
    todaysTasks,
    todaysEvents,
    
    // Stats
    stats,
    
    // Selected child
    selectedChildId,
    setSelectedChildId,
    
    // Operations
    createTask,
    updateTask,
    deleteTask,
    toggleTask,
    createEvent,
    updateEvent,
    deleteEvent,
    loadAllData,
  };

  return <DataContext.Provider value={value}>{childrenProp}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}
