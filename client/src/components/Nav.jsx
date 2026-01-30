import { Link } from "react-router";
export default function Nav() {
  return (
    <nav>
      <h1>Message App</h1>
      <Link to='/sign-up'>Sign Up</Link>
      <Link to='/sign-in'>Sign In</Link>
    </nav>
  )
}