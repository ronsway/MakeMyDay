# Data Model – ParentFlow

## Tables

### users

- id (pk), email, name, role (parent|child|educator|institution_admin), household_id (fk), locale, timezone, created_at

### households

- id (pk), name, timezone, settings (jsonb)

### messages

- id (pk), source_type, raw_text, parsed (jsonb), external_id, class_id, timestamp, created_at

### tasks

- id (pk), message_id (fk), user_id (fk), child_id (fk), title, due_date, status (open|done), priority, category, created_at

### events

- id (pk), title, start_time, end_time, location, household_id (fk), class_id (fk), institution_id (fk), tags (text[])

### institutions

- id (pk), name, address, type, contact_info (jsonb)

### notifications

- id (pk), task_id (fk), user_id (fk), send_time, type (realtime|planned|contextual|followup|emergency), delivered_at

### feedback

- id (pk), user_id (fk), sentiment, time_saved_minutes, created_at

## Indexing Suggestions

- tasks (user_id, due_date), tasks (child_id, status)
- events (class_id, start_time), events (household_id, start_time)
- messages (external_id unique, source_type)
