# Multiple Activities App

A Next.js application with Supabase integration featuring multiple activity modules.

## Features

- **Activity 1**: Todo List with CRUD operations
- **Activity 2**: Google Drive "Lite" - Photo management
- **Activity 3**: Food Review App - Food photos with reviews
- **Activity 4**: Pokemon Review App - Pokemon search and reviews
- **Activity 5**: Markdown Notes App - Notes with Markdown support

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp env.example .env.local
```

3. Fill in your Supabase credentials in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

4. Set up the database schema:
```bash
# Run the SQL in supabase/schema.sql in your Supabase SQL Editor
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Testing

This project uses Jest and React Testing Library for unit and integration tests.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Structure

Tests are organized as follows:

- **Unit Tests**: Component-level tests in `__tests__` directories
  - `components/auth/__tests__/` - Authentication form tests
  - `components/notes/__tests__/` - Notes component tests

- **Integration Tests**: Server action and API tests
  - `app/actions/__tests__/` - Server action tests
  - `lib/supabase/__tests__/` - Supabase client tests

- **Navigation Tests**: Ensure all activity links are present
  - `app/__tests__/` - Page and navigation tests

### What We Test

#### Unit Tests
1. **Input Field Labels**: Verify all form inputs have correct labels
2. **Input Validation**: Test error messages for invalid inputs
3. **Password Field Type**: Ensure password fields use `type="password"`
4. **Component Rendering**: Verify components render correctly

#### Integration Tests
1. **Server Actions**: Test authentication and CRUD operations
   - Valid credentials return expected status codes
   - Invalid inputs display appropriate error messages
   - Supabase API calls are made with correct parameters

2. **Navigation**: Ensure all activity links are present and functional
   - All 5 activities are accessible when authenticated
   - Login forms appear when not authenticated

3. **Supabase Properties**: Verify required Supabase API properties
   - Environment variables are validated
   - Client has expected methods (`auth`, `from`, etc.)
   - Error handling for missing configuration

### Test Coverage Goals

- **Components**: All user-facing components have basic rendering tests
- **Server Actions**: All CRUD operations are tested
- **Navigation**: All routes are verified to be accessible
- **Error Handling**: Invalid inputs and missing configuration are tested

## Building for Production

```bash
npm run build
npm start
```

## Deployment

The app is configured for Vercel deployment. Ensure all environment variables are set in your Vercel project settings.

## Project Structure

```
worksheet2/
├── app/                    # Next.js app directory
│   ├── (protected)/       # Protected routes
│   ├── actions/           # Server actions
│   └── __tests__/         # Page tests
├── components/             # React components
│   ├── auth/              # Authentication components
│   ├── forms/             # Form components
│   └── notes/             # Notes components
├── lib/                    # Utility libraries
│   └── supabase/          # Supabase clients
├── supabase/              # Database schema
└── __tests__/             # Test files
```

