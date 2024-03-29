import {Link} from "react-router-dom";

function MainFooter() {
  return (
    <footer className="footer p-4 bg-primary text-neutral-content">
        <nav>
            <aside className="mb-2 md:mb-0">
                <p className="footer-title">Copyright © {new Date().getFullYear()} - All rights reserved</p>
            </aside>
        </nav>
        <nav>
            <h6 className="footer-title">Company</h6>
        </nav>
        <nav>
            <h6 className="footer-title"><Link to="/faq">FAQ</Link></h6>
        </nav>
    </footer>
  );
}

export default MainFooter;