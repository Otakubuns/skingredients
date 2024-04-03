function SkinTypeBadge({SkinType}) {
    // split by comma
    const SkinTypes = SkinType.trim().split(",");
    //Trim the whitespace
    SkinTypes.forEach((type, index) => {
        SkinTypes[index] = type.trim();
    });

    return (
        <div className="space-x-2 pb-1">
            {SkinTypes.includes("Oily") && <div className="badge badge-lg badge-error">Oily</div>}
            {SkinTypes.includes("Dry") && <div className="badge badge-lg badge-success">Dry</div>}
            {SkinTypes.includes("Combination") && <div className="badge badge-lg badge-warning">Combination</div>}
            {SkinTypes.includes("Normal") && <div className="badge badge-lg badge-primary">Normal</div>}
            {SkinTypes.includes("Sensitive") && <div className="badge badge-lg badge-accent">Sensitive</div>}
        </div>
    );
}

export default SkinTypeBadge;
