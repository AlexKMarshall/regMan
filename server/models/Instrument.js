module.exports = (sequelize, DataTypes) => {
  const instrument = sequelize.define('instrument', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },

    // maximum number of attendants per group. Used when registering a new attendant to
    // determine his status as new registration or waitlist.
    max_attendants: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
        isInt: true,
      },
    },
  });

  instrument.associate = (model) => {
    instrument.hasMany(model.attendant);
  };

  return instrument;
};
