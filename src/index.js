import React from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import InputAdornment from "@material-ui/core/InputAdornment";

import "./sprite.css";

export default function PhoneTextField(props) {
	return <TextField
		{...props}
		InputProps={{
			startAdornment: (
				<InputAdornment position="start">
					<Button size={props.size}>
						<div className="flag flag-MA" />
					</Button>
				</InputAdornment>
			),
		}}
	/>;
}
