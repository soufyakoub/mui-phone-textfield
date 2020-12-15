import React, { useMemo, useRef, useState } from "react";
import TextField, { TextFieldProps } from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import CountriesMenu, { CountriesMenuProps } from "./CountriesMenu";
import { CountryCode, AsYouType, CountryCallingCode, PhoneNumber } from "libphonenumber-js";

export type PhoneTextFieldProps = TextFieldProps & {
	territoryDisplayNames?: CountriesMenuProps["territoryDisplayNames"],
	initialCountry: CountryCode,
	onCountryChange?: (country: CountryCode, callingCode: CountryCallingCode) => void,
	onChange?: (phoneNumber?: PhoneNumber) => void
};

export default function PhoneTextField(props: PhoneTextFieldProps) {
	const {
		initialCountry,
		territoryDisplayNames,
		onCountryChange,
		onChange,
		error,
		InputProps,
		...rest
	} = props;

	const [currentCountry, setCurrentCountry] = useState<CountryCode>(initialCountry);
	const [value, setValue] = useState("");

	// This ref is used to get the current value inside a memoized handler.
	const valueRef = useRef("");
	valueRef.current = value;

	const updateValue = (newValue: string, defaultCountry: CountryCode) => {
		const formatter = new AsYouType(defaultCountry);
		const formattedValue = formatter.input(newValue);
		const phoneNumber = formatter.getNumber();

		setValue(formattedValue);

		// Return the phoneNumber instance only when the number is valid for the selected country.
		if (phoneNumber &&
			phoneNumber.country === defaultCountry &&
			phoneNumber.isValid()
		) {
			return phoneNumber;
		}
	};

	const handleMenuItemClick: CountriesMenuProps["onItemClick"] = ({ countryCode, callingCode }) => {
		setCurrentCountry(countryCode);
		const phoneNumber = updateValue(valueRef.current, countryCode);

		if (onCountryChange) {
			onCountryChange(countryCode, callingCode);
		}

		if (onChange) {
			onChange(phoneNumber);
		}
	};

	const _onChange: TextFieldProps["onChange"] = event => {
		const phoneNumber = updateValue(event.target.value, currentCountry);

		if (onChange) {
			onChange(phoneNumber);
		}
	};

	// It seems that InputAdornment and its children get re-rendered unnecessarily
	// even if their props are not changing.
	// So I decided to memoize the result,
	// and use a ref in the handleMenuItemClick function to get the current value.
	const startAdornment = useMemo(() =>
		<InputAdornment position="start">
			<CountriesMenu
				currrentCountry={currentCountry}
				territoryDisplayNames={territoryDisplayNames}
				onItemClick={handleMenuItemClick}
			/>
		</InputAdornment>,
		[currentCountry, territoryDisplayNames]
	);

	return <TextField
		{...rest}
		select={false}
		type="tel"
		value={value}
		error={Boolean(value && error)}
		onChange={_onChange}
		InputProps={{
			...InputProps,
			startAdornment,
		}}
	/>;
}
