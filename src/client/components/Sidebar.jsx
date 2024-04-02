import CheckboxList from "./CheckboxList.jsx";
import {useEffect, useState} from "react";
import {Link, NavLink} from "react-router-dom";
import BreadCrumbs from "./BreadCrumbs.jsx";

function Sidebar({brands = [], onFilterChange, currentCategory}) {
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredBrands, setFilteredBrands] = useState([]);

    useEffect(() => {
        if (currentCategory === undefined) {
            fetch('http://localhost:3002/categories')
                .then(response => response.json())
                .then(data => {
                    setCategories(data);
                });
        } else {
            setCategories([]);
        }
    }, [currentCategory]);

    useEffect(() => {
        if(searchTerm.length >= 3)
        {
            setFilteredBrands(brands.filter(brand => brand.brandName.toLowerCase().includes(searchTerm.toLowerCase())));
        } else {
            setFilteredBrands(brands);
        }
    }, [searchTerm, brands]);


    return (
        <div className="sidebar p-4 rounded-box">
            {currentCategory && (
                <>
                    <div className="breadcrumbs -mb-11">
                        <BreadCrumbs productType={currentCategory}/>
                    </div>
                    <h1 className="pt-10 font-semibold text-xl">{currentCategory}</h1>
                </>
            )}
            {categories.length > 0 && (
                <>
                    <h1 className="pt-10 font-semibold text-xl">Skincare</h1>
                    <ul className="pt-8">
                        {categories.map((category, index) => (
                            <li key={index} className="pb-2">
                                <Link
                                    to={"/category/" + category.ProductTypeName}>{category.ProductTypeName} ({category.TotalProducts})</Link>
                            </li>
                        ))}
                    </ul>
                </>
            )}
            <ul className="pt-3">
                <li className="pb-3 pt-3 border-b">
                    <div className="font-light text-gray-500">Filters</div>
                    <details>
                        <summary className="font-bold pl-0 w-60">Price Range</summary>
                        <CheckboxList options={['$0 - $25', '$25 - $50', '$50 - $100', '$100+', 'custom']}
                                      type="priceRange"
                                      onCheckboxChange={onFilterChange}/>
                    </details>
                </li>
                {
                    brands.length > 0 && (
                        <li className="pb-3 pt-3 border-b">
                            <details>
                                <summary className="font-bold">Brand</summary>
                                <input type="text" id="brand" name="brand" className="mt-2 input input-sm input-bordered"
                                onChange={(e) => setSearchTerm(e.target.value)} value={searchTerm}/>
                                <CheckboxList options={filteredBrands} type="brand" onCheckboxChange={onFilterChange}/>
                            </details>
                        </li>
                    )
                }
                <li className="pb-3 pt-3 border-b">
                    <details>
                        <summary className="font-bold">Skin Type</summary>
                        <CheckboxList options={['Oily', 'Dry', 'Combination', 'Sensitive']} type="skinType"
                                      onCheckboxChange={onFilterChange}/>
                    </details>
                </li>
                <li className="pb-3 pt-3 border-b">
                    <details>
                        <summary className="font-bold">Concern</summary>
                        <CheckboxList options={['Acne', 'Anti-Aging', 'Brightening', 'Hydrating']} type="ingredients"
                                      onCheckboxChange={onFilterChange}/>
                    </details>
                </li>
            </ul>
        </div>
    )
        ;
}

export default Sidebar;