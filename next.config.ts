import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	reactCompiler: true,
	allowedDevOrigins: [
		"localhost:3000",
		"192.168.1.8:3000",
		"192.168.1.8",
		"rep-deck-rudra.shares.zrok.io",
		"rep-deck-rudra.share.zrok.io",
	],
	images: {
		qualities: [75, 95],
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
	experimental: {
		cpus: 4,
		useTypeScriptCli: true,
	},
};

export default nextConfig;
