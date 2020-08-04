module.exports = (sequelize, DataTypes) => {
  const attendant = sequelize.define('attendant', {
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        notEmpty: true,
      }
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        notEmpty: true,
      }
    },
    date_of_birth: {
      type: DataTypes.DATE,
      allowNull: false,
      validate:{
        notEmpty: true,
        isDate: true,
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        notEmpty: true,
        isEmail: true,
      }
    },

    // Boolean value, used to apply discount upon registration.
    // The age is calculated with the date when the camp begins minus the date of birth.
    // calculated in the front-end and sent as a boolean.
    is_underage: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      validate:{
        notEmpty: true,
      },
      defaultValue: false
    },
    street: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        notEmpty: true,
      }
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        notEmpty: true,
      }
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        notEmpty: true,
      }
    },
    allergies: {
      type: DataTypes.TEXT,
    },
    accepts_tos: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      validate:{
        notEmpty: true,
      }
    },
    registration_status: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        notEmpty: true,
      },
      defaultValue: 'New'
    },

    // used to filter if the row should be sent back to the client.
    // by default true. When deleting an attendant it is set to false.
    // this way the register is maintained in the DB but not shown.
    displayed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      validate:{
        notEmpty: true,
      },
      defaultValue: true
    },
  });

  attendant.associate = model => {
    attendant.belongsTo(model.instrument)
    attendant.hasMany(model.payment)
  };
  return attendant;
}
