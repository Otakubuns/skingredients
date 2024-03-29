import {useEffect, useState} from 'react';

function CheckboxList({options, type, onCheckboxChange}) {
    const [selectedOption, setSelectedOption] = useState(null);

    useEffect(() => {
        setSelectedOption(null);
    }, []);

    const handleCheckboxClick = (position) => {
        const newSelectedOption = position === selectedOption ? null : position;
        setSelectedOption(newSelectedOption);

        if (onCheckboxChange) {
            if(options[newSelectedOption] === undefined){
                onCheckboxChange('', type);
                return;
            }
            if(type === 'brand')
            {
                onCheckboxChange(options[newSelectedOption].brandName, type);
                return;
            }
            if(type === 'priceRange'){
                options[newSelectedOption] = options[newSelectedOption].replaceAll('$', '');
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
                                />
                            )}
                            {type === 'priceRange' && item === 'custom' && (
                                <input
                                    type="number"
                                    maxLength="4"
                                    className="size-7 w-20 border border-primary p-1.5 rounded-md"
                                    placeholder="Max"
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