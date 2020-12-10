import React from "react";
import "./sprite.css";

export default function Flag({ className, countryCode, ...props }) {
	return <div
		{...props}
		className={[
			"flag",
			`flag-${countryCode}`,
			className,
		].filter(Boolean).join(" ")} />;
}
