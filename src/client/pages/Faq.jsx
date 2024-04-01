function Faq() {
    return (
        <div className="w-2/3 mx-auto">
            <p className="text-2xl font-bold text-center mt-8 mb-2">
                Frequently Asked Questions
            </p>

            <div tabIndex={0} className="collapse collapse-arrow border-primary border-x-2 border-t-2 border-b rounded">
                <input type="checkbox" id="faq1"/>
                <div className="collapse-title text-xl font-medium text-center">
                    What is Skingredients?
                </div>
                <div className="collapse-content text-center">
                    <p>Skingredients is a skincare routine creator that helps you build a skincare routine based on
                        your skin type and concerns. It is a great starting point for those who are new to skincare
                        and need help figuring out what products to use. Skingredients also provides information on
                        the ingredients in your products and how they can help your skin.
                        <br/><br/>The goal of Skingredients is to make skincare more accessible and easier to understand for everyone. The site does not go
                        into detail about every single ingredient but provides a general overview of the most common
                        ingredients found in skincare products with emphasis on actives.
                        <br/><br/>
                        Skincare may seem too complex or too hard to figure out for some people so Skingredients is here
                        to break that barrier and start having more people take care of their skin.
                    </p>
                </div>
            </div>

            <div tabIndex={0} className="collapse collapse-arrow border-primary border-x-2 border-y rounded">
                <input type="checkbox" id="faq2"/>
                <div className="collapse-title text-xl font-medium text-center">
                    Why don't you have _______ product or brand?
                </div>
                <div className="collapse-content text-center">
                    <p>For right now the products we have within the products page are just a small selection of
                        products that can be found at most Canadian drugstores. We are working on expanding the list
                        to include more products and brands but for now you can still input custom products into your
                        routine and add their ingredient to ensure product compatibility.
                    </p>
                </div>
            </div>

            <div tabIndex={0} className="collapse collapse-arrow border-primary border-x-2 border-y rounded">
                <input type="checkbox" id="faq3"/>
                <div className="collapse-title text-xl font-medium text-center">
                    How do I find out more about skincare?
                </div>
                <div className="collapse-content text-center">
                    <p className="pb-3">While Skingredients is a great starting point for skincare and creating a routine, it is not the end all be all for
                        skincare information. There are many other resources that can be used to learn more about
                        skin type, ingredients and general tips on how to learn more. Some great resources include:
                    </p>
                    <ul className="mb-4 website-links">
                        <div className="font-bold"> Dermatologists & Medical Professionals </div>
                        <li><a href="https://www.youtube.com/c/DrDrayzday">Dr. Dray</a></li>
                        <li><a href="https://dridriss.com/blogs/news">Dr. Shereene Idriss </a></li>
                        <li><a href="https://www.youtube.com/@dr.jennyliu">Dr. Jenny Liu</a></li>
                    </ul>
                    <ul className="website-links">
                        <div className="font-bold"> Skincare Encyclopedia/Sites </div>
                        <li><a href="https://www.paulaschoice.com/beautypedia">Paula's Choice</a></li>
                        <li><a href="https://incidecoder.com/">Incidecoder</a></li>
                    </ul>
                </div>
            </div>

            <div tabIndex={0} className="collapse collapse-arrow border-primary border-b-2 border-x-2 border-t rounded">
                <input type="checkbox" id="faq4"/>
                <div className="collapse-title text-xl font-medium text-center">
                    How do I know if a product will work with my skin type?
                </div>
                <div className="collapse-content text-center">
                    <p>
                        While Skingredients can help you find products that are generally good for your skin type, it is
                        important to remember that everyone's skin is different and can react differently to products.
                        Remember to patch test new products and introduce them slowly into your routine to see
                        how your skin reacts.<br/><br/>

                        If you are unsure of your skin type, you can always take a quiz or research more about it.

                        A great resource for finding out more about your skin type is:
                        <a href="https://www.paulaschoice.com/expert-advice/skincare-advice/skin-care-how-tos/what-is-my-skin-type.html" className="underline text-neutral" > Paula's Choice</a>.
                    </p>
                </div>
            </div>

            <p className="pt-8 text-sm font-light text-center">It is important to do your own research and
                talk to a professional if you have any concerns about your skin.
                <br/>Skingredients or any online information is not a substitute for professional advice.
            </p>
        </div>
    )
}

export default Faq;
