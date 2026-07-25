import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();
    await client.db("booknest").command({ ping: 1 });
    await client.close();
    return NextResponse.json({ success: true, message: "MongoDB ঠিকঠাক কাজ করছে! 🎉" });
  } catch (error: any) {
    console.error("টেস্ট এরর:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      code: error.code 
    }, { status: 500 });
  }
}