import MainNav from "./Navbar";
import MainFooter from "./Footer";
import {Outlet} from "react-router-dom";

function Layout() {
    return (
        <div className="flex flex-col h-screen">
            <MainNav/>
            <div className="max-w-screen-xl mx-auto w-full flex-grow">
                <Outlet/>
            </div>
            <MainFooter/>
        </div>
    );
}

export default Layout;
