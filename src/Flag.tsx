import { CountryCode } from "libphonenumber-js";
import React from "react";
import "./sprite.css";

interface FlagProps extends React.HTMLAttributes<HTMLDivElement> {
	/** The country corresponding to the displayed flag. */
	countryCode?: CountryCode,
}

export default function Flag({ className, countryCode, ...props }: FlagProps) {
	const classNames = [
		"flag",
		countryCode && `flag-${countryCode}`,
		className,
	];

	return <div
		{...props}
		className={classNames.filter(Boolean).join(" ")}
	/>;
}
