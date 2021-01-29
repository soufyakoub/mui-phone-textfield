import { CountryCode } from "libphonenumber-js";
import React from "react";
import "./sprite.css";

interface FlagProps extends React.HTMLAttributes<HTMLDivElement> {
	/** The country corresponding to the displayed flag. */
	countryCode?: CountryCode,
	/** Adds equal bottom and top margin to compensate for the difference between height and width. */
	compensate?: boolean,
}

export default function Flag({ className, countryCode, compensate, ...props }: FlagProps) {
	const classNames = [
		"flag",
		countryCode && `flag-${countryCode}`,
		compensate && "flag-margin-compensate",
		className,
	];

	return <div
		{...props}
		className={classNames.filter(Boolean).join(" ")}
	/>;
}
