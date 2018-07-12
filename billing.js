import stripePackage from "stripe";
import { calculateCose } from "./libs/billing-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context, callback) {
  const { storage, source } = JSON.parse(event.body);
  const amount = calculateCose(storage);
  const description = "Scratch charge";

  // Load our secret key from the environment variables
  const stripe = stripePackage(process.env.stripeSecretKey);

  try {
    await stripe.charges.create({
      source,
      amount,
      description,
      currency: "usd"
    });
    callback(
      null,
      success({
        status: true
      })
    );
  } catch (err) {
    callback(null, failure({ message: err.message }));
  }
}
