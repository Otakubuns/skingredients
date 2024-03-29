function Faq(){
    return (
        <>
            <p className="text-2xl font-bold text-center mt-8">
                Frequently Asked Questions
            </p>

            <div tabIndex={0} className="collapse collapse-arrow border border-base-300 bg-base-200">
                <input type="checkbox" id="faq1"/>
                <div className="collapse-title text-xl font-medium">
                   What is Skingredients?
                </div>
                <div className="collapse-content">
                    <p>Skingredients was made to have a website that could contain basic information on
                        skincare without having to know everything about it. This won't teach you the science of skincare ingredients but to help people with a general</p>
                </div>
            </div>

            <div tabIndex={0} className="collapse collapse-arrow border border-base-300 bg-base-200">
                <div className="collapse-title text-xl font-medium">
                    Focus me to see content
                </div>
                <div className="collapse-content">
                    <p>tabIndex={0} attribute is necessary to make the div focusable</p>
                </div>
            </div>
        </>
    )
}

export default Faq;
