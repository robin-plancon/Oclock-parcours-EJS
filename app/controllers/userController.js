const bcrypt = require('bcrypt');
const emailValidator = require('email-validator');
const { User, Role } = require('../models');

const userController = {
    index: (req, res) => {
        res.render('register');
    },

    register: async (req, res) => {
        try {
            const { firstname, lastname, email, password, passwordConfirm } = req.body;

            // verifier si tous les champs sont remplis
            if (!firstname || !lastname || !email || !password || !passwordConfirm) {
                return res.render('register', {
                    error: 'Veuillez remplir tous les champs',
                });
            }

            // !! votre code à partir d'ici
            // verifier l'email avec le package npm email-validator
            const isEmailValid = emailValidator.validate(email);
            if (!isEmailValid) {
                return res.render('register', {
                    error: 'Veuillez entrer un email valide',
                });
            }
            // verifier si password correspond à password confirm
            if (password !== passwordConfirm) {
                return res.render('register', {
                    error: 'Les mots de passe ne correspondent pas',
                });
            }

            // hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // attribuer un rôle ici, le role customer.
            const role = await Role.findOne({
                where: { name: 'customer' },
            });

            // sauvegarder user
            const user = await User.create({
                name: `${firstname} ${lastname}`,
                email,
                password: hashedPassword,
                role_id: role.id,
            });

            // !! ne pas modifier cette ligne
            res.render('login', {
                message: 'Vous pouvez maintenant vous connecter !',
            });
        } catch (error) {
            console.log(error);
            res.render('register', { error: error.message });
        }
    },

    show: async (req, res) => {
        res.render('dashboard/dashboard');
    },
};

module.exports = userController;
