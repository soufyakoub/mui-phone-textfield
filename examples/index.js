import React, { useState } from "react";
import ReactDOM from "react-dom";
import Grid from "@material-ui/core/Grid";
import PhoneInput from "..";

const input_props = [
	{ size: "medium", variant: "outlined" },
	{ size: "medium", variant: "filled" },
	{ size: "medium", variant: "standard" },
	{ size: "small", variant: "outlined" },
	{ size: "small", variant: "filled" },
	{ size: "small", variant: "standard" },
];

function Example(props) {
	const [value, setValue] = useState("");
	const [country, setCountry] = useState("MA");
	const [phoneNumber, setPhoneNumber] = useState();

	const onChange = ({ formattedValue, phoneNumber }) => {
		setValue(formattedValue);
		setPhoneNumber(phoneNumber);
	};

	const onCountrySelect = ({ country, formattedValue, phoneNumber }) => {
		setValue(formattedValue);
		setCountry(country);
		setPhoneNumber(phoneNumber);
	};

	return <>
		<PhoneInput
			{...props}
			label="Phone number"
			error={Boolean(value && phoneNumber?.country !== country)}
			value={value}
			country={country}
			onCountrySelect={onCountrySelect}
			onChange={onChange}
		/>
		<br /><br />
		<div>International: {phoneNumber?.format("INTERNATIONAL")}</div>
		<div>National: {phoneNumber?.format("NATIONAL")}</div>
		<div>E.164: {phoneNumber?.format("E.164")}</div>
		<div>Country: {phoneNumber?.country}</div>
		<div>Calling code: {phoneNumber?.countryCallingCode}</div>
	</>;
}

ReactDOM.render(
	<React.StrictMode>
		<Grid container spacing={2}>
			{input_props.map(props =>
				<Grid item key={props.size + props.variant} >
					<Example {...props} />
				</Grid>)}
		</Grid>
	</React.StrictMode>,
	document.getElementById('root')
);
