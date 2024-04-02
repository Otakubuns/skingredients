import MainNav from "./Navbar";
import MainFooter from "./Footer";
import {Outlet} from "react-router-dom";

function Layout() {
    return (
        <div className="flex flex-col h-screen justify-between">
            <MainNav/>
            <div className="max-w-screen-xl mx-auto w-full">
                <Outlet/>
            </div>
            <MainFooter/>
        </div>
    );
}

export default Layout;
