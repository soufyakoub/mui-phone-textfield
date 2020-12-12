import React from "react";
import SvgIcon, { SvgIconProps } from "@material-ui/core/SvgIcon";

export default function ArrowDropDownIcon(props: SvgIconProps) {
	return <SvgIcon {...props}>
		<path d="M7 10l5 5 5-5z" />
	</SvgIcon>;
}
