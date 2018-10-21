const ApplicationPolicy = require("./application");

module.exports = class WikiPolicy extends ApplicationPolicy {

  new(){
    return (this._hasPremium() || this._isAdmin());
  }

  destroy(){
    return this.new();
  }

}
