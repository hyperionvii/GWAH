module.exports = function(sequelize, Sequelize) {

	var User = sequelize.define('user', {
		id: { autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER},
		firstname: { type: Sequelize.STRING,notEmpty: true},
		lastname: { type: Sequelize.STRING,notEmpty: true},
		username: {type: Sequelize.STRING,notEmpty: true},
		email: { type:Sequelize.STRING, validate: {isEmail:true} },
		password : {type: Sequelize.STRING,allowNull: false },
		last_login: {type: Sequelize.DATE},
    status: {type: Sequelize.ENUM('active','inactive'),defaultValue:'active' }

});

	 //  // Creating a custom method for our User model. This will check if an unhashed password entered by the user can be compared to the hashed password stored in our database
  // User.prototype.validPassword = function(password) {
  //   return bcrypt.compareSync(password, this.password);
  // };
  // // Hooks are automatic methods that run during various phases of the User Model lifecycle
  // // In this case, before a User is created, we will automatically hash their password
  // User.hook("beforeCreate", function(user) {
  //   user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
  // });
  // return User;

	return User;

}
