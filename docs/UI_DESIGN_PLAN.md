# ParentFlow UI Design Plan

**Date:** October 14, 2025  
**Status:** Design & Planning Phase  
**Target:** Complete Modern UI for MVP Phase 1-3

---

## 🎯 Overview

Transform the current simple todo app into a **comprehensive ParentFlow application** with:

- Multi-user authentication
- Family & child management
- Task & event management
- Calendar views
- Notifications center
- Settings & preferences
- Mobile-responsive Hebrew RTL design

---

## 📐 Application Structure

### **Layout Architecture**

```text
┌─────────────────────────────────────────────┐
│  App Shell (Authenticated)                  │
│  ┌────────────────────────────────────────┐ │
│  │  Top Navigation Bar                    │ │
│  │  - Logo                                │ │
│  │  - Family/Child Selector              │ │
│  │  - User Profile Menu                  │ │
│  └────────────────────────────────────────┘ │
│  ┌──────┬──────────────────────────────────┐ │
│  │ Side │  Main Content Area               │ │
│  │ Nav  │  - Dashboard / Tasks / Calendar  │ │
│  │      │  - Children / Notifications      │ │
│  │      │  - Settings                      │ │
│  └──────┴──────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

---

## 🗂️ Page Structure

### **1. Authentication Pages** (Public)

#### 1.1 Login Page

- **Route:** `/login`
- **Components:**
  - Email input
  - Password input (with show/hide toggle)
  - "Remember me" checkbox
  - Login button
  - "Forgot password?" link
  - "Don't have an account? Register" link
  - Language switcher
- **Features:**
  - Form validation
  - Error messages
  - Loading state
  - RTL support

#### 1.2 Registration Page

- **Route:** `/register`
- **Components:**
  - Name input
  - Email input
  - Password input (with strength indicator)
  - Confirm password input
  - Phone number (optional)
  - Terms & conditions checkbox
  - Register button
  - "Already have an account? Login" link
- **Features:**
  - Real-time validation
  - Password strength meter
  - Email format validation
  - Error messages

#### 1.3 Forgot Password Page

- **Route:** `/forgot-password`
- **Components:**
  - Email input
  - Send reset link button
  - Back to login link
- **Features:**
  - Email validation
  - Success/error messages
  - Rate limiting UI feedback

#### 1.4 Reset Password Page

- **Route:** `/reset-password/:token`
- **Components:**
  - New password input
  - Confirm password input
  - Reset button
- **Features:**
  - Password strength indicator
  - Match validation
  - Success redirect to login

---

### **2. Main Dashboard** (Authenticated)

#### 2.1 Today View (Default Home)

- **Route:** `/` or `/today`
- **Layout:**

  ```text
  ┌─────────────────────────────────────────┐
  │  📅 Today - Monday, October 14, 2025   │
  │  ─────────────────────────────────────  │
  │  👤 Child Selector: [All | Ron | Maya] │
  └─────────────────────────────────────────┘
  
  ┌─────────────────────────────────────────┐
  │  📊 Today's Summary                     │
  │  ├─ 3 Tasks Due                        │
  │  ├─ 2 Events Upcoming                  │
  │  └─ 1 Notification Pending             │
  └─────────────────────────────────────────┘
  
  ┌─────────────────────────────────────────┐
  │  ✅ Tasks Due Today                     │
  │  ├─ □ Math homework (Ron) - 18:00      │
  │  ├─ □ Buy snacks (Maya) - 15:00        │
  │  └─ ☑ Pack bag (Ron) - 07:00 ✓        │
  └─────────────────────────────────────────┘
  
  ┌─────────────────────────────────────────┐
  │  📅 Events Today                        │
  │  ├─ 🎨 Art Class (Maya) - 16:00-17:00  │
  │  └─ ⚽ Soccer Practice (Ron) - 18:00   │
  └─────────────────────────────────────────┘
  ```

- **Features:**
  - Real-time clock
  - Child filter
  - Quick task completion
  - Snooze buttons
  - Add task/event buttons
  - Drag to reorder

#### 2.2 This Week View

- **Route:** `/week`
- **Layout:**

  ```text
  ┌─────────────────────────────────────────┐
  │  📅 This Week - Oct 14-20, 2025        │
  └─────────────────────────────────────────┘
  
  ┌─────────────────────────────────────────┐
  │  Monday 14  │  3 tasks  │  2 events    │
  │  ├─ Math homework                      │
  │  ├─ Art Class - 16:00                  │
  │  └─ Soccer Practice - 18:00            │
  └─────────────────────────────────────────┘
  
  ┌─────────────────────────────────────────┐
  │  Tuesday 15 │  2 tasks  │  1 event     │
  │  ├─ English test                       │
  │  └─ Dance Class - 17:00                │
  └─────────────────────────────────────────┘
  ```

- **Features:**
  - Grouped by day
  - Collapsible sections
  - Quick actions
  - Visual indicators (overdue, urgent)

---

### **3. Tasks Management**

#### 3.1 All Tasks Page

- **Route:** `/tasks`
- **Components:**
  - Task list with filters
  - Sidebar filters:
    - Status (Open, Done, Cancelled)
    - Priority (Normal, High, Urgent)
    - Category (Homework, Chores, Shopping, etc.)
    - Child
    - Date range
  - Sort options (Due date, Priority, Created)
  - Bulk actions (Mark done, Delete, Assign)
- **Task Card Design:**

  ```text
  ┌─────────────────────────────────────────┐
  │  □  Math Homework                      ⋮│
  │     👤 Ron  📅 Today 18:00  🔴 Urgent   │
  │     📝 Chapter 5 exercises 1-10         │
  │     🏷️ Homework                         │
  │     [✓ Done] [⏰ Snooze] [✏️ Edit]      │
  └─────────────────────────────────────────┘
  ```

#### 3.2 Task Detail Modal

- **Components:**
  - Title (editable)
  - Description/Notes
  - Child assignment
  - Due date picker
  - Due time picker
  - Priority selector
  - Category selector
  - Tags input
  - Recurring options
  - Reminder settings
  - Source info (if from message)
  - Action buttons (Save, Delete, Cancel)

#### 3.3 Create Task Form

- **Route:** `/tasks/new` (modal overlay)
- **Components:**
  - All fields from task detail
  - Smart defaults (today, current child)
  - Template suggestions

---

### **4. Calendar View**

#### 4.1 Calendar Page

- **Route:** `/calendar`
- **Views:**
  - Month view (default)
  - Week view
  - Day view
- **Layout:**

  ```text
  ┌─────────────────────────────────────────┐
  │  ◀ October 2025 ▶   [Month|Week|Day]   │
  └─────────────────────────────────────────┘
  
  ┌───┬───┬───┬───┬───┬───┬───┐
  │Sun│Mon│Tue│Wed│Thu│Fri│Sat│
  ├───┼───┼───┼───┼───┼───┼───┤
  │   │   │ 1 │ 2 │ 3 │ 4 │ 5 │
  ├───┼───┼───┼───┼───┼───┼───┤
  │ 6 │ 7 │ 8 │ 9 │10 │11 │12 │
  ├───┼───┼───┼───┼───┼───┼───┤
  │13 │14●│15 │16 │17 │18 │19 │  ● = Today
  │   │3T │2T │1T │   │   │   │  T = Tasks
  │   │2E │1E │   │   │   │   │  E = Events
  └───┴───┴───┴───┴───┴───┴───┘
  ```

- **Features:**
  - Color coding by child
  - Event badges
  - Task indicators
  - Click to view day
  - Drag & drop to reschedule
  - Add event button

#### 4.2 Event Detail Modal

- **Components:**
  - Title
  - Description
  - Start date/time
  - End date/time
  - All-day toggle
  - Location
  - Child assignment
  - Calendar sync status
  - Reminder settings
  - Recurring options

---

### **5. Children Management**

#### 5.1 Children List Page

- **Route:** `/children`
- **Layout:**

  ```text
  ┌─────────────────────────────────────────┐
  │  👨‍👩‍👧‍👦 Family Members          [+ Add Child]│
  └─────────────────────────────────────────┘
  
  ┌─────────────────────────────────────────┐
  │  👦 Ron Cohen                          ⋮│
  │  🏫 Grade 5 | Einstein Elementary       │
  │  🎂 Age 10 | Class 5A                   │
  │  📊 15 Active Tasks | 8 Upcoming Events │
  │  [View Profile] [Edit]                  │
  └─────────────────────────────────────────┘
  
  ┌─────────────────────────────────────────┐
  │  👧 Maya Cohen                         ⋮│
  │  🏫 Grade 3 | Einstein Elementary       │
  │  🎂 Age 8 | Class 3B                    │
  │  📊 8 Active Tasks | 5 Upcoming Events  │
  │  [View Profile] [Edit]                  │
  └─────────────────────────────────────────┘
  ```

#### 5.2 Child Profile Page

- **Route:** `/children/:id`
- **Tabs:**
  - Overview
  - Tasks (child's tasks only)
  - Events (child's events)
  - Schedule (weekly view)
- **Components:**
  - Avatar
  - Name, grade, school
  - Birthday, age
  - Class/teacher info
  - Statistics
  - Recent activity

#### 5.3 Add/Edit Child Form

- **Modal/Page:** `/children/new` or `/children/:id/edit`
- **Fields:**
  - Avatar upload
  - Name (required)
  - Birthday (date picker)
  - Grade
  - School name
  - Class name
  - Teacher name
  - Notes

---

### **6. Notifications Center**

#### 6.1 Notifications Page

- **Route:** `/notifications`
- **Layout:**

  ```text
  ┌─────────────────────────────────────────┐
  │  🔔 Notifications      [Mark All Read]  │
  │  ─────────────────────────────────────  │
  │  Filters: [All] [Unread] [Tasks] [Events]│
  └─────────────────────────────────────────┘
  
  ┌─────────────────────────────────────────┐
  │  ● Math homework due in 1 hour          │
  │    Ron | Today 18:00                    │
  │    [Snooze 1h] [Snooze 3h] [Done]      │
  └─────────────────────────────────────────┘
  
  ┌─────────────────────────────────────────┐
  │  ○ Art class starting soon              │
  │    Maya | Today 16:00                   │
  │    [View Event]                         │
  └─────────────────────────────────────────┘
  ```

- **Features:**
  - Real-time updates
  - Unread count badge
  - Snooze options (1h, 3h, tomorrow 8am)
  - Quick actions
  - Grouped by type
  - Time-relative display

#### 6.2 Notification Settings

- **Integrated in Settings page**
- **Options:**
  - Enable/disable notifications
  - Quiet hours (from/to time)
  - Notification types (tasks, events, messages)
  - Sound/vibration
  - Email notifications
  - Push notifications

---

### **7. Settings**

#### 7.1 Settings Page

- **Route:** `/settings`
- **Sections:**

##### Profile Settings

- Name
- Email (read-only, show verified badge)
- Phone
- Avatar upload
- Change password button

##### Family Settings

- Family name
- Timezone selector
- Locale/Language
- Date format
- Time format (12h/24h)

##### Notification Preferences

- Quiet hours toggle
- Quiet hours time range
- Task reminders
- Event reminders
- Daily digest (morning/evening)
- Email notifications
- Push notifications

##### Privacy & Security

- Two-factor authentication (coming soon)
- Active sessions list
- Logout from all devices
- Delete account

##### Integrations (Future)

- WhatsApp connection status
- Calendar sync (Google/Outlook)
- Email connection

##### About

- App version
- Terms of service
- Privacy policy
- Contact support
- Logout button

---

### **8. Messages (Future Phase)**

#### 8.1 Messages Inbox

- **Route:** `/messages`
- **Layout:**

  ```text
  ┌─────────────────────────────────────────┐
  │  💬 Messages               [Filters]    │
  └─────────────────────────────────────────┘
  
  ┌─────────────────────────────────────────┐
  │  📱 WhatsApp - Teacher Sarah           │
  │  "Reminder: Math test tomorrow"         │
  │  ✓ Parsed: 1 task created              │
  │  Today 14:30                           │
  └─────────────────────────────────────────┘
  ```

- **Features:**
  - Source badges (WhatsApp, Email, Manual)
  - Parse status
  - Created tasks/events count
  - Original message view
  - Parsed data view

---

## 🎨 Design System

### **Color Palette**

Based on `COLOR_PALETTE.md`:

#### Primary Colors

- **Teal/Turquoise**: `#177E89` - Primary actions, links
- **Coral/Sunset**: `#E76F51` - Urgent, warnings
- **Navy/Deep Blue**: `#1A535C` - Headers, text

#### Functional Colors

- **Success**: `#4ECDC4` (Turquoise Light)
- **Warning**: `#F4A261` (Orange)
- **Error**: `#E76F51` (Coral)
- **Info**: `#177E89` (Teal)

#### Neutral Colors

- **Charcoal**: `#2D3142` - Dark backgrounds
- **Silver/Gray**: `#BFC0C0` - Borders, disabled
- **Cream/Beige**: `#F7F7F2` - Light backgrounds

### **Typography**

#### Font Families

- **Hebrew**: 'Rubik', 'Heebo', 'Assistant', sans-serif
- **English**: 'Inter', 'Roboto', sans-serif

#### Font Sizes

- **H1**: 2.5rem (40px)
- **H2**: 2rem (32px)
- **H3**: 1.5rem (24px)
- **Body**: 1rem (16px)
- **Small**: 0.875rem (14px)
- **Tiny**: 0.75rem (12px)

#### Font Weights

- **Regular**: 400
- **Medium**: 500
- **Semi-bold**: 600
- **Bold**: 700

### **Spacing Scale**

```css
--spacing-xs: 0.25rem;   /* 4px */
--spacing-sm: 0.5rem;    /* 8px */
--spacing-md: 1rem;      /* 16px */
--spacing-lg: 1.5rem;    /* 24px */
--spacing-xl: 2rem;      /* 32px */
--spacing-2xl: 3rem;     /* 48px */
```

### **Border Radius**

```css
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-xl: 16px;
--radius-full: 9999px;
```

### **Shadows**

```css
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 20px rgba(0, 0, 0, 0.15);
--shadow-xl: 0 20px 40px rgba(0, 0, 0, 0.2);
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile First */
--mobile: 0px;           /* 0 - 479px */
--tablet: 480px;         /* 480 - 767px */
--desktop: 768px;        /* 768 - 1023px */
--large-desktop: 1024px; /* 1024px+ */
```

### **Mobile Adaptations**

- Single column layout
- Bottom navigation bar
- Collapsible sidebar
- Simplified task cards
- Touch-friendly buttons (min 44px)
- Swipe gestures

---

## 🧩 Component Library

### **Core Components**

1. **Button**
   - Variants: primary, secondary, outline, ghost, danger
   - Sizes: sm, md, lg
   - States: default, hover, active, disabled, loading

2. **Input**
   - Text, email, password, number, tel
   - With label, helper text, error message
   - With icons (prefix/suffix)
   - RTL support

3. **Select/Dropdown**
   - Single select
   - Multi-select with tags
   - Searchable
   - Custom options rendering

4. **DatePicker**
   - Single date
   - Date range
   - Time picker
   - DateTime combined
   - Hebrew calendar support

5. **Modal/Dialog**
   - Sizes: sm, md, lg, xl, full
   - With header, body, footer
   - Backdrop blur
   - Close on escape/backdrop click

6. **Card**
   - With header, body, footer
   - Hoverable
   - Clickable
   - With actions menu

7. **Badge**
   - Variants: default, success, warning, error, info
   - Sizes: sm, md, lg
   - With dot indicator

8. **Avatar**
   - Sizes: xs, sm, md, lg, xl
   - With initials fallback
   - Status indicator
   - Group (overlapping)

9. **Toast/Notification**
   - Position: top-right, bottom-right, etc.
   - Auto-dismiss
   - With actions
   - Stack multiple

10. **Loading/Spinner**
    - Full page overlay
    - Inline spinner
    - Skeleton loaders

11. **Empty State**
    - With illustration
    - With action button
    - Contextual messages

12. **Navigation**
    - Top nav bar
    - Side nav bar
    - Bottom tab bar (mobile)
    - Breadcrumbs

---

## 🔀 Navigation Flow

```text
Login ──────────> Dashboard (Today View)
  │                    │
  ├─> Register         ├─> Tasks
  └─> Forgot Pwd       ├─> Calendar
                       ├─> Children
                       ├─> Notifications
                       ├─> Messages (Future)
                       └─> Settings
```

---

## ✅ Implementation Phases

### **Phase 1: Foundation** (Week 1-2)

- [ ] Set up routing (React Router)
- [ ] Create design system (CSS variables)
- [ ] Build core component library
- [ ] Set up authentication context
- [ ] Create layout components

### **Phase 2: Authentication** (Week 2-3)

- [ ] Login page
- [ ] Registration page
- [ ] Forgot/Reset password pages
- [ ] Protected route wrapper
- [ ] Auth state management

### **Phase 3: Dashboard** (Week 3-4)

- [ ] Today view
- [ ] This Week view
- [ ] Summary cards
- [ ] Quick actions

### **Phase 4: Task Management** (Week 4-5)

- [ ] Task list page
- [ ] Task detail modal
- [ ] Create/edit task form
- [ ] Filters and sorting
- [ ] Bulk actions

### **Phase 5: Children** (Week 5-6)

- [ ] Children list page
- [ ] Child profile page
- [ ] Add/edit child form
- [ ] Child selector component

### **Phase 6: Calendar** (Week 6-7)

- [ ] Calendar views (month/week/day)
- [ ] Event detail modal
- [ ] Create/edit event form
- [ ] Calendar integration

### **Phase 7: Notifications** (Week 7-8)

- [ ] Notifications center
- [ ] Notification badge
- [ ] Snooze functionality
- [ ] Real-time updates

### **Phase 8: Settings** (Week 8-9)

- [ ] Profile settings
- [ ] Family settings
- [ ] Notification preferences
- [ ] Privacy & security

---

## 🎯 Success Metrics

### **User Experience**

- [ ] < 3 clicks to any major feature
- [ ] < 2s page load time
- [ ] 100% mobile responsive
- [ ] WCAG 2.1 AA accessibility

### **Visual Design**

- [ ] Consistent spacing throughout
- [ ] Proper color contrast ratios
- [ ] Smooth animations (60fps)
- [ ] Perfect RTL support

### **Functionality**

- [ ] All CRUD operations work
- [ ] Form validation is clear
- [ ] Error messages are helpful
- [ ] Loading states everywhere

---

## 📦 Dependencies to Install

```json
{
  "react-router-dom": "^6.20.0",
  "react-hook-form": "^7.49.0",
  "zod": "^3.22.0",
  "date-fns": "^3.0.0",
  "react-datepicker": "^4.25.0",
  "framer-motion": "^10.16.0",
  "react-hot-toast": "^2.4.1",
  "lucide-react": "^0.300.0",
  "clsx": "^2.0.0",
  "tailwindcss": "^3.4.0" (optional)
}
```

---

## 🚀 Next Steps

1. **Review this plan** - Does it match your vision?
2. **Approve/adjust** - Any changes needed?
3. **Start implementation** - Begin with Phase 1

---

**Questions for Review:**

1. Do you want to use Tailwind CSS or stick with plain CSS?
2. Should we add animations (Framer Motion) or keep it simple?
3. Do you want dark mode support from the start?
4. Should mobile be the primary focus or desktop?
5. Any specific design preferences or examples to follow?

---

**Estimated Total Time:** 8-9 weeks for complete UI
**Estimated Cost:** ~60-80 hours of development

Let me know your thoughts and we can start building! 🚀
