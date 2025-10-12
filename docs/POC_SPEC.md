# ParentFlow – POC Specification (Proof of Concept)

## Goal

Demonstrate an end-to-end functional flow proving that ParentFlow can:

1. Ingest parent communication (WhatsApp export, free text, or email message),
2. Extract **tasks and events** from Hebrew natural language,
3. Store structured data in a database,
4. Display "My Day" to the parent (list of actionable tasks),
5. Render a schedule view in Hebrew, respecting RTL layout.

---

## 1. Natural Language Processing (Hebrew)

### 1.1 Input Types

| Input Method | Format | Source |
|--------------|--------|---------|
| **WhatsApp Export** | Plain text (.txt) | WhatsApp → Export Chat → Without Media |
| **Free Text** | Multiline string | Parent types directly |
| **Email Message** | Email body | Forward or paste |

### 1.2 Parse Rules

| Pattern | Example | Action |
|---------|---------|---------|
| **Action + Item + Date** | "להביא ציוד ביום רביעי" | Extract as Task |
| **Event + Time/Date** | "פגישה מחר 14:00" | Extract as Event |
| **Conditional/Required** | "חובה להביא" / "עד יום X" | Set priority = high |

### 2.3 Mapping Logic

| Detected Pattern | Output Object | Notes |
|------------------|---------------|-------|
| Action + Item + Date | **Task** | title = "Bring [item]", due_date = date |
| Only Event/Date + Context | **Event** | title = context, default 1 hour |
| "Required/Until" found | **Task/Event** | priority = high |
| Category keywords | **Task/Event** | mapped to `equipment`, `payment`, `homework`, `gift`, `other` |

---

## 3. Date Resolver (Hebrew → ISO)

| Phrase | Rule |
|--------|------|
| היום | refDate |
| מחר | +1 day |
| מחרתיים | +2 days |
| ביום X הקרוב | next weekday X |
| בשבוע הבא | +7 days (same weekday) |
| בחודש הבא | +1 month |

### 3.1 Weekday Mapping

| Hebrew | English | ISO |
|--------|---------|-----|
| ראשון | Sunday | 0 |
| שני | Monday | 1 |
| שלישי | Tuesday | 2 |
| רביעי | Wednesday | 3 |
| חמישי | Thursday | 4 |
| שישי | Friday | 5 |
| שבת | Saturday | 6 |

### 3.2 Month Mapping

| Hebrew | English | Number |
|--------|---------|--------|
| ינואר | January | 1 |
| פברואר | February | 2 |
| מרץ | March | 3 |
| אפריל | April | 4 |
| מאי | May | 5 |
| יוני | June | 6 |
| יולי | July | 7 |
| אוגוסט | August | 8 |
| ספטמבר | September | 9 |
| אוקטובר | October | 10 |
| נובמבר | November | 11 |
| דצמבר | December | 12 |

---

## 4. Database Schema

### 4.1 Tasks Table

```sql
CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  due_date TEXT,
  priority TEXT DEFAULT 'normal',
  category TEXT DEFAULT 'other',
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4.2 Events Table

```sql
CREATE TABLE events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  start_time TEXT,
  duration INTEGER DEFAULT 60,
  location TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4.3 Sample Data

**Tasks:**

```json
[
  {
    "id": 1,
    "title": "להביא ציוד ספורט",
    "due_date": "2024-01-17",
    "priority": "high",
    "category": "equipment"
  },
  {
    "id": 2,
    "title": "לשלם שכר לימוד",
    "due_date": "2024-01-20",
    "priority": "normal",
    "category": "payment"
  }
]
```

**Events:**

```json
[
  {
    "id": 1,
    "title": "פגישת הורים",
    "start_time": "2024-01-18T14:00:00",
    "duration": 120,
    "location": "בית ספר"
  }
]
```

---

## 5. API Endpoints

### 5.1 Process Message

```http
POST /process
Content-Type: application/json

{
  "message": "להביא ציוד ספורט ביום רביעי הקרוב. פגישת הורים מחר ב-14:00"
}
```

**Response:**

```json
{
  "success": true,
  "tasks": [
    {
      "title": "להביא ציוד ספורט",
      "due_date": "2024-01-17",
      "category": "equipment"
    }
  ],
  "events": [
    {
      "title": "פגישת הורים",
      "start_time": "2024-01-16T14:00:00",
      "duration": 120
    }
  ]
}
```

### 5.2 Get My Day

```http
GET /myday?date=2024-01-16
```

**Response:**

```json
{
  "date": "2024-01-16",
  "tasks": [
    {
      "id": 1,
      "title": "להביא ציוד ספורט",
      "due_date": "2024-01-17",
      "priority": "high"
    }
  ],
  "events": [
    {
      "id": 1,
      "title": "פגישת הורים",
      "start_time": "2024-01-16T14:00:00"
    }
  ]
}
```

---

## 6. Web Interface

### 6.1 Components

| Component | Purpose | RTL Support |
|-----------|---------|-------------|
| **MessageInput** | Text area for free input | Yes |
| **MyDayView** | Display tasks + events for today | Yes |
| **TaskList** | Filterable task list | Yes |
| **EventCalendar** | Calendar view | Yes |

### 6.2 RTL Layout

- **Text Direction:** `dir="rtl"` on root element
- **Flex Direction:** Right-to-left layout
- **Typography:** Hebrew fonts (Assistant, Open Sans Hebrew)
- **Alignment:** Text right-aligned by default

### 6.3 Styling

