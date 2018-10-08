const User = require("./models").User;
const bcrypt = require("bcryptjs");
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {

  createUser(newUser, callback){
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newUser.password, salt);
    return User.create({
      username: newUser.username,
      email: newUser.email,
      password: hashedPassword
    })
    .then((user) => {
      const msg = {
        to: user.email,
        from: 'nholden212@gmail.com',
        subject: 'Blocipedia account confirmation',
        html: '<div><h4>Welcome to Blocipedia!</h4><p>Your account has been successfully created.</p></div>',
      };
      sgMail.send(msg);
      callback(null, user);
    })
    .catch((err) => {
      callback(err);
    })
  },

  getUser(id, callback){
    return User.findById(id)
    .then((user) => {
      callback(null, user);
    })
    .catch((err) => {
      callback(err);
    })
  }

}
