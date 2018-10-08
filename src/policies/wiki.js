const ApplicationPolicy = require("./application");

module.exports = class WikiPolicy extends ApplicationPolicy {

  edit(){
    return this.user != null;
  }

  update(){
    return this.edit();
  }

}
