module.exports = (sequelize, DataTypes) => {
  const payment = sequelize.define('payment', {

    // All payments will be stored as an integer to avoid decimal fluctuation.
    // Numbers should be divided by 100 when used.
    // Values are always positive. In case of a negative value,
    // it should be marked as a refund in the type_of_payment field.
    amount_paid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate:{
        notEmpty: true,
      }
    },
    payment_date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate:{
        notEmpty: true,
        isDate: true,
      }
    },

    //indicates wether the value will be counted as positive or negative when using the data.
    type_of_payment: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        notEmpty: true,
      }
    }
  });

  payment.associate = models => {
    payment.belongsTo(models.attendant);
  };

  return payment;
}