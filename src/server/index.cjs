const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const {createLogger} = require("vite");
const {readFile, writeFile} = require("fs");
const {join} = require("path");
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3002;

app.use(cors({
    origin: 'http://localhost:5173'
}));
app.use(express.json());


// Create a connection to the database
const dbConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '../../db_config.json'), 'utf8'));
const db = mysql.createConnection(dbConfig);

// Connect to the database
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to the database');
});

const productList = [];

// Preload product names
db.query('SELECT p.ProductName, p.ProductID, p.ProductPhoto, b.BrandName FROM Products p JOIN Brands b ON p.BrandID = b.BrandID', (err, results) => {
    if (err) {
        console.error('Error fetching product names:', err);
    } else {

        results.forEach((row) => {
            productList.push(row);
        });
        console.log(`Preloaded ${productList.length} products.`);
    }
});


function generateSql(filters, includeLimitOffset = false, limit = 15, offset = 0, sort) {
    let sql = `SELECT p.ProductName, p.ProductID, b.BrandName, MIN(pv.Price) AS MinPrice, MAX(pv.Price) AS MaxPrice,
            p.ProductPhoto, GROUP_CONCAT(i.IngredientName) as Ingredients
            FROM Products p
            LEFT JOIN ProductVariants pv ON pv.ProductID = p.ProductID
            JOIN ProductTypes pt ON p.ProductTypeID = pt.ProductTypeID
            JOIN Brands b ON p.BrandID = b.BrandID
            LEFT JOIN IngredientsLinks il ON p.ProductID = il.ProductID
            LEFT JOIN Ingredients i ON il.IngredientID = i.IngredientID`;

    if (filters.length > 0) {
        sql += ` WHERE ${filters.join(' AND ')}`;
    }

    sql += ` GROUP BY p.ProductID, p.ProductName, b.BrandName, p.ProductPhoto`;

    if (sort) {
        sql += ` ORDER BY ${sort}`;
    }

    if (includeLimitOffset) {
        sql += ` LIMIT ${limit} OFFSET ${offset}`;
    }


    return sql;
}

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
        } else {
            filters.push(`pv.Price BETWEEN ${minPrice} AND ${maxPrice}`);
        }
    }

    if (req.query.brand) {
        filters.push(`b.BrandName = '${req.query.brand}'`);
    }


    if (req.query.skinType) {
        filters.push(`p.SkinType LIKE '%${req.query.skinType}%'`);
    }

    if (req.query.ingredients) {
        let ingredients = req.query.ingredients.split(',');
        filters.push(`i.IngredientName IN (${ingredients.map(ingredient => `'${ingredient}'`).join(',')})`);
    }

    let sort = req.query.sort;
    if (req.query.sort) {
        if (sort === 'Price (Low - High)') {
            sort = 'MinPrice ASC';
        } else if (sort === 'Price (High - Low)') {
            sort = 'MinPrice DESC';
        } else if (sort === 'Alphabetical (A - Z)') {
            sort = 'p.ProductName ASC';
        } else if (sort === 'Alphabetical (Z - A)') {
            sort = 'p.ProductName DESC';
        }
    }

    const sql = generateSql(filters, true, limit, offset, sort);

    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            const countSql = generateSql(filters);

            db.query(countSql, (err, countResult) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send({count: countResult.length, data: result});
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
    const productSql = `SELECT P.ProductID, P.ProductName, P.ProductDescription, P.SkinType, P.IsLuxury, B.BrandName, PT.ProductTypeName, 
    GROUP_CONCAT(CONCAT(PV.Amount, ' - $', PV.Price) SEPARATOR '; ') AS Variants, P.ProductPhoto 
    FROM Products AS P
    JOIN Brands AS B ON P.BrandID = B.BrandID
    JOIN ProductTypes AS PT ON P.ProductTypeID = PT.ProductTypeID
    LEFT JOIN ProductVariants AS PV ON P.ProductID = PV.ProductID
    WHERE P.ProductID = ? 
    GROUP BY P.ProductID`;

    const ingredientsSql = `SELECT I.IngredientName
    FROM Ingredients I
    JOIN IngredientsLinks IL ON I.IngredientID = IL.IngredientID
    WHERE IL.ProductID = ?`;

    db.query(productSql, [id], (err, productResult) => {
        try {
            if (err) {
                console.log(err);
            } else {
                db.query(ingredientsSql, [id], (err, ingredientsResult) => {
                    if (err) {
                        console.log(err);
                    } else {
                        if (productResult.length > 0) {
                            // Create new product object
                            let product = {
                                ProductID: productResult[0].ProductID,
                                ProductName: productResult[0].ProductName,
                                ProductDescription: productResult[0].ProductDescription,
                                SkinType: productResult[0].SkinType,
                                IsLuxury: productResult[0].IsLuxury,
                                BrandName: productResult[0].BrandName,
                                ProductTypeName: productResult[0].ProductTypeName,
                                ProductPhoto: productResult[0].ProductPhoto,
                                Variants: [],
                                Ingredients: ingredientsResult.map((ingredient) => {
                                    return [ingredient.IngredientName];
                                })
                            };

                            // Split the variants string into an array of variant objects
                            product.Variants = productResult[0].Variants.split('; ').map(variant => {
                                let [amount, price] = variant.split(' - $');
                                return {Amount: amount, Price: price};
                            });

                            res.send([product]);
                        }
                    }
                });
            }
        } catch (e) {
            console.log(e);
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

app.post('/saveRoutine', (req, res) => {
    const routineData = req.body;
    const filePath = join(__dirname, 'src/client/utils/routines.json');

    readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('An error occurred while reading the routines file:', err);
            res.status(500).send({message: 'An error occurred while reading the routines file.'});
            return;
        }

        let routines = JSON.parse(data);
        if (!routines.recommendedRoutines) {
            routines.recommendedRoutines = [];
        }

        routines.recommendedRoutines.push(routineData);

        writeFile(filePath, JSON.stringify(routines, null, 2), (err) => {
            if (err) {
                console.error('An error occurred while writing the routine to the file:', err);
                res.status(500).send({message: 'An error occurred while writing the routine to the file.'});
            } else {
                console.log('Routine saved successfully.');
                res.status(200).send({message: 'Routine saved successfully.'});
            }
        });
    });
});

app.get('/routine/:id', (req, res) => {
    const id = req.params.id;

    // SQL query to check if a routine with the provided ID already exists
    const checkSql = 'SELECT * FROM Routines WHERE RoutineID = ?';

    db.query(checkSql, id, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send({message: 'An error occurred while checking for existing routine.'});
        } else if (result.length > 0) {
            console.log("Routine already exists")
            // If a routine with the provided ID already exists, return a 400 status code
            res.status(400).send({message: 'A routine with this ID already exists.'});
        } else {
            // If no routine with the provided ID exists, send a success message
            res.send({message: 'No routine with this ID exists.'});
        }
    });
});

app.post('/routine/create/:id', (req, res) => {
    const id = req.params.id;

    // SQL query to check if a routine with the provided ID already exists
    const checkSql = 'SELECT * FROM Routines WHERE RoutineID = ?';

    db.query(checkSql, id, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send({message: 'An error occurred while checking for existing routine.'});
        } else if (result.length > 0) {
            // If a routine with the provided ID already exists, return a 400 status code
            res.status(400).send({message: 'A routine with this ID already exists.'});
        } else {
            // If no routine with the provided ID exists, create a new routine
            const insertSql = 'INSERT INTO Routines (RoutineID, RoutineName, RoutineDescription) VALUES (?, ?, ?)';
            const values = [id, 'New Routine', 'New routine description'];

            db.query(insertSql, values, (err, result) => {
                if (err) {
                    console.error(err);
                    res.status(500).send({message: 'An error occurred while creating the routine.'});
                } else {
                    res.send({
                        message: 'Routine created successfully.',
                        routine: {id, name: 'New Routine', description: 'New routine description'}
                    });
                }
            });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});