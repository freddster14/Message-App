import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import './styles/index.css';
import { AuthProvider } from './context/AuthContext.jsx';
import router from './routes/AppRoutes.jsx';
import { ChatProvider } from './context/ChatProvider.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ChatProvider>
        <RouterProvider  router={router}/>
      </ChatProvider>
    </AuthProvider>
  </StrictMode>,
)
