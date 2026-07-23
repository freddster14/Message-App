import { Link } from "react-router";

export default function Error({ setError, error, style }) {

  if (error) {
    return (
      <>
        <div id="error" className={style}>
          {style === 'modal' && <button onClick={() => setError()}>✖</button>}
          <h1>{error.status.code} </h1>
          {error.status.code === 404 && <p>Page not found, return <Link to="/dashboard">Home.</Link></p>}
          {style === 'modal'
            ? <p>{error.message}</p>
            : <p>{error.message}, try <Link to="/dashboard" reloadDocument>again.</Link></p>
          }
        </div>
      </>
    );
  } else {
    return <h1 className="error">Unknown Error</h1>;
  }
}