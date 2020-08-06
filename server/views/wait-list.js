// html of the waitlist email. css has to be hardcoded for nodemail to interpret it correctly.
exports.waitlist = (participant) => {
  return `
  <!DOCTYPE html>
  <html>
    <body>
      <div class="email" style="width: 100%; display: flex; justify-content: center; background-color: #f4f3f1">
        <div class="mail-body" style="background-color: #f2e0ce; max-width: 600px; margin: 0 auto">
          <div class="header" style="background-image: url('http://www.crisoldecuerda.com/wp-content/uploads/2020/01/Crisol-345.jpg'); background-size: cover; width: 100%; height: 250px;"></div>
          <div class="text" style="padding: 0 20px;">
            <h3>Hello ${participant.first_name}!!</h3>
            <p>We've received your registration but unfortunately we're out of spots for ${participant.instrument}.</p>
            <p>Don't worry. There's still hope!</p>
            <p>We've placed you in the waitlist and we'll contact you as soon as a spot opens up.</p>
            <br />
            <p>In the meantime, don't hessitate to contact us if you need any clarification.</p>
            <p>Best of luck!</p>
            <div class="signature" style="background-image: url(http://www.crisoldecuerda.com/wp-content/uploads/2012/02/logo-black11.png); width: 180px; height: 52px; margin: 0 0 30px 0;"></div>
          </div>
        </div>
      </div>
    </body>
  </html>
`;
};
