module.exports = (sequelize, DataTypes) => {
  const payment = sequelize.define('payment', {
    amount_paid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      }
    },
    payment_date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: true,
        isDate: true,
      }
    },
    type_of_payment: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      }
    }
  })
  payment.associate = models => {
    payment.belongsTo(models.attendant);
  };
  return payment
}