import {Link} from "react-router-dom";

function BreadCrumbs({ productType })
{
    return(
        <div className="text-sm breadcrumbs">
            <ul>
                <li className="text-gray-500"><Link to="/Products">Products</Link></li>
                <li><Link to={"/category/" + productType}>{productType}</Link></li>
            </ul>
        </div>
    )

}

export default BreadCrumbs;