const { Category, Product } = require('../models');

const catalogController = {
    index: async (req, res) => {
        res.render('index');
    },

    productsList: async (req, res) => {
        try {
            // todo, ici il faudra les vrais produits et catégories de la db
            const products = await Product.findAll();
            const categories = await Category.findAll();

            res.render('shop', { 
                categories,
                products 
            });

        } catch (error) {
            console.log(error);
            res.status(500).send('Server Error');
        }
    },

    category: async (req, res) => {
        // todo, il faut récupérer la catégorie en fonction de l'id présent dans l'url et la passer à la vue
        const id = parseInt(req.params.id, 10);
        const category = await Category.findByPk(id, { include: ['products'], order: [['products', 'price', 'ASC']]});
        res.render('category', { category });
    },

    product: async (req, res) => {
        // todo, récupérer le produit demandé en base de données.
        const id = parseInt(req.params.id, 10);
        const product = await Product.findByPk(id);
        res.render('product', { product });
    },

    cart: (req, res) => {
        res.render('cart');
    },
};

module.exports = catalogController;
