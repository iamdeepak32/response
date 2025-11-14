import cron from "node-cron";
import { sendInvitationEmail } from "./sendMessage.js";

const startTime = Date.now();
let secondsPassed = 0;

console.log(" Waiting 10 seconds before sending email...");

const job = cron.schedule("* * * * * *", async () => {
  secondsPassed++;
  console.log(` ${secondsPassed} seconds passed...`);

  if (secondsPassed === 10) {
    console.log(" 10 seconds complete — sending email...");

    try {
      await sendInvitationEmail({
        email: "deepakmalhi887@gmail.com",
        name: "Deepak",
        companyName: "Abacus",
        delaySeconds: secondsPassed,
      });

      console.log(" Email sent successfully after 10 seconds!");
    } catch (err) {
      console.error(" Failed to send email:", err);
    }

    job.stop(); 
  }
});
