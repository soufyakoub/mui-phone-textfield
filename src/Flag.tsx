import { CountryCode } from "libphonenumber-js";
import React from "react";
import "./sprite.css";

interface FlagProps extends React.HTMLAttributes<HTMLDivElement> {
	/** The country corresponding to the displayed flag. */
	countryCode?: CountryCode
}

export default function Flag({ className, countryCode, ...props }: FlagProps) {
	return <div
		{...props}
		className={[
			"flag",
			countryCode && `flag-${countryCode}`,
			className,
		].filter(Boolean).join(" ")} />;
}
