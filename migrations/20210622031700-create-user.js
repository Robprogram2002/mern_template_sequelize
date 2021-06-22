module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        required: true,
        unique: true,
      },
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      email: {
        type: Sequelize.STRING,
        required: true,
        validate: {
          isEmail: { message: 'Please enter a valid email address' },
        },
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        required: true,
        validate: {
          min: 6,
          max: 30,
        },
      },
      name: {
        type: Sequelize.STRING,
        required: true,
        validate: {
          min: 3,
        },
      },
      status: {
        type: Sequelize.STRING,
        values: ['user', 'suspended', 'cancel', 'deleded', 'admin'],
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('users');
  },
};
