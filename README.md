# Project Management System

## Test login credentials

### Director
- Email: director@example.com
- Password: director123


## 📦 Build

### Development
```bash
npm run dev      # Starts dev server on :3000
npm run lint     # ESLint validation
```

### Production
```bash
npm run build    # Creates optimized production build
npm start        # Serves production build
```

### Environment Variables
```env
NEXT_PUBLIC_API_URL=https://localhost:7013/api
```

## 🏗️ Technical Architecture

### Frontend Stack
- **Framework**: Next.js 16 (App Router with React Server Components)
- **Language**: TypeScript 5 (strict mode disabled)
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand

### Design Patterns Implemented
- **Repository Pattern**: Service layer abstraction for API calls
- **Compound Component Pattern**: Wizard steps composition
- **Render Props**: File upload with customizable rendering
- **Custom Hooks**: Reusable state logic extraction
- **Higher-Order Components**: AuthProtected wrapper
- **Controlled Components**: Form state management

## 📁 Project Structure

```
src/
├── app/                           # Next.js App Router
│   ├── page.tsx                  # Dashboard with stats (RSC)
│   ├── layout.tsx                # Root layout with Toaster
│   ├── globals.css               # Tailwind directives + custom CSS
│   ├── login/page.tsx            # Public route (no AuthProtected)
│   ├── employees/page.tsx        # CRUD with dialogs (Director only)
│   ├── projects/
│   │   ├── page.tsx             # List with filters/sorting
│   │   ├── new/page.tsx         # 5-step wizard (create)
│   │   └── [id]/
│   │       ├── page.tsx         # Detail view with tasks
│   │       └── edit/page.tsx    # 5-step wizard (update)
│   └── tasks/
│       ├── page.tsx             # List with filters
│       ├── new/page.tsx         # Create form
│       └── [id]/page.tsx        # Detail + inline edit
│
├── components/
│   ├── ui/                       # shadcn/ui base components
│   │   ├── button.tsx           # Radix Button with variants
│   │   ├── card.tsx             # Radix Card composition
│   │   ├── dialog.tsx           # Radix Dialog (modal)
│   │   ├── input.tsx            # Styled input
│   │   ├── label.tsx            # Radix Label
│   │   └── select.tsx           # Radix Select (dropdown)
│   │
│   ├── employees/               # Feature-specific components
│   │   ├── add-employee-dialog.tsx
│   │   ├── edit-employee-dialog.tsx
│   │   └── employees-table.tsx
│   │
│   ├── projects/wizard/         # Wizard step components
│   │   ├── project-basic-info-step.tsx
│   │   ├── project-companies-step.tsx
│   │   ├── project-manager-step.tsx
│   │   ├── project-employees-step.tsx
│   │   ├── project-files-step.tsx
│   │   └── wizard-progress.tsx   # Animated progress bar
│   │
│   ├── auth-protected.tsx       # HOC for route protection
│   ├── confirm-dialog.tsx       # Reusable confirmation modal
│   ├── employee-select.tsx      # Dropdown for employee selection
│   ├── file-upload.tsx          # Drag-drop file upload
│   ├── loader.tsx               # Bouncing dots animation
│   ├── navigation.tsx           # Responsive navbar
│   └── task-card.tsx            # Task display component
│
├── lib/
│   ├── api-client.ts            # HTTP client with generics
│   └── utils.ts                 # cn() helper for class merging
│
├── services/                     # API service layer
│   ├── auth.service.ts          # login, register
│   ├── employees.service.ts     # Full CRUD
│   ├── projects.service.ts      # CRUD + employee management
│   └── tasks.service.ts         # CRUD + filters
│
├── store/
│   └── auth-store.ts            # Zustand + persist middleware
│
└── types/
    └── index.ts                 # Shared TypeScript definitions
```