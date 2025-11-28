# Micro Frontend Architecture

## Overview
This document outlines how Nation.Fun exposes components using Module Federation, allowing them to be consumed by host applications like Xperience. This approach enables us to build, deploy, and scale features independently.

## Exposed Components

### AgentDashboard
- **Description**: A comprehensive dashboard for creating and managing AI agents. It handles loading, error, and empty states.
- **Props Interface**:
  ```typescript
  export interface AgentDashboardProps {
    userId?: string;
    theme?: 'light' | 'dark';
    onAgentCreate?: (agentId: string) => void;
    onError?: (error: Error) => void;
  }
  ```
- **Usage Example**:
  ```tsx
  import AgentDashboard from 'nationfun/AgentDashboard';

  const App = () => (
    <AgentDashboard
      userId="user-123"
      theme="dark"
      onAgentCreate={(id) => console.log('Agent created:', id)}
      onError={(err) => console.error('Dashboard error:', err)}
    />
  );
  ```

### AgentList
- **Description**: A simple component that lists AI agents for a given user. (Currently a placeholder).
- **Props Interface**:
  ```typescript
  export interface AgentListProps {
    userId?: string;
    maxItems?: number;
  }
  ```
- **Usage Example**:
  ```tsx
  import AgentList from 'nationfun/AgentList';

  const App = () => (
    <AgentList userId="user-123" maxItems={10} />
  );
  ```

## Integration Guide for Host Applications

### Step 1: Configure Module Federation
In your host application's `next.config.js`, add a `remotes` object to the `NextFederationPlugin` configuration:

```javascript
// next.config.js
new NextFederationPlugin({
  name: 'hostApp',
  remotes: {
    nationfun: 'nationfun@https://nationfun.vercel.app/static/chunks/remoteEntry.js',
  },
  // ... other configs
})
```

### Step 2: Add Type Declarations
Create a declaration file (e.g., `nationfun.d.ts`) to provide TypeScript support for the remote modules:

```typescript
declare module 'nationfun/AgentDashboard';
declare module 'nationfun/AgentList';
```

### Step 3: Import and Use Components
You can now import and use the components dynamically in your application:

```tsx
import React from 'react';

const AgentDashboard = React.lazy(() => import('nationfun/AgentDashboard'));

const MyPage = () => (
  <React.Suspense fallback="Loading Dashboard...">
    <AgentDashboard userId="user-456" />
  </React.Suspense>
);
```

## Troubleshooting
- **CORS Errors**: Ensure that the host application's domain is added to the `NEXT_PUBLIC_ALLOWED_ORIGINS` environment variable in the Nation.Fun project and that `vercel.json` is correctly configured.
- **"Module not found"**: Double-check the remote URL in your Module Federation configuration and ensure the `remoteEntry.js` file is accessible.
