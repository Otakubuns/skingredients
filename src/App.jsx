import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Layout from "./client/components/Layout";
import Home from "./client/pages/Home";
import ProductList from "./client/pages/ProductList";
import Product from "./client/pages/Product";
import Brands from "./client/pages/Brands";
import RoutineCreator from "./client/pages/RoutineCreator.jsx";
import NotFound from "./client/pages/NotFound.jsx";
import Faq from "./client/pages/Faq.jsx";

function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout/>}>
                    <Route index element={<Home/>}/>
                    <Route path="about" element={<h1>About</h1>}/>
                    <Route path="contact" element={<h1>Contact</h1>}/>
                    <Route path="products" element={<ProductList/>}/>
                    <Route path="product/:id" element={<Product/>}/>
                    <Route path="brand/:brand" element={<ProductList/>}/>
                    <Route path="brands" element={<Brands/>}/>
                    <Route path="/category/:category" element={<ProductList/>}/>
                    <Route path="faq" element={<Faq/>}/>
                    <Route path="routine" element={<RoutineCreator/>}/>
                    <Route path="*" element={<NotFound/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App