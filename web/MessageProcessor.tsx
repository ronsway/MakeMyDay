/**
 * ParentFlow Message Processor Component
 * Processes Hebrew school communications and extracts tasks/events
 */

import React, { useState } from 'react';
import './MessageProcessor.css';

interface MessageProcessorProps {
  onTasksAndEventsExtracted: (data: { tasks: any[], events: any[] }) => void;
}

export default function MessageProcessor({ onTasksAndEventsExtracted }: MessageProcessorProps) {
  const [message, setMessage] = useState('');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const sampleMessages = [
    {
      title: 'הודעה מגן הילדים',
      content: `שלום הורים יקרים,
מזכירות לכם שמחר יום רביעי 15/11 יש צורך להביא:
- חולצה כחולה לטקס
- בקבוק מים אישי
- תשלום של 50 שקל לטיול

הטקס יתחיל בשעה 09:00 באולם הגדול.
בהצלחה!`
    },
    {
      title: 'הודעה מבית הספר',  
      content: `הורים יקרים,
ביום חמישי הקרוב 16/11 תתקיים ישיבת הורים בשעה 19:00.
נא להביא:
- דו״ח ציונים חתום
- תשלום של 120 שקל לפעילויות

חובה להגיע בזמן!`
    },
    {
      title: 'הודעת WhatsApp',
      content: `🏫 הודעה חשובה!
מחר יש מבחן מתמטיקה - נא להכין את הילדים
להביא מחשבון ועפרונות 
מסיבת יום הולדת לרועי ביום שישי - להביא מתנה עד 30 שקל
📚📐✏️`
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setProcessing(true);
    try {
      const response = await fetch('/api/ingest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messageContent: message,
          source: 'manual'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process message');
      }

      const data = await response.json();
      setResult(data);
      
      // Transform API response to expected format
      const tasks = data.results?.filter((r: any) => r.type === 'task').map((r: any) => r.data) || [];
      const events = data.results?.filter((r: any) => r.type === 'event').map((r: any) => r.data) || [];
      
      // Pass extracted data to parent component
      onTasksAndEventsExtracted({
        tasks,
        events
      });

    } catch (error) {
      console.error('Error processing message:', error);
      setResult({ error: 'שגיאה בעיבוד ההודעה' });
    } finally {
      setProcessing(false);
    }
  };

  const loadSample = (sample: typeof sampleMessages[0]) => {
    setMessage(sample.content);
    setResult(null);
  };

  const clearMessage = () => {
    setMessage('');
    setResult(null);
  };

  return (
    <div className="message-processor">
      <div className="processor-header">
        <h2>🗨️ עיבוד הודעות מבית הספר</h2>
        <p>הדביקו הודעה מ-WhatsApp, אימייל או כתבו טקסט חופשי</p>
      </div>

      <form onSubmit={handleSubmit} className="message-form">
        <div className="input-section">
          <label htmlFor="message-input">הודעה מבית הספר/גן:</label>
          <textarea
            id="message-input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="דוגמה: להביא חולצה כחולה מחר לטקס. ישיבת הורים ביום חמישי בשעה 19:00"
            rows={6}
            dir="rtl"
            disabled={processing}
          />
        </div>

        <div className="action-buttons">
          <button 
            type="submit" 
            disabled={!message.trim() || processing}
            className="process-button"
          >
            {processing ? '⏳ מעבד...' : '🔍 עבד הודעה'}
          </button>
          
          <button 
            type="button" 
            onClick={clearMessage}
            className="clear-button"
            disabled={processing}
          >
            🗑️ נקה
          </button>
        </div>
      </form>

      <div className="sample-messages">
        <h3>דוגמאות להודעות:</h3>
        <div className="samples-grid">
          {sampleMessages.map((sample, index) => (
            <div key={index} className="sample-card">
              <h4>{sample.title}</h4>
              <div className="sample-preview">
                {sample.content.slice(0, 100)}...
              </div>
              <button 
                onClick={() => loadSample(sample)}
                className="load-sample-button"
                disabled={processing}
              >
                טען דוגמה
              </button>
            </div>
          ))}
        </div>
      </div>

      {result && (
        <div className="processing-result">
          {result.error ? (
            <div className="result-error">
              <h3>❌ שגיאה</h3>
              <p>{result.error}</p>
            </div>
          ) : (
            <div className="result-success">
              <h3>✅ ההודעה עובדה בהצלחה!</h3>
              
              {result.results && result.results.filter((r: any) => r.type === 'task').length > 0 && (
                <div className="extracted-tasks">
                  <h4>📝 משימות שנמצאו ({result.results.filter((r: any) => r.type === 'task').length}):</h4>
                  <ul>
                    {result.results.filter((r: any) => r.type === 'task').map((item: any, index: number) => {
                      const task = item.data;
                      return (
                        <li key={index} className={`task-item ${task.priority === 'high' ? 'high-priority' : ''}`}>
                          <strong>{task.title}</strong>
                          {task.dueDate && <span className="due-date"> - {task.dueDate}</span>}
                          {task.category && <span className="category"> ({task.category})</span>}
                          {task.priority === 'high' && <span className="priority">⚠️</span>}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {result.results && result.results.filter((r: any) => r.type === 'event').length > 0 && (
                <div className="extracted-events">
                  <h4>🗓️ אירועים שנמצאו ({result.results.filter((r: any) => r.type === 'event').length}):</h4>
                  <ul>
                    {result.results.filter((r: any) => r.type === 'event').map((item: any, index: number) => {
                      const event = item.data;
                      return (
                        <li key={index} className="event-item">
                          <strong>{event.title}</strong>
                          {event.startTime && <span className="start-time"> - {event.startTime}</span>}
                          {event.location && <span className="location"> במקום: {event.location}</span>}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              <div className="result-actions">
                <button 
                  onClick={() => setResult(null)}
                  className="close-result-button"
                >
                  ✓ סגור תוצאות
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}