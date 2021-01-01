import React, { ChangeEvent } from "react";
import PropTypes from 'prop-types';
import TextField, { TextFieldProps } from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import CountriesMenu from "./CountriesMenu";
import { CountryCode, AsYouType, PhoneNumber, getCountries } from "libphonenumber-js";

type OnCountrySelectData = {
	/** The formatted value for the selected country. Extracted from the `value` prop. */
	formattedValue?: string,
	/**
	 * An instance of the [PhoneNumber](https://github.com/catamphetamine/libphonenumber-js/blob/master/README.md#phonenumber) class,
	 * or `undefined` if no valid phone number could be parsed from the `value` prop.
	 */
	phoneNumber?: PhoneNumber,
	/** The selected country. */
	country: CountryCode,
}

type OnChangeData = {
	/** The formatted value for the selected country. Extracted from the input value. */
	formattedValue: string,
	/**
	 * An instance of the [PhoneNumber](https://github.com/catamphetamine/libphonenumber-js/blob/master/README.md#phonenumber) class,
	 * or `undefined` if no valid phone number could be parsed from the input value.
	 */
	phoneNumber?: PhoneNumber,
	/** The original event that triggered the `onChange` handler. */
	event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
}

export type PhoneTextFieldProps = Omit<TextFieldProps, "onChange" | "select" | "type"> & {
	/** A map of names to be displayed in the menu for each country code. */
	countryDisplayNames?: Record<CountryCode, string>,
	/** The currently selected country. */
	country?: CountryCode,
	/** Callback fired when a user selects a country from the menu. */
	onCountrySelect?: (data: OnCountrySelectData) => void,
	/** Callback fired when the input value changes. */
	onChange?: (data: OnChangeData) => void,
};

const PhoneTextField = (props: PhoneTextFieldProps) => {
	const {
		onCountrySelect,
		onChange,
		value,
		country,
		countryDisplayNames,
		InputProps,
		...rest
	} = props;

	const handleMenuItemClick = ({ countryCode }: { countryCode: CountryCode }) => {
		if (!onCountrySelect) return;

		const data: OnCountrySelectData = {
			country: countryCode,
		};

		if (typeof value === "string") {
			const formatter = new AsYouType(countryCode);
			const formattedValue = formatter.input(value);
			const phoneNumber = formatter.getNumber();

			data.formattedValue = formattedValue;

			if (phoneNumber?.isValid()) {
				data.phoneNumber = phoneNumber;
			}
		}

		onCountrySelect(data);
	};

	const internalOnChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		if (!onChange) return;

		const formatter = new AsYouType(country);
		const formattedValue = formatter.input(event.target.value);
		const phoneNumber = formatter.getNumber();

		const data = {
			formattedValue,
			phoneNumber: phoneNumber?.isValid() ? phoneNumber : undefined,
			event,
		};

		onChange(data);
	};

	return <TextField
		{...rest}
		select={false}
		type="tel"
		value={value}
		onChange={onChange ? internalOnChange : undefined}
		InputProps={{
			...InputProps,
			startAdornment: <InputAdornment position="start">
				<CountriesMenu
					selectedCountry={country}
					countryDisplayNames={countryDisplayNames}
					onItemClick={handleMenuItemClick}
				/>
			</InputAdornment>,
		}}
	/>;
}

const countryCodes = getCountries();
const countryDisplayNamesShape = countryCodes.reduce(
	(obj, countryCode) => {
		obj[countryCode] = PropTypes.string;
		return obj;
	},
	{} as Record<CountryCode, typeof PropTypes.string>
);

// If a prop is used inside PhoneTextField instead of passing it directly to TextField,
// its corresponding propType should be specified.
PhoneTextField.propTypes = {
	countryDisplayNames: PropTypes.shape(countryDisplayNamesShape),
	country: PropTypes.oneOf(countryCodes),
	onCountrySelect: PropTypes.func,
	onChange: PropTypes.func,
	InputProps: PropTypes.object,
};

export default PhoneTextField;
