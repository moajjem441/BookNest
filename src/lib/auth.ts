// lib/auth.ts
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

import { jwt } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGODB_URI!);
// কানেকশন খুলতে হবে (টপ-লেভেল await Next.js এ সাপোর্টেড)
await client.connect();

const db = client.db("booknest");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client, // ট্রানজেকশনের জন্য ক্লায়েন্ট পাঠানো হচ্ছে
  }),
  emailAndPassword: {
    enabled: true, // ইমেইল ও পাসওয়ার্ড দিয়ে লগইন সিস্টেম চালু করছে
  },

  session:{
        cookieCache:{
          enabled:true,
          strategy:"jwt",
          maxAge:7*24*60*60
        }
      },
      plugins:[
        jwt()
      ]
});