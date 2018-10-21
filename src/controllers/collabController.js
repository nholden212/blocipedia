const collabQueries = require("../db/queries.collabs.js");
const wikiQueries = require("../db/queries.wikis.js");
const userQueries = require("../db/queries.users.js");
const Authorizer = require("../policies/collabs");
const markdown = require( "markdown" ).markdown;

module.exports = {

  new(req, res, next){
    const authorized = new Authorizer(req.user).new();
    if(authorized){
      wikiQueries.getWiki(req.params.id, (err, wiki) => {
        if(err || wiki == null){
          res.redirect(404, "/");
        } else {
          wiki.title = markdown.toHTML(wiki.title);
          wiki.body = markdown.toHTML(wiki.body);
          res.render("collabs/new", {wiki});
        }
      });
    } else {
      req.flash("notice", "You are not authorized to do that.");
      res.redirect(`/wikis/${req.params.id}/edit`);
    }
  },

  create(req, res, next){
    const authorized = new Authorizer(req.user).create();
    if(authorized){
      userQueries.getUserByUsername(req.body.username, (err, user) => {
        if(err || user == null){
          res.redirect(404, "/");
        } else {
          let newCollab = {
            userId: user.id,
            wikiId: req.params.id,
            username: user.username
          };
          if(collabQueries.doesWikiContainCollab(req.params.id, user.id)){
            req.flash("notice", "Collaborator is a duplicate.");
            res.redirect(303, `/wikis/${req.params.id}`);
          } else {
            collabQueries.addCollab(newCollab, (err, collab) => {
              if(err){
                req.flash("notice", "There was a problem adding this collaborator.");
                res.redirect(500, `/wikis/${req.params.id}/new`);
              } else {
                req.flash("notice", "Collaborator added!");
                res.redirect(303, `/wikis/${req.params.id}`);
              }
            });
          }
        }
      });
    } else {
      req.flash("notice", "You are not authorized to do that.");
      res.redirect("/wikis");
    }
  },

  destroy(req, res, next){
    collabQueries.deleteCollab(req, (err, wiki) => {
      if(err){
        res.redirect(500, "/wikis");
      } else {
        res.redirect(303, "/wikis");
      }
    });
  },

}
