import { isRouteErrorResponse, useRouteError, Link } from "react-router";
import Nav from "../components/Nav";

export default function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return (
        <>
          <Nav />
          <div className="error">
            <h1>404</h1>
            <p>Page Not Found, return <Link to="/">Home</Link></p>
          </div>
        </>
      );
    }

    return (
      <>
        <Nav />
        <div className="error">
          <h1>{error.status} </h1>
          <p>{error.data}, return <Link to="/">Home</Link></p>
        </div>
      </>
    );
  } else if (error instanceof Error) {
    return (
      <>
        <Nav />
        <h1>{error.status || 'Error'}</h1>
        <p>{error.message}, return <Link to="/">Home</Link></p>
      </>
    );
  } else {
    return <h1 className="error">Unknown Error</h1>;
  }
}