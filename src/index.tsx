import React from "react";
import TextField, { TextFieldProps } from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Menu from "./Menu";
import { CountryCode } from "libphonenumber-js";

type PhoneTextFieldProps = TextFieldProps & {
	territoryDisplayNames?: Record<CountryCode, string>,
};

export default function PhoneTextField(props: PhoneTextFieldProps) {
	const {
		territoryDisplayNames,
		...rest
	} = props;

	const handleMenuItemClick = () => { };

	return <TextField
		{...rest}
		InputProps={{
			startAdornment: (
				<InputAdornment position="start">
					<Menu
						territoryDisplayNames={territoryDisplayNames}
						onItemClick={handleMenuItemClick}
					/>
				</InputAdornment>
			),
		}}
	/>;
}
