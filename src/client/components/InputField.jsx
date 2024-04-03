function InputField({ name, type, placeholder, onInput, label, isRequired = true}) {
    return (
        <div className="relative z-0 w-full mb-5">
            {type === 'textarea' ? (
                <textarea
                    onInput={onInput}
                    name={name}
                    placeholder={placeholder}
                    required={isRequired}
                    className="pt-3 pb-2 block w-full px-0 mt-0 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-black border-gray-200"
                />
            ) : (
                <input
                    onInput={onInput}
                    type={type}
                    name={name}
                    placeholder={placeholder}
                    required
                    className="pt-3 pb-2 block w-full px-0 mt-0 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-black border-gray-200"
                />
            )}
            <label htmlFor={name}
                   className="absolute duration-300 top-3 -z-1 origin-0 text-gray-500">
                {label}
            </label>
            <span className="text-sm text-red-600 hidden" id="error">{label} is required</span>
        </div>
    );
}

export default InputField;