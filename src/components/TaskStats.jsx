import { useTranslation } from 'react-i18next'
import './TaskStats.css'

function TaskStats({ total, completed, active, progress }) {
  const { t } = useTranslation()

  return (
    <div className="task-stats">
      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-number">{total}</div>
          <div className="stat-label">{t('stats.total')}</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{active}</div>
          <div className="stat-label">{t('stats.active')}</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{completed}</div>
          <div className="stat-label">{t('stats.completed')}</div>
        </div>
      </div>
      
      <div className="progress-section">
        <div className="progress-header">
          <span className="progress-label">{t('stats.progress')}</span>
          <span className="progress-percentage">{progress}%</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="progress-message">
          {progress === 100 && total > 0 ? (
            <span className="celebration">🎉 {t('stats.all_done')}</span>
          ) : progress >= 75 ? (
            <span className="encouragement">💪 {t('stats.almost_there')}</span>
          ) : progress >= 50 ? (
            <span className="encouragement">⚡ {t('stats.halfway')}</span>
          ) : progress > 0 ? (
            <span className="encouragement">🚀 {t('stats.great_start')}</span>
          ) : (
            <span className="neutral">✨ {t('stats.ready_to_start')}</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default TaskStats