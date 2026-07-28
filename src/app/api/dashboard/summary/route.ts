import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db"; // Import your MongoDB connection helper
import Book from "@/models/Book"; // Adjust path to your Book model
import BorrowRequest from "@/models/BorrowRequest"; // Adjust path to your BorrowRequest model
// import { getServerSession } from "next-auth"; // If using NextAuth
// import { authOptions } from "@/lib/auth"; // If using NextAuth

export async function GET(req: Request) {
  try {
    await connectDB();

    // --- Authentication Check ---
    // If using NextAuth:
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }
    // const currentUserId = session.user.id;

    // Hardcoded for testing until auth integration:
    const currentUserId = "LOGGED_IN_USER_ID"; 

    // 1. Shared Books Count (Books listed by the current user)
    const sharedCount = await Book.countDocuments({ ownerId: currentUserId });

    // 2. Borrowed Books Count (Approved requests for the user)
    const borrowedCount = await BorrowRequest.countDocuments({
      userId: currentUserId,
      status: "approved",
    });

    // 3. Pending Requests Count
    const pendingCount = await BorrowRequest.countDocuments({
      userId: currentUserId,
      status: "pending",
    });

    // 4. Recent Activities Table Data (Last 5 transactions)
    const rawActivities = await BorrowRequest.find({ userId: currentUserId })
      .populate("bookId", "title")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // Format activities for clean frontend consumption
    const recentActivities = rawActivities.map((item: any) => ({
      id: item._id.toString(),
      bookName: item.bookId?.title || "Unknown Book",
      activity: item.status === "approved" ? "Borrowed" : "Requested",
      date: new Date(item.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      }),
    }));

    return NextResponse.json({
      sharedCount,
      borrowedCount,
      pendingCount,
      recentActivities,
    });
  } catch (error) {
    console.error("Dashboard Summary Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard summary" },
      { status: 500 }
    );
  }
}