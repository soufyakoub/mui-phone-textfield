import { CountryCode } from "libphonenumber-js";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import sprite from "./sprite.png";
import jss from "./sprite.jss.json";

interface FlagProps extends React.HTMLAttributes<HTMLDivElement> {
	/** The country corresponding to the displayed flag. */
	countryCode?: CountryCode,
	/** Adds equal bottom and top margin to compensate for the difference between height and width. */
	compensate?: boolean,
}

// @ts-ignore string literals in an imported json are typed with the general type "string", which throws false type errors.
const useStyles = makeStyles(() => ({
	...jss,
	flag: {
		...jss.flag,
		backgroundImage: `url(${sprite})`,
	}
}));

export default function Flag({ className, countryCode, compensate, ...props }: FlagProps) {
	const classes = useStyles();

	const classNames = [
		classes.flag,
		countryCode && classes[countryCode],
		compensate && classes.compensate,
		className,
	];

	return <div
		{...props}
		className={classNames.filter(Boolean).join(" ")}
	/>;
}
