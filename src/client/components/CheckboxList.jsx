import {useEffect, useState} from 'react';
import activeIngredients from "../utils/activeingredients.json";

function CheckboxList({options, type, onCheckboxChange}) {
    const [selectedOption, setSelectedOption] = useState(null);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    //TODO: Make it reset when category changes(or filter)
    useEffect(() => {
        setSelectedOption(null);
    }, []);

    const handleCheckboxClick = (position) => {
        const newSelectedOption = position === selectedOption ? null : position;
        setSelectedOption(newSelectedOption);

        if (onCheckboxChange) {
            if (options[newSelectedOption] === undefined) {
                onCheckboxChange('', type);
                return;
            }
            if (type === 'brand') {
                onCheckboxChange(options[newSelectedOption].brandName, type);
                return;
            }
            if (type === 'priceRange') {
                if (options[newSelectedOption] === 'custom') {
                    if (minPrice === '' || maxPrice === '') {
                        return;
                    }

                    // switch min and max if min is greater than max
                    if (parseInt(minPrice) > parseInt(maxPrice)) {
                        setMinPrice(maxPrice);
                        setMaxPrice(minPrice);

                        onCheckboxChange(`${maxPrice}-${minPrice}`, type);
                        return;
                    }
                    onCheckboxChange(`${minPrice}-${maxPrice}`, type);

                    return;
                }
                options[newSelectedOption] = options[newSelectedOption].replaceAll('$', '');
                onCheckboxChange(options[newSelectedOption], type);
                return;
            }
            if(type === 'ingredients')
            {
                let finalActiveIngredients = [];
                activeIngredients.activeIngredients.forEach(ingredient => {
                    if(ingredient.benefits.toLowerCase().includes(options[newSelectedOption].toString().toLowerCase()))
                    {
                        // grab all the associated_ingredients(remonve duplicates) and add the ingredient name
                        finalActiveIngredients.push(ingredient.name);
                        ingredient.associated_ingredients.forEach(associatedIngredient => {
                            if(!finalActiveIngredients.includes(associatedIngredient))
                            {
                                finalActiveIngredients.push(associatedIngredient);
                            }
                        });
                    }
                });

                onCheckboxChange(finalActiveIngredients, type);
                return;
            }
            onCheckboxChange(options[newSelectedOption], type);
        }
    };

    return (
        <div>
            {options.map((item, index) => (
                <div key={index} className="form-control">
                    <label className="label cursor-pointer">
                        <span className="label-text">
                            {type === 'brand' ? `${item.brandName}` : (item === 'custom' ? '' : `${item}`)}
                            {type === 'priceRange' && item === 'custom' && (
                                <input
                                    type="number"
                                    maxLength="4"
                                    className="size-7 w-20 border border-primary p-1.5 rounded-md mr-2"
                                    placeholder="Min"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                />
                            )}
                            {type === 'priceRange' && item === 'custom' && (
                                <input
                                    type="number"
                                    maxLength="4"
                                    className="size-7 w-20 border border-primary p-1.5 rounded-md"
                                    placeholder="Max"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                />
                            )}
                        </span>
                        <input
                            type="checkbox"
                            className="checkbox checkbox-primary"
                            checked={index === selectedOption}
                            onChange={() => handleCheckboxClick(index)}
                        />
                    </label>
                </div>
            ))}
        </div>
    );
}

export default CheckboxList;