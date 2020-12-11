import React from "react";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Menu from "./Menu";

export default function PhoneTextField(props) {
	const {
		territoryDisplayNames,
		...rest
	} = props;

	return <TextField
		{...rest}
		InputProps={{
			startAdornment: (
				<InputAdornment position="start">
					<Menu
						territoryDisplayNames={territoryDisplayNames}
					/>
				</InputAdornment>
			),
		}}
	/>;
}
