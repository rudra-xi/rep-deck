import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	reactCompiler: true,
	allowedDevOrigins: ["localhost:3000", "192.168.1.8:3000", "192.168.1.8"],
};

export default nextConfig;
