module.exports = function(sequelize, Sequelize) {
    var BlackCard = sequelize.define('blackCard', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },

        text: {
            type: Sequelize.STRING,
            notEmpty: true
        },    
    }, {
    timestamps: false
    });

return BlackCard;
}
