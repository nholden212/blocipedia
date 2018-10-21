'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: { msg: "must be a valid email" }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "standard"
    }
  }, {});
  User.associate = function(models) {
    User.hasMany(models.Wiki, {
      foreignKey: "userId",
      as: "wikis"
    });
    User.hasMany(models.Collaborator, {
      foreignKey: "userId",
      as: "collaborators"
    });
  };

  User.prototype.hasPremium = function() {
    return this.role === "premium";
  };

  User.prototype.isAdmin = function() {
    return this.role === "admin";
  };

  User.prototype.isOwner = function(wiki) {
    return wiki.userId === this.id
  };

  User.prototype.isCollaborator = function(wiki) {
    let result = false;
    const collabQueries = require("../queries.collabs.js");
    return collabQueries.getAllCollabsByWiki(wiki, (err, collabs) => {
      if(err || collabs === undefined){
        console.log(err);
      } else {
        if(collabs.includes(this.id)){
          result = true;
        }
        return result;
        }
    });
  }

  return User;
};
