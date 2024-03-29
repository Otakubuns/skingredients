import {useEffect, useState} from "react";
import {NavLink} from "react-router-dom";
import {Helmet} from "react-helmet";

function Brands()
{
    let [brands, setBrands] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3002/brands')
            .then(response => response.json())
            // map the data to a new Product.js object array
            .then(data => {
                let brandList = data.map((brand) => {
                    return brand;
                });
                setBrands(brandList);
            });
    }, []);

    return (
        <>
            <Helmet>
                <title>Brands | Skingredients</title>
            </Helmet>
        <h1>Brands</h1>
        <ul>
            {brands.map((brand) => {
                return <li key={brand.BrandID}>
                    <NavLink to={"/brand/" + brand.BrandName}>{brand.BrandName}</NavLink>
                </li>
            })}
        </ul>
        </>
    );
}

export default Brands;