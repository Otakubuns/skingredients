import { useState } from 'react';
import Autosuggest from 'react-autosuggest';
import {NavLink} from "react-router-dom";
function SearchBar() {
    const [value, setValue] = useState('');
    const [originalSuggestions, setOriginalSuggestions] = useState([]);

    const fetchSuggestions = async (inputValue) => {
        try {
            const trimmedValue = inputValue.trim().toLowerCase();
            if (trimmedValue.length >= 3) {
                const response = await fetch(`http://localhost:3002/autosuggest?q=${trimmedValue}`);
                const data = await response.json();

                setOriginalSuggestions(data.suggestions);
            }
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    };

    const handleInputChange = (e) => {
        const inputValue = e.target.value;
        setValue(inputValue);
        fetchSuggestions(inputValue);
    };

    const renderSuggestion = (product) => (
        <NavLink to={`/product/${product.ProductID}`}>
            {product.BrandName} - {product.ProductName}
        </NavLink>
    );

    const inputProps = {
        placeholder: 'Search',
        value,
        onChange: handleInputChange,
        className: "input input-bordered pr-10"
    };

    return (
        <div className="form-control relative">
            <Autosuggest
                suggestions={originalSuggestions}
                onSuggestionsFetchRequested={({ value }) => fetchSuggestions(value)}
                onSuggestionsClearRequested={() => setOriginalSuggestions([])}
                getSuggestionValue={(suggestion) => suggestion.ProductName}
                renderSuggestion={renderSuggestion}
                inputProps={inputProps}
            />
            <button
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 bg-transparent border-none cursor-pointer"
            >
                <i className="fas fa-search"></i>
            </button>
        </div>
    );
}

export default SearchBar;
