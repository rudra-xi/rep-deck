import { ROADMAP, type RoadmapVersion } from "@/constants";

export function getItemsByVersion(version: RoadmapVersion) {
	return ROADMAP.filter((item) => item.version === version);
}

export function getNextUp() {
	return (
		ROADMAP.find((i) => i.status === "in-progress") ??
		ROADMAP.find((i) => i.status === "planned") ??
		null
	);
}
