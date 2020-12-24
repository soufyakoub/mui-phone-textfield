import React, { Component } from "react";
import PropTypes from 'prop-types';
import TextField, { TextFieldProps } from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import CountriesMenu, { CountriesMenuProps } from "./CountriesMenu";
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

export type PhoneTextFieldProps = Omit<TextFieldProps, "onChange"> & {
	/** A map of names to be displayed in the menu for each country code. */
	countryDisplayNames?: CountriesMenuProps["countryDisplayNames"],
	/** The currently selected country. */
	country?: CountryCode,
	/** Callback fired when a user selects a country from the menu. */
	onCountrySelect?: (data: OnCountrySelectData) => void,
	/** Callback fired when the input value changes. */
	onChange?: (data: OnChangeData) => void,
};

const countryCodes = getCountries();
const countryDisplayNamesShape = countryCodes.reduce((obj, countryCode) => {
	obj[countryCode] = PropTypes.string;
	return obj;
}, {} as Record<CountryCode, typeof PropTypes.string>);

class PhoneTextField extends Component<PhoneTextFieldProps> {
	// If a prop is used inside PhoneTextField
	// instead of passing it directly to TextField,
	// its corresponding propType should be specified.
	static propTypes = {
		countryDisplayNames: PropTypes.shape(countryDisplayNamesShape),
		country: PropTypes.oneOf(countryCodes),
		onCountrySelect: PropTypes.func,
		onChange: PropTypes.func,
		InputProps: PropTypes.object,
	}

	handleMenuItemClick: CountriesMenuProps["onItemClick"] = ({ countryCode: newCountry }) => {
		if (typeof this.props.onCountrySelect !== "function") {
			return;
		}

		const data: OnCountrySelectData = {
			country: newCountry,
		};

		if (typeof this.props.value === "string") {
			const formatter = new AsYouType(newCountry);
			const formattedValue = formatter.input(this.props.value);
			const phoneNumber = formatter.getNumber();

			data.formattedValue = formattedValue;

			if (phoneNumber?.isValid()) {
				data.phoneNumber = phoneNumber;
			}
		}

		this.props.onCountrySelect(data);
	};

	_onChange: TextFieldProps["onChange"] = event => {
		if (typeof this.props.onChange !== "function") {
			return;
		}

		const formatter = new AsYouType(this.props.country);
		const formattedValue = formatter.input(event.target.value);
		const phoneNumber = formatter.getNumber();

		const data = {
			formattedValue,
			phoneNumber: phoneNumber?.isValid() ? phoneNumber : undefined,
			event,
		};

		this.props.onChange(data);
	};

	render() {
		const {
			// Unused props to keep out from `rest`
			onCountrySelect,
			onChange,
			// ------------
			countryDisplayNames,
			country,
			InputProps,
			...rest
		} = this.props;

		return <TextField
			{...rest}
			select={false}
			type="tel"
			onChange={this._onChange}
			InputProps={{
				...InputProps,
				// It seems CountriesMenu is rerendered on every value change (performance bottleneck),
				// that's why PhoneTextField is a class component, since the reference to this.handleMenuItemClick
				// does not change, which prevents unnecessary rerenders of the memoized CountriesMenu component.
				startAdornment: <InputAdornment position="start">
					<CountriesMenu
						selectedCountry={country}
						countryDisplayNames={countryDisplayNames}
						onItemClick={this.handleMenuItemClick}
					/>
				</InputAdornment>,
			}}
		/>;
	}
}

export default PhoneTextField;