```css
.rtl-container {
  direction: rtl;
  text-align: right;
  font-family: 'Assistant', 'Open Sans Hebrew', sans-serif;
}

.task-item {
  border-right: 3px solid #007bff;
  padding-right: 12px;
  margin-bottom: 8px;
}

.event-item {
  border-right: 3px solid #28a745;
  padding-right: 12px;
  margin-bottom: 8px;
}
```

---

## 7. File Structure

```text
/
├── scripts/
│   ├── demo-poc.ts          # Main demo runner
│   ├── test-nlp.ts          # NLP testing suite
│   └── setup-db.ts          # Database initialization
├── server/
│   ├── api.ts               # Fastify server
│   └── db.ts                # Database connection
├── nlp/
│   ├── parser.ts            # Hebrew text parser
│   ├── date-resolver.ts     # Date extraction
│   └── category-mapper.ts   # Task categorization
├── web/
│   ├── MyDay.tsx           # React RTL interface
│   └── MyDay.css           # RTL styling
├── data/
│   └── parentflow.db       # SQLite database
└── docs/
    └── POC_SPEC.md         # This document
```

---

## 8. Demo Flow

### 8.1 Execution Steps

1. **Setup Database**

   ```bash
   npm run setup-db
   ```

2. **Run NLP Tests**

   ```bash
   npm run test-nlp
   ```

3. **Start API Server**

   ```bash
   npm run start-server
   ```

4. **Launch Web Interface**

   ```bash
   npm run start-web
   ```

5. **Run Complete Demo**

   ```bash
   npm run demo
   ```

### 8.2 Demo Script

The demo will:

1. Process a sample Hebrew message
2. Extract tasks and events
3. Store in database
4. Display "My Day" view
5. Show RTL web interface

---

## 9. Success Criteria

### 9.1 NLP Accuracy

- [ ] **Hebrew text parsing** works for common parent communication patterns
- [ ] **Date extraction** correctly handles relative dates ("מחר", "השבוע")
- [ ] **Task/Event classification** achieves >80% accuracy
- [ ] **Category mapping** correctly identifies equipment, payment, homework, etc.

### 9.2 Technical Implementation

- [ ] **Database operations** store and retrieve data correctly
- [ ] **API endpoints** return properly formatted JSON
- [ ] **Web interface** displays Hebrew text with proper RTL layout
- [ ] **End-to-end flow** completes without errors

### 9.3 User Experience

- [ ] **Input methods** accept WhatsApp exports and free text
- [ ] **"My Day" view** shows relevant tasks for current date
- [ ] **Hebrew typography** is readable and properly aligned
- [ ] **Interface responsiveness** works on desktop and mobile

---

## 10. Known Limitations

### 10.1 NLP Scope

- **Limited vocabulary:** Focused on common parent communication terms
- **Context awareness:** Simple pattern matching, not full semantic understanding
- **Ambiguity handling:** Basic resolution, may require user confirmation

### 10.2 Technical Constraints

- **Database:** SQLite (single-user, local development)
- **Deployment:** Local development environment only
- **Authentication:** No user management in POC
- **Integration:** No actual WhatsApp API connection

---

## 11. Future Enhancements

### 11.1 NLP Improvements

- [ ] **Machine learning models** for better classification accuracy
- [ ] **Context awareness** for ambiguous date references
- [ ] **Multi-language support** (English + Hebrew mixed text)
- [ ] **Voice input** with speech-to-text for Hebrew

### 11.2 Product Features

- [ ] **User authentication** and multi-parent support
- [ ] **WhatsApp integration** via official API
- [ ] **Push notifications** for upcoming tasks/events
- [ ] **Calendar sync** with Google Calendar, Outlook
- [ ] **Family sharing** for household task coordination

### 11.3 Technical Scaling

- [ ] **Cloud deployment** (Azure, AWS)
- [ ] **Real-time updates** via WebSocket
- [ ] **Mobile app** (React Native)
- [ ] **Analytics** for usage patterns and optimization

---

## 12. Testing Strategy

### 12.1 Unit Tests

- [ ] **Date resolver** with edge cases
- [ ] **Category mapper** with various Hebrew terms
- [ ] **Database operations** with valid/invalid data
- [ ] **API endpoints** with different request formats

### 12.2 Integration Tests

- [ ] **Complete NLP pipeline** end-to-end
- [ ] **Database + API** data consistency
- [ ] **Web interface + API** request/response cycle

### 12.3 Manual Testing

- [ ] **Real WhatsApp exports** from actual parent groups
- [ ] **Hebrew typing** in web interface
- [ ] **RTL layout** verification across browsers
- [ ] **Mobile responsiveness** testing

---

## 13. Environment Variables

```env
TZ=Asia/Jerusalem
SMTP_HOST=localhost
SMTP_PORT=1025
PARENT_EMAIL=parent@example.com
REDACT_RAW=false
```

---

## 14. Dependencies

### 14.1 Core Libraries

```json
{
  "fastify": "^4.x",
  "sqlite3": "^5.x",
  "prisma": "^5.x",
  "react": "^18.x",
  "typescript": "^5.x"
}
```

### 14.2 Hebrew NLP

```json
{
  "he-date-parser": "^1.x",
  "hebrew-calendar": "^1.x",
  "rtl-detect": "^1.x"
}
```

### 14.3 Development Tools

```json
{
  "nodemon": "^3.x",
  "ts-node": "^10.x",
  "jest": "^29.x",
  "@types/node": "^20.x"
}
```

---

## End of POC Specification
