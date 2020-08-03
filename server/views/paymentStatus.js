const moment = require('moment');

exports.paymentStatus = (paymentData) => {
  const { payments } = paymentData
  const course_price = 60000;
  const amount_paid = payments.reduce((acc, el) => {
    const value = el.type_of_payment === 'Refund' ? -el.amount_paid : +el.amount_paid;
    return acc + value;
  }, 0);
  const amount_due = course_price - amount_paid;
  const paymentComplete = amount_due === 0 ? true : false;

  return `
  <!DOCTYPE html>
  <html>
    <body>
      <div class="email" style="width: 100%; display: flex; justify-content: center; background-color: #f4f3f1">
        <div class="mail-body" style="background-color: #f2e0ce; max-width: 600px; margin: 0 auto">
          <div class="header" style="background-image: url('http://www.crisoldecuerda.com/wp-content/uploads/2020/01/Crisol-345.jpg'); background-size: cover; width: 100%; height: 250px;"></div>
          <div class="text" style="padding: 0 20px;">
            <h3>Hello ${paymentData.first_name},</h3>
            ${paymentComplete
              ? ("<p>We've received your last payment and your registration is complete. Now you just have to wait and practice your tunes until August.</p>")
              : (`<p>This is just a friendly reminder of your payment status.</p>
            <p>The course total is 600€ and until now we've received ${Number.parseFloat(amount_paid/100).toFixed(2)}€.</p>
            <p>Your total amount due before the 1st of June is <b>${Number.parseFloat(amount_due/100).toFixed(2)}€</b>.</p>
            <p>Here's list of all the payments received until today. If you've made any other payments, we might have missed it. Please send us the receipt so that we can track them down.</p>
            <ul>
            ${payments.map(payment => {
              const value = payment.type_of_payment === 'Refund' ? -payment.amount_paid : +payment.amount_paid;
              return `<li>${Number.parseFloat(value/100).toFixed(2)}€ ${payment.type_of_payment === 'Refund' ? 'refunded' : (payment.type_of_payment === 'Payment' ? 'received' : 'applied discount')} on ${moment(payment.payment_date).format('DD/MM/YYYY')}</li>`
            }).join('')}
            </ul>`)}
            <p>As usual, don't hesitate to contact us if you have any doubts.</p>
            <p>All the best,</p>
            <div class="signature" style="background-image: url(http://www.crisoldecuerda.com/wp-content/uploads/2012/02/logo-black11.png); width: 180px; height: 52px; margin: 0 0 30px 0;"></div>
          </div>
        </div>
      </div>
    </body>
  </html>
`
}