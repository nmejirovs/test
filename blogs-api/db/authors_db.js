let sequelize;
let User;

const init = async (conf) => {
    const Sequelize = require("sequelize");
    sequelize = new Sequelize(conf);

    User = sequelize.define('authors', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true
        },
        name: {
          type: Sequelize.STRING
        }
      }, {
        freezeTableName: true // Model tableName will be the same as the model name
      });

      const user = await User.findByPk(1);

};

module.exports = {
    init
};