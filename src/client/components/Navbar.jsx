import {Link, NavLink} from "react-router-dom";
import {Helmet} from "react-helmet";
import SearchBar from "./SearchBar.jsx";

function MainNav() {
    return (
        <div>
            <div className="navbar h-16 font-sans max-w-screen-xl mx-auto">
                <Helmet>
                    <title>Skingredients</title>
                </Helmet>
                <div className="navbar-start">
                    <Link to="/" className="btn btn-ghost text-xl hover:bg-transparent pr-10">
                        <img src="/src/assets/sparkles.png" alt="logo" className="w-10 h-10"/>Skingredients</Link>

                    <SearchBar/>
                </div>
                <div className="navbar-center hidden lg:flex">
                </div>
                <div className="navbar-end">
                    <Link to="/login" className="btn btn-ghost">Login</Link>
                </div>
            </div>
            <div className="navbar h-16 font-sans bg-primary">
                <div className="navbar-center lg:flex max-w-screen-xl mx-auto">
                    <ul className="flex gap-8 items-center px-1">
                        <li><NavLink to="/products"
                                     className={({isActive}) => isActive ? 'text-with-underline underline-effect' : ''}>Products</NavLink>
                        </li>
                        <li><NavLink to="/brands"
                                     className={({isActive}) => isActive ? 'text-with-underline underline-effect' : ''}>Brands</NavLink>
                        </li>
                        <li><NavLink to="/routine"
                                     className={({isActive}) => isActive ? 'text-with-underline underline-effect' : ''}>Routine
                            Creator</NavLink></li>
                    </ul>
                </div>
            </div>
        </div>
    );

}

export default MainNav;
