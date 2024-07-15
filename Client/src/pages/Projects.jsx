import { Link } from "react-router-dom";

export default function Projects() {
  return <div className="h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="sm:text-3xl text-lg">Projects are going to added very soon ...... </h1>
      <Link to={"/"} className="text-blue-500 hover:underline">See Posts</Link>
    </div>
  </div>;
}
