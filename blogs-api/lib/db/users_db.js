let sequelize;
let User;

const init = async (conf) => {
  const Sequelize = require("sequelize");
  sequelize = new Sequelize(conf.database, conf.user, conf.password, {
    host: conf.host,
    dialect: conf.dialect
  });

  User = sequelize.define('users', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    username: {
      type: Sequelize.STRING
    }
  }, {
    freezeTableName: true, // Model tableName will be the same as the model name
    timestamps: false
  });
};

const getUserData = async ({username}) => {
  const users = await User.findAll({
    where: {
      username: username
    }
  });
  return users[0].dataValues;
};

module.exports = {
  init, 
  getUserData
};