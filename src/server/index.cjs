const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const {createLogger} = require("vite");

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());


// Create a connection to the database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'skincaredb'
});

// Connect to the database
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to the database');
});

const productList = [];

// Preload product names
db.query('SELECT p.ProductName, p.ProductID, b.BrandName FROM Products p JOIN Brands b ON p.BrandID = b.BrandID', (err, results) => {
    if (err) {
        console.error('Error fetching product names:', err);
    } else {

        results.forEach((row) => {
            productList.push(row);
        });
        console.log(`Preloaded ${productList.length} products.`);
    }
});


app.get('/products', (req, res) => {
    const offset = parseInt(req.query.offset) || 0;
    const limit = req.query.limit || 15;

    const filters = [];

    if (req.query.category) {
        filters.push(`pt.ProductTypeName = '${req.query.category}'`);
    }

    if (req.query.priceRange) {
        let [minPrice, maxPrice] = req.query.priceRange.split('-');
        if (maxPrice === undefined) {
            minPrice = minPrice.replace('+', '');
            filters.push(`pv.Price >= ${minPrice}`);
        }
        else{
            filters.push(`pv.Price BETWEEN ${minPrice} AND ${maxPrice}`);
        }
    }

    if (req.query.brand) {
        filters.push(`b.BrandName = '${req.query.brand}'`);
    }


    let sql = `SELECT p.ProductName, p.ProductID, b.BrandName, MIN(pv.Price) AS MinPrice, MAX(pv.Price) AS MaxPrice,
                p.ProductPhoto
                FROM Products p
                LEFT JOIN ProductVariants pv ON pv.ProductID = p.ProductID
                JOIN ProductTypes pt ON p.ProductTypeID = pt.ProductTypeID
                JOIN Brands b ON p.BrandID = b.BrandID`;


    if (filters.length > 0) {
        sql += ` WHERE ${filters.join(' AND ')}`;
    }

    // TODO: Either make skintype a seperate table or filter it properyl
    if(req.query.skinType){
        if(filters.length > 0){
            sql += ` AND WHERE p.SkinType LIKE '${req.query.skinType}'`;
        }
        else{
            sql += ` WHERE p.SkinType LIKE '${req.query.skinType}'`;
        }
    }

    // Add LIMIT and OFFSET
    sql += ` GROUP BY p.ProductID
             LIMIT ${limit} OFFSET ${offset};`;

    console.log(sql);

    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            let countSql = `SELECT COUNT(DISTINCT p.ProductID) AS ProductCount
                            FROM Products p
                            LEFT JOIN ProductVariants pv ON pv.ProductID = p.ProductID
                            JOIN ProductTypes pt ON p.ProductTypeID = pt.ProductTypeID
                            JOIN Brands b ON p.BrandID = b.BrandID`;

            if (filters.length > 0) {
                countSql += ` WHERE ${filters.join(' AND ')}`;
            }

            db.query(countSql, (err, countResult) => {
                if (err) {
                    console.log(err);
                } else {
                    const totalCount = countResult[0].ProductCount;
                    res.send({count: totalCount, data: result});
                }
            });
        }
    });
});

app.get('/products/count', (req, res) => {
    // TODO: change this to be the preloaded product list
    let {category, priceRange, brand} = req.query;

    let products = getAllProducts(); // Function to get all products

    if (category) {
        products = products.filter(product => product.category === category);
    }

    if (priceRange) {
        let [minPrice, maxPrice] = priceRange.split('-');
        products = products.filter(product => product.price >= minPrice && product.price <= maxPrice);
    }

    if (brand) {
        products = products.filter(product => product.brand === brand);
    }

    res.json({count: products.length});
});

app.get('/categories', (req, res) => {
    const sql = `SELECT pt.ProductTypeName, COUNT(*) AS TotalProducts
                FROM Products p
                INNER JOIN ProductTypes pt ON p.ProductTypeID = pt.ProductTypeID
                GROUP BY pt.ProductTypeName;`;
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.get('/brands', (req, res) => {
    const sql = `SELECT brands.BrandName, brands.BrandID, COUNT(products.ProductID) as ProductCount
                FROM Brands brands
                JOIN Products products ON brands.BrandID = products.BrandID
                GROUP BY brands.BrandName, brands.BrandID;`;
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.get('/brand/:brand', (req, res) => {
    const offset = parseInt(req.query.offset) || 0;
    const limit = 15;

    const brand = req.params.brand;
    const sql = `SELECT p.ProductID, p.ProductName, b.BrandName, MIN(pv.Price) AS MinPrice, MAX(pv.Price) AS MaxPrice,
                p.ProductPhoto FROM Products p
                LEFT JOIN ProductVariants pv ON pv.ProductID = p.ProductID
                JOIN Brands b ON p.BrandID = b.BrandID
                WHERE b.BrandName = "${brand}"
                GROUP BY p.ProductID, p.ProductName
                LIMIT ${limit} OFFSET ${offset};`;
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result);
        }
    });
});

app.get('/product/:id', (req, res) => {
    const id = req.params.id;
    const sql = `SELECT P.ProductID, P.ProductName, P.ProductDescription, P.SkinType, P.IsLuxury, B.BrandName, PT.ProductTypeName, 
    GROUP_CONCAT(CONCAT(PV.Amount, ' - $', PV.Price) SEPARATOR '; ') AS Variants, P.ProductPhoto 
    FROM Products AS P
    JOIN Brands AS B ON P.BrandID = B.BrandID
    JOIN ProductTypes AS PT ON P.ProductTypeID = PT.ProductTypeID
    LEFT JOIN ProductVariants AS PV ON P.ProductID = PV.ProductID
    WHERE P.ProductID = ? 
    GROUP BY P.ProductID`;
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            if (result.length > 0) {
                // Create new product object
                let product = {
                    ProductID: result[0].ProductID,
                    ProductName: result[0].ProductName,
                    ProductDescription: result[0].ProductDescription,
                    SkinType: result[0].SkinType,
                    IsLuxury: result[0].IsLuxury,
                    BrandName: result[0].BrandName,
                    ProductTypeName: result[0].ProductTypeName,
                    ProductPhoto: result[0].ProductPhoto,
                    Variants: []
                };

                // Split the variants string into an array of variant objects
                product.Variants = result[0].Variants.split('; ').map(variant => {
                    let [amount, price] = variant.split(' - $');
                    return {Amount: amount, Price: price};
                });

                res.send([product]);
            }
        }
    });

});

app.get('/product/:id/ingredients', (req, res) => {
    const id = req.params.id;
    const sql = `SELECT I.IngredientName
                FROM Ingredients I
                JOIN IngredientsLinks IL ON I.IngredientID = IL.IngredientID
                WHERE IL.ProductID = ${id};`;
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            let ingredients = result.map((ingredient) => {
                return [ingredient.IngredientName];
            });
            res.send(ingredients);
        }
    });
});


app.get('/autosuggest', (req, res) => {
    const searchQuery = req.query.q.toLowerCase();
    // const filteredSuggestions = productList.filter((product) =>
    //     product.toLowerCase().includes(searchQuery)
    // );
    const normalizedSearchQuery = searchQuery.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    const filteredSuggestions = productList.filter((product) =>
        product.ProductName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .includes(normalizedSearchQuery)
        // normalizing the brand name as well(get rid of accents)
        || product.BrandName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .includes(normalizedSearchQuery)
    );

    res.json({suggestions: filteredSuggestions.slice(0, 5)});
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});