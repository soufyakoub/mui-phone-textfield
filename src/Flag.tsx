import { CountryCode } from "libphonenumber-js";
import React from "react";
import "./sprite.css";

interface FlagProps extends React.HTMLAttributes<HTMLDivElement> {
	countryCode: CountryCode
}

export default function Flag({ className, countryCode, ...props }: FlagProps) {
	return <div
		{...props}
		className={[
			"flag",
			`flag-${countryCode}`,
			className,
		].filter(Boolean).join(" ")} />;
}
