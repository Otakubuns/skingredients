import CheckboxList from "./CheckboxList.jsx";
import {useEffect, useState} from "react";
import {Link, NavLink} from "react-router-dom";
import BreadCrumbs from "./BreadCrumbs.jsx";

function Sidebar({brands = [], onFilterChange, currentCategory}) {
    const [categories, setCategories] = useState([]);

    console.log('currentCategory', currentCategory);
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

    // TODO: ADD BREADCRUMBS
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
                                <CheckboxList options={brands} type="brand" onCheckboxChange={onFilterChange}/>
                            </details>
                        </li>
                    )
                }
                <li className="pb-3 pt-3 border-b">
                    <details>
                        <summary className="font-bold">Skin Type</summary>
                        <CheckboxList options={['Oily', 'Normal', 'Dry', 'Combination']} type="skinType"
                                      onCheckboxChange={onFilterChange}/>
                    </details>
                </li>
            </ul>
        </div>
    )
        ;
}

export default Sidebar;