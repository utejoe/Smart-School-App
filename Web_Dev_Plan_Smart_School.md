# Web Dev Plan: Smart School Attendance & Management (React + Vite)

## 1. Color Palette & UI Guidelines

| Purpose         | Color Code | Description                            |
| --------------- | ---------- | -------------------------------------- |
| Primary         | #1E3A8A    | Deep Blue (buttons, headers, navbars)  |
| Secondary       | #2563EB    | Bright Blue (links, highlights)        |
| Accent          | #FBBF24    | Yellow (alerts, attendance highlights) |
| Background      | #F3F4F6    | Light Gray (page background)           |
| Card Background | #FFFFFF    | White (cards, tables, forms)           |
| Text Primary    | #111827    | Dark Gray (main text)                  |
| Text Secondary  | #6B7280    | Medium Gray (subtext, labels)          |
| Success         | #10B981    | Green (present, success messages)      |
| Error           | #EF4444    | Red (absent, errors)                   |

👉 Keep **Primary** for navbars/buttons, **Accent** for critical highlights, and **Neutral Backgrounds** for data-heavy screens.

---

## 2. Global Styles (React + Tailwind)

Since we’re using **React + Vite**, instead of React Native’s `StyleSheet`, we’ll rely on **Tailwind CSS** for consistent design:

```tsx
// Example Button
<button className="bg-primary text-white px-4 py-2 rounded-lg shadow hover:bg-secondary">
  Submit
</button>

// Example Card
<div className="bg-white p-6 rounded-xl shadow-md">
  <h2 className="text-lg font-bold text-primary">Attendance Report</h2>
  <p className="text-secondary">Summary for JSS1 Mathematics</p>
</div>
```

👉 This makes the web UI faster to style & more consistent across dashboards.

---

## 3. Core Features (Web Version)

### Admin / Director / Proprietor (Browser)

1. **Student Management**
   - Add/edit/delete students
   - Assign students to classes dynamically
   - Import/export via CSV, Excel, PDF

2. **Teacher Management**
   - Create & manage teachers
   - Assign classes & subjects
   - View attendance marked by each teacher

3. **Attendance Tracking**
   - Search by class, subject, teacher, or date
   - Export full attendance reports
   - Correct or approve attendance entries

4. **Notifications**
   - Email/SMS alerts to parents
   - Scheduling (daily/weekly/monthly)

5. **Analytics Dashboard**
   - Attendance charts (per class, subject, teacher)
   - Trends (weekly/monthly/yearly)
   - Downloadable reports

6. **User Role Management**
   - Promote/demote users (`teacher → director → admin → owner`)
   - Role-based access to dashboard features

---

## 4. File Structure (React + Vite Project)

```
/SmartSchoolWeb
│
├─ /public
│   ├─ /icons
│   └─ /images
├─ /src
│   ├─ /components
│   │   ├─ Button.tsx
│   │   ├─ Card.tsx
│   │   ├─ InputField.tsx
│   │   ├─ Table.tsx
│   │   └─ Sidebar.tsx
│   ├─ /pages
│   │   ├─ /auth
│   │   │   └─ Login.tsx
│   │   ├─ /admin
│   │   │   ├─ Dashboard.tsx
│   │   │   ├─ Students.tsx
│   │   │   ├─ Teachers.tsx
│   │   │   └─ Attendance.tsx
│   │   ├─ /director
│   │   │   └─ Reports.tsx
│   │   ├─ /owner
│   │   │   └─ Overview.tsx
│   │   └─ /shared
│   │       └─ Analytics.tsx
│   ├─ /services
│   │   └─ api.ts (Axios calls to backend)
│   ├─ /context
│   │   └─ AuthContext.tsx
│   ├─ /hooks
│   │   └─ useAuth.ts
│   ├─ App.tsx
│   └─ main.tsx
├─ package.json
└─ vite.config.ts
```

---

## 5. Development Flow

1. ✅ Setup project with **React + Vite + Tailwind**  
2. ✅ Add **Auth system** (login + role-based routes)  
3. ✅ Build **Admin Dashboard** (students, teachers, attendance)  
4. ✅ Build **Director Dashboard** (reports + approvals)  
5. ✅ Build **Owner Dashboard** (overview + financials)  
6. ✅ Integrate **export (CSV/PDF)** for reports  
7. ✅ Add **charts/analytics** with Recharts or Chart.js  
