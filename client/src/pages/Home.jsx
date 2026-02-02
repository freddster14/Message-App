import '../styles/App.css'
import { Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  if(user) return <Navigate to="/dashboard" replace />;


  return (
    <>
      <div>
       <h2>Join our new message platform!</h2>

      </div>
    </>
  )
}

