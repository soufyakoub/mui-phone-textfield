import React from "react";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Menu from "./Menu";

export default function PhoneTextField(props) {

	return <TextField
		{...props}
		InputProps={{
			startAdornment: (
				<InputAdornment position="start">
					<Menu />
				</InputAdornment>
			),
		}}
	/>;
}
