import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	reactCompiler: true,
	allowedDevOrigins: [
		"localhost:3000",
		"192.168.1.8:3000",
		"192.168.1.8",
		"reword-frigidly-action.ngrok-free.dev",
	],
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "lh3.googleusercontent.com",
				port: "",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "api.dicebear.com",
				port: "",
				pathname: "/**",
			},
		],
	},
};

export default nextConfig;
