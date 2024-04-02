import {useEffect, useState} from "react";
import {NavLink} from "react-router-dom";
import {Helmet} from "react-helmet";

function Brands() {
    let [brands, setBrands] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3002/brands')
            .then(response => response.json())
            // map the data to a new Product.js object array
            .then(data => {
                // sort alphabetically
                data.sort((a, b) => a.BrandName.localeCompare(b.BrandName));
                setBrands(data);
            });
    }, []);

    // Function to smoothly scroll to a specific section
    const scrollToSection = (sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({behavior: 'smooth'});
        }
    };

    const groupedBrands = brands.reduce((acc, brand) => {
        const firstLetter = brand.BrandName.charAt(0).toUpperCase();
        if (!acc[firstLetter]) {
            acc[firstLetter] = [];
        }
        acc[firstLetter].push(brand);
        return acc;
    }, {});

    return (
        <div className="max-w-screen-xl align-middle p-4">
            <h1 className="text-3xl font-semibold mb-4">Brands</h1>
            <div className="flex space-x-2 mb-12">
                {Array.from({ length: 26 }, (_, index) => (
                    <button
                        key={index}
                        onClick={() => scrollToSection(`brandSection-${String.fromCharCode(65 + index)}`)}
                        className="px-2 py-1 rounded-md bg-primary text-white hover:border-gray-500 focus:outline-none"
                    >
                        {String.fromCharCode(65 + index)}
                    </button>
                ))}
            </div>
            {Object.keys(groupedBrands).map(letter => (
                <div key={letter} id={`brandSection-${letter}`} className="mb-7">
                    <h2 className="text-xl font-semibold">{letter}</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {groupedBrands[letter].map(brand => (
                            <div key={brand.BrandID}>
                                <NavLink
                                    to={`/brand/${brand.BrandName}`}
                                    className="text-neutral font-bold hover:underline"
                                >
                                    {brand.BrandName}
                                </NavLink>
                            </div>
                        ))}
                    </div>
                    <div className="divider"/>
                </div>
            ))}
        </div>
    );
}

export default Brands;