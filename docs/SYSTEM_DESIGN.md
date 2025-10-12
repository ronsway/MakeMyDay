# System Design – ParentFlow

## Components

1. **Message Ingestion Service**
   - Parses WhatsApp, Email, Telegram.
   - Normalizes messages → JSON.

2. **NLP Processor**
   - Detects intents, actions, and dates.
   - Categorizes into {task, event, reminder, announcement}.

3. **Task Manager**
   - Saves structured tasks in DB.
   - Links parent, child, educator IDs.

4. **Notification Engine**
   - Multi-layer reminders.
   - Emergency broadcast mode.

5. **Analytics & Insights**
   - Time saved, participation rate.
   - ParentFlow Balance Score.

6. **Admin Panel**
   - Institution-level management and reporting.
