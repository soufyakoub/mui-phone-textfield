import { CountryCode } from "libphonenumber-js";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import sprite_x1 from "./assets/sprite_x1.png";
import sprite_x2 from "./assets/sprite_x2.png";
import jss from "./assets/sprite.jss.json";

interface FlagProps extends React.HTMLAttributes<HTMLDivElement> {
	/** The country corresponding to the displayed flag. */
	countryCode?: CountryCode,
	/** Adds equal bottom and top margin to compensate for the difference between height and width. */
	compensate?: boolean,
}

const retina_media_query = "@media "
	+ "only screen and (-webkit-min-device-pixel-ratio: 2),"
	+ "only screen and (   min--moz-device-pixel-ratio: 2),"
	+ "only screen and (     -o-min-device-pixel-ratio: 2/1),"
	+ "only screen and (        min-device-pixel-ratio: 2),"
	+ "only screen and (                min-resolution: 192dpi),"
	+ "only screen and (                min-resolution: 2dppx)";

// @ts-ignore string literals in an imported json are typed with the general type "string", which throws false type errors.
const useStyles = makeStyles(() => ({
	...jss,
	flag: {
		...jss.flag,
		backgroundImage: `url(${sprite_x1})`,
	},
	[retina_media_query]: {
		flag: {
			backgroundImage: `url(${sprite_x2})`,
		},
	},
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
