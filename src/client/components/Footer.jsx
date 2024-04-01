import {Link} from "react-router-dom";

function MainFooter() {
  return (
    <footer className="footer px-4 py-2.5 mt-10 bg-primary text-neutral-content">
        <nav className="mx-auto">
            <p className="">Copyright © {new Date().getFullYear()} | <Link to="/faq" className="hover: underline">FAQ/About</Link></p>
        </nav>
    </footer>
  );
}

export default MainFooter;