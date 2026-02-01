import Nav from '../components/Nav'
import { Outlet, useLocation, useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext'

export default function Root() {
  const { loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  return(
    <>
      <Nav />
      <Outlet />
    </>
  )
}