import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // React Compiler চালু করা হচ্ছে (পারফরম্যান্স বুস্টের জন্য)
  reactCompiler: true,

  // বাহ্যিক HTTPS ইমেজ লোড করার অনুমতি (যেকোনো হোস্ট থেকে)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*", // যেকোনো হোস্টনেম
        pathname: "/**", // যেকোনো পাথ
      },
    ],
  },
};

export default nextConfig;