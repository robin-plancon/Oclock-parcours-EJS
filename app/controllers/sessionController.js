const bcrypt = require('bcrypt');
const { User, Role } = require('../models');

const sessionController = {
    index: (req, res) => {
        res.render('login');
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            // !! Votre code à partir d'ici

            if (!email || !password) {
                return res.render('login', {
                    error: 'Veuillez remplir tous les champs',
                });
            }

            // On récupère user avec le role
            const user = await User.findOne({
                where: { email },
                include: 'role',
            });

            // Est-ce que l'utilisateur existe en BDD ?
            // Sélectionner user avec email et inclure le role, si on ne le trouve pas :
            //      on envoie un message d'erreur dans un objet:  {error: "Utilisateur ou mot de passe incorrect"} et on render `login` en lui passant l'erreur
            // Sinon on continue.
            if (!user) {
                return res.render('login', {
                    error: 'Utilisateur ou mot de passe incorrect',
                });
            }

            // Le mot de passe est il correct ?
            // On compare le mots de passe du formulaire avec celui de l'utilisateur
            //      Si le mot de passe est incorrect : on envoie un message d'erreur dans un objet:  {error: "Utilisateur ou mot de passe incorrect"} et on render `login` en lui passant l'erreur
            // Sinon on continue.            
            const isGoodPassword = await bcrypt.compare(password, user.password);
            if (!isGoodPassword) {
                return res.render('login', {
                    error: 'Utilisateur ou mot de passe incorrect',
                });
            }

            // On ajoute user a la session
            req.session.user = user;
            // On enlève le mot de passe de la session.
            delete req.session.user.password;

            // !! Ne pas modifier cette ligne
            res.redirect('/');
        } catch (e) {
            console.error(e.message);
            res.status(500).send('Server Error');
        }
    },

    logout: (req, res) => {
        // !! Votre code ici
        // On supprime l'utilisateur de la session
        delete req.session.user;
        // On redirige vers la page d'accueil
        console.log(req.session);
        res.redirect('/');
    },
};

module.exports = sessionController;
