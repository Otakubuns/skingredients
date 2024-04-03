import activeIngredients from "../utils/activeingredients.json";

function IngredientBadge({ingredients}) {
    if(ingredients === undefined) return null;
    if(typeof ingredients === 'string') ingredients = ingredients.split(', ');
    if(!Array.isArray(ingredients)) return null;
    const lowerCaseIngredients = ingredients.map(ingredient => ingredient.toString().toLowerCase());

    const matchedIngredients = activeIngredients.activeIngredients.filter(ingredient => {
        const lowerCaseName = ingredient.name.toLowerCase();
        const lowerCaseAssociatedIngredients = ingredient.associated_ingredients.map(ingredient => ingredient.toString().toLowerCase());

        return lowerCaseIngredients.some(productIngredient => productIngredient.includes(lowerCaseName)) ||
            lowerCaseAssociatedIngredients.some(associatedIngredient => lowerCaseIngredients.some(productIngredient => productIngredient.includes(associatedIngredient)));
    });

    return (
        <div className="flex gap-3">
            {matchedIngredients.map((ingredient, index) => {
                return (
                    <div className="tooltip" data-tip={ingredient.benefits} key={index}>
                        <div className="badge badge-lg badge-secondary">
                            {ingredient.name}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default IngredientBadge;