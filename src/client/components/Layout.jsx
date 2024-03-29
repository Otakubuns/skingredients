import MainNav from "./Navbar";
import MainFooter from "./Footer";
import {Outlet} from "react-router-dom";

function Layout() {
    return (
        <div className="flex flex-col h-screen justify-between">
            <MainNav/>
            <div className="mb-auto font-sans max-w-screen-xl mx-auto">
                <Outlet/>
            </div>
            <MainFooter/>
        </div>
    );
}

export default Layout;
