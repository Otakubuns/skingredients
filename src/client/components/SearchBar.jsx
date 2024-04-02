import {useState, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';

function SearchBar() {
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (inputValue.length < 3) {
                setSuggestions([]);
                return;
            }

            try {
                const response = await fetch(`http://localhost:3002/autosuggest?q=${inputValue}`);
                const data = await response.json();
                setSuggestions(data.suggestions);
                setShowSuggestions(true);
            } catch (error) {
                console.error('Error fetching suggestions:', error);
            }
        };

        fetchSuggestions();
    }, [inputValue]);

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleSuggestionClick = (suggestion) => {
        setInputValue('');
        setShowSuggestions(false);
        setTimeout(() => {
            navigate(`/product/${suggestion.ProductID}`);
        }, 0);
    };

    return (
        <div className="form-control relative pl-10 w-2/3" onBlur={() => setShowSuggestions(false)} tabIndex="0">
            <input
                className="input input-bordered pr-10 suggestions-list"
                placeholder="Search"
                value={inputValue}
                onChange={handleInputChange}
                onClick={() => setShowSuggestions(true)}
            />
            <button
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 bg-transparent border-none cursor-pointer">
                <i className="fas fa-search"></i>
            </button>
            {showSuggestions && (
                <ul className="absolute bg-white shadow-primary shadow-md top-full rounded ">
                    {suggestions.slice(0, 4).map((suggestion) => (
                        <div key={suggestion.ProductID} onMouseDown={() => handleSuggestionClick(suggestion)}>
                            <Link to={`/product/${suggestion.ProductID}`} className="block p-2 hover:bg-gray-100">
                                {suggestion.BrandName} - {suggestion.ProductName}
                            </Link>
                        </div>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default SearchBar;