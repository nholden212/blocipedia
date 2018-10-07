const ApplicationPolicy = require("./application");

module.exports = class WikiPolicy extends ApplicationPolicy {

  edit(){
    return (this._hasPremium() || this._isAdmin());
  }

  update(){
    return this.edit();
  }

  destroy(){
    return this._isAdmin();
  }

}
