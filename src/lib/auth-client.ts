// lib/auth-client.ts
import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins"

// ✅ একটি মাত্র ইনস্ট্যান্স
export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL ,
  plugins: [
    jwtClient() 
  ],
});

// ✅ একই ইনস্ট্যান্স থেকে সবকিছু এক্সপোর্ট করুন
export const { signIn, signUp, signOut,useSession } = authClient;