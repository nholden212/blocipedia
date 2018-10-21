const Collab = require("./models").Collaborator;
const Authorizer = require("../policies/collabs");

module.exports = {

  addCollab(newCollab, callback){
    return Collab.create({
      userId: newCollab.userId,
      wikiId: newCollab.wikiId,
      username: newCollab.username
    })
    .then((collab) => {
      callback(null, collab);
    })
    .catch((err) => {
      callback(err);
    })
  },

  deleteCollab(req, callback){
    return Collab.findById(req.params.id)
    .then((collab) => {
      const authorized = new Authorizer(req.user, collab).destroy();
      if(authorized){
        collab.destroy()
        .then((res) => {
          callback(null, collab);
        });
      } else {
        req.flash("notice", "You are not authorized to do that.");
        callback(401);
      }
    })
    .catch((err) => {
      callback(err);
    });
  },

  getAllCollabsByWiki(wiki, callback){
    return Collab.findAll({
      where: { wikiId: wiki.id }
    })
    .then((collabs) => {
      callback(null, collabs);
    })
    .catch((err) => {
      callback(err);
    });
  },

  doesWikiContainCollab(wikiId, userId){
    return Collab.findOne({
      where: { wikiId: wikiId, userId: userId }
    })
    .then((collab) => {
      if(collab){
        return true;
      } else {
        return false;
      }
    })
    .catch((err) => {
      console.log(err);
    });
  }

}
