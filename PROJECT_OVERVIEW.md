# PlanbookAI - AI-Powered Educational Platform

## 🎯 Project Overview

PlanbookAI is a comprehensive, modern SaaS platform designed specifically for high school Chemistry teachers. It leverages AI technology to automate teaching tasks, reduce manual workload, and improve overall productivity.

## 🏗️ Architecture

### Technology Stack
- **Frontend Framework**: React 18.3
- **Routing**: React Router v7 (Data Mode)
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI + shadcn/ui
- **Charts**: Recharts
- **Icons**: Lucide React
- **State Management**: React Context API
- **TypeScript**: Full type safety

### Design System
- **Primary Colors**: Indigo (#6366f1) / Blue
- **Secondary Color**: Cyan
- **Layout**: Sidebar navigation (left) + Top header + Main content area
- **Typography**: Clear hierarchy with custom font weights
- **Spacing**: 8px grid system

## 👥 User Roles

The platform supports 4 distinct user roles with role-based access control:

### 1. Teacher (Primary User)
**Access**: Dashboard, Question Bank, Exercise Generator, Exam Generator, OCR Grading, Analytics

**Key Features**:
- Create and manage lesson plans
- Generate AI-powered exercises
- Create multiple-choice exams with multiple versions
- Use OCR for automatic grading
- View student performance analytics

### 2. Admin
**Access**: Admin Dashboard, User Management, System Settings, Revenue

**Key Features**:
- Manage users and roles
- Configure system settings
- Track revenue and subscriptions
- Monitor system activity

### 3. Manager
**Access**: Manager Dashboard, Subscriptions, Orders, Content Approval

**Key Features**:
- Manage subscription packages
- Process orders
- Approve content submissions
- Monitor business metrics

### 4. Staff
**Access**: Staff Dashboard, Lesson Plans, Question Bank, Templates

**Key Features**:
- Create lesson plans
- Build question bank
- Manage AI prompt templates
- Submit content for approval

## 📁 Project Structure

```
/src/app/
├── App.tsx                 # Main app component with routing
├── routes.ts              # React Router configuration
│
├── components/            # Reusable components
│   ├── AppSidebar.tsx    # Role-based navigation sidebar
│   ├── StatsCard.tsx     # Dashboard metric cards
│   ├── QuestionCard.tsx  # Question display component
│   ├── ProtectedRoute.tsx # Authentication wrapper
│   └── ui/               # shadcn/ui components
│
├── contexts/             # React Context providers
│   └── AuthContext.tsx   # Authentication state management
│
├── data/                 # Mock data
│   └── mockData.ts       # Sample data for all features
│
├── layouts/              # Page layouts
│   └── AppLayout.tsx     # Main authenticated layout
│
├── pages/                # Page components
│   ├── LoginPage.tsx              # Authentication
│   ├── DashboardPage.tsx          # Teacher dashboard
│   ├── QuestionBankPage.tsx       # Question CRUD
│   ├── ExerciseGeneratorPage.tsx  # AI exercise generation
│   ├── ExamGeneratorPage.tsx      # Exam creation
│   ├── OCRGradingPage.tsx         # OCR-based grading
│   ├── AnalyticsPage.tsx          # Performance analytics
│   ├── AdminDashboard.tsx         # Admin overview
│   ├── ManagerDashboard.tsx       # Manager overview
│   ├── StaffDashboard.tsx         # Staff overview
│   └── NotFoundPage.tsx           # 404 page
│
└── types/                # TypeScript definitions
    └── index.ts          # All type definitions
```

## 🚀 Core Features

### 1. Authentication System
- JWT-based session management (mocked)
- Role-based access control
- Quick demo login for all roles
- Auto-redirect based on authentication state

### 2. Dashboard (Teacher)
- Overview statistics with trend indicators
- Quick action cards for common tasks
- Recent activity timeline
- Top performing students
- Topic performance overview

### 3. Question Bank Management
- Create, edit, delete questions
- Multiple question types (Multiple Choice, True/False, Short Answer)
- Difficulty levels (Easy, Medium, Hard)
- Advanced filtering and search
- Tag-based organization
- Duplicate questions feature

### 4. Exercise Generator (AI-Powered)
- Select topic and difficulty
- Specify number of questions
- Add custom instructions
- AI generates questions instantly
- Save to question bank
- Export as PDF

### 5. Exam Generator
- Multi-topic selection
- Randomize question order
- Generate multiple exam versions
- Set duration and points
- Preview before export
- Export to PDF

### 6. OCR-Based Grading System
- Upload scanned answer sheets (PDF/Image)
- Automatic OCR text extraction
- Instant answer comparison
- Detailed scoring breakdown
- Visual results with correct/incorrect indicators
- Export grading results

### 7. Analytics & Results
- Student performance trends
- Topic-wise performance analysis
- Score distribution charts
- Top performers leaderboard
- Interactive data visualizations

### 8. Admin Dashboard
- User management overview
- System activity monitoring
- Revenue tracking
- Subscription management

### 9. Manager Dashboard
- Order processing
- Content approval workflow
- Subscription analytics
- Pending tasks overview

### 10. Staff Dashboard
- Lesson plan creation
- Question bank contribution
- AI template management
- Content submission tracking

## 🎨 Design Highlights

### Color Scheme
- **Primary**: Indigo 600 (#6366f1) - Main actions, navigation
- **Success**: Green 600 - Correct answers, positive trends
- **Warning**: Yellow 600 - Medium difficulty, pending items
- **Error**: Red 600 - Incorrect answers, alerts
- **Info**: Blue 600 - Information, neutral states

### Layout Patterns
- **Sidebar Navigation**: Fixed left sidebar with role-based menu
- **Card-Based UI**: Clean card components for content sections
- **Grid Layouts**: Responsive grid system for stats and content
- **Modal Dialogs**: For forms and detailed views
- **Toast Notifications**: User feedback for actions

### Responsive Design
- Mobile-friendly sidebar (can be collapsed)
- Responsive grid layouts (1, 2, 3, 4 columns)
- Touch-friendly UI elements
- Adaptive typography

## 🔑 Key User Flows

### Teacher Workflow
1. Login → Dashboard → View stats and quick actions
2. Click "Generate Exercise" → Select topic/difficulty → Generate → Review → Save/Export
3. Navigate to Question Bank → Filter/Search → Create/Edit questions
4. Go to Exam Generator → Select topics → Configure → Generate → Preview → Export
5. Upload answer sheet → Select exam → Grade → View results → Export

### Admin Workflow
1. Login → Admin Dashboard → View system overview
2. Check recent users and activity
3. Navigate to specific management areas

### Manager Workflow
1. Login → Manager Dashboard → View pending approvals
2. Process orders and subscriptions
3. Approve/reject content submissions

### Staff Workflow
1. Login → Staff Dashboard → View tasks
2. Create lesson plans or questions
3. Submit for approval

## 📊 Data Structure

### Question
- ID, subject, topic, difficulty, type
- Question text, options, correct answer
- Explanation, points, tags
- Metadata (creator, timestamp)

### Exercise/Exam
- ID, title, subject, topic
- Questions array
- Total points, duration
- Metadata (creator, timestamp)

### Grading Result
- Student info (name, ID)
- Exam reference
- Score, percentage
- Detailed answer breakdown
- Grading metadata

## 🎯 Future Enhancements

1. **Backend Integration**
   - Real API endpoints
   - Database persistence
   - User authentication with JWT

2. **Advanced AI Features**
   - Better question generation
   - Automatic difficulty assessment
   - Content recommendations

3. **Collaboration**
   - Share questions between teachers
   - Department-wide question banks
   - Collaborative lesson planning

4. **Advanced Analytics**
   - Predictive analytics
   - Learning outcome tracking
   - Custom report generation

5. **Mobile App**
   - Native iOS/Android apps
   - Offline mode support
   - Push notifications

## 🧪 Demo Access

Use the quick login buttons on the login page:
- **Teacher**: Full access to teaching tools
- **Admin**: System administration
- **Manager**: Business management
- **Staff**: Content creation

## 📝 Notes

- All data is currently mocked for demonstration
- API calls are simulated with delays
- File uploads are simulated (no actual processing)
- PDF exports are simulated
- OCR functionality is simulated

## 🎓 Educational Context

This platform is designed as a **capstone project** demonstrating:
- Modern React development practices
- TypeScript type safety
- Component-based architecture
- State management
- Routing and navigation
- Responsive design
- User experience design
- Role-based access control
- Data visualization
- Form handling and validation

## 📄 License

This is a demonstration project for educational purposes.
