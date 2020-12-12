import React, {useState} from "react";
import TextField, { TextFieldProps } from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Menu, {MenuProps} from "./Menu";
import { CountryCode } from "libphonenumber-js";

export type PhoneTextFieldProps = TextFieldProps & {
	territoryDisplayNames?: MenuProps["territoryDisplayNames"],
};

export default function PhoneTextField(props: PhoneTextFieldProps) {
	const [currentCountry, setCurrentCountry] = useState<CountryCode>("MA");

	const {
		territoryDisplayNames,
		...rest
	} = props;

	const handleMenuItemClick: MenuProps["onItemClick"] = ({countryCode})=>{
		setCurrentCountry(countryCode);
	}

	return <TextField
		{...rest}
		InputProps={{
			startAdornment: (
				<InputAdornment position="start">
					<Menu
						currrentCountry={currentCountry}
						territoryDisplayNames={territoryDisplayNames}
						onItemClick={handleMenuItemClick}
					/>
				</InputAdornment>
			),
		}}
	/>;
}
