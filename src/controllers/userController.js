const userQueries = require("../db/queries.users.js");
const User = require("../db/models").User;
const passport = require("passport");
const stripe = require("stripe")(process.env.STRIPE_API_KEY);

module.exports = {

  signUp(req, res, next){
    res.render("users/sign_up");
  },

  create(req, res, next){
    let newUser = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      passwordConfirmation: req.body.passwordConfirmation
    };
    userQueries.createUser(newUser, (err, user) => {
      if(err){
        req.flash("error", err);
        res.redirect("/users/sign_up");
      } else {
        passport.authenticate("local")(req, res, () => {
          req.flash("notice", "You've successfully signed up! Check your email for confirmation.");
          res.redirect("/");
        });
      }
    });
  },

  signInForm(req, res, next){
    res.render("users/sign_in");
  },

  signIn(req, res, next){
    passport.authenticate("local")(req, res, function () {
      if(!req.user){
        req.flash("notice", "Sign in failed. Please try again.")
        res.redirect("/users/sign_in");
      } else {
        req.flash("notice", "You've successfully signed in!");
        res.redirect("/");
      }
    })
  },

  signOut(req, res, next){
    req.logout();
    req.flash("notice", "You've successfully signed out!");
    res.redirect("/");
  },

  show(req, res, next){
    userQueries.getUser(req.params.id, (err, user) => {
      if(err || user === undefined){
        req.flash("notice", "No user found with that ID.");
        res.redirect("/");
      } else {
        res.render("users/show", {user});
      }
    });
  },

  upgradePage(req, res, next){
    userQueries.getUser(req.params.id, (err, user) => {
      if(err || user === undefined){
        req.flash("notice", "No user found with that ID.");
        res.redirect("/");
      } else {
        res.render("users/upgrade", {user});
      }
    });
  },

  upgrade(req, res, next){
    const token = req.body.stripeToken;
    const email = req.body.stripeEmail;
    User.findOne({
      where: {email: email}
    })
    .then((user) => {
      if(user){
        const charge = stripe.charges.create({
          amount: 1500,
          currency: 'usd',
          description: 'Upgrade to premium',
          source: token,
        })
        .then((result) => {
          if(result){
            userQueries.toggleRole(user);
            req.flash("notice", "Upgrade successful!");
            res.redirect("/");
          } else {
              req.flash("notice", "Upgrade unsuccessful.");
              res.redirect("/users/show", {user});
          }
        })
      } else {
        req.flash("notice", "Upgrade unsuccessful.");
        res.redirect("/users/upgrade");
      }
    })
  },

  downgradePage(req, res, next){
    userQueries.getUser(req.params.id, (err, user) => {
      if(err || user === undefined){
        req.flash("notice", "No user found with that ID.");
        res.redirect("/");
      } else {
        res.render("users/downgrade", {user});
      }
    });
  },

  downgrade(req, res, next){
    User.findOne({
      where: {id: req.params.id}
    })
    .then((user) => {
      if(user){
        userQueries.toggleRole(user);
        req.flash("notice", "Downgrade successful!");
        res.redirect("/");
      } else {
          req.flash("notice", "Downgrade unsuccessful.");
          res.redirect("/users/show", {user});
      }
    })
  }

}
