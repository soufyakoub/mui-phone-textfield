import React, { ChangeEvent, Component } from "react";
import PropTypes from 'prop-types';
import TextField, { TextFieldProps } from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import CountriesMenu, { CountriesMenuProps } from "./CountriesMenu";
import { CountryCode, AsYouType, PhoneNumber, getCountries } from "libphonenumber-js";
import merge from "lodash/merge";

interface PhoneNumberChangeEvent<T = Element> extends ChangeEvent<T> {
	/**
	 * An instance of the `PhoneNumber` class,
	 * or `undefined` if no valid phone number for the selected country could be parsed from the input's value.
	 */
	phoneNumber?: PhoneNumber,
	currentTarget: EventTarget & T & {
		/** The formatted input value for the selected country. */
		formattedValue: string,
	}
};

type OnCountrySelectData = {
	/** The selected country. */
	country: CountryCode,
	/** The formatted input value for the selected country. */
	formattedValue?: string,
	/**
	 * An instance of the `PhoneNumber` class,
	 * or `undefined` if no valid phone number for the selected country could be parsed from the input's value.
	 */
	phoneNumber?: PhoneNumber,
}

export type PhoneTextFieldProps = Omit<TextFieldProps, "onChange"> & {
	/** A map of names to be displayed in the menu for each country code. */
	countryDisplayNames?: CountriesMenuProps["countryDisplayNames"],
	/** The currently selected country. */
	country: CountryCode,
	/** Callback fired when a country is selected from the menu. */
	onCountrySelect?: (data: OnCountrySelectData) => void,
	/** Callback fired when the input value changes. */
	onChange?: (event: PhoneNumberChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void,
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
		country: PropTypes.oneOf(countryCodes).isRequired,
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

			if (phoneNumber && phoneNumber.isValid()) {
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

		const additionalProps = {
			currentTarget: {
				formattedValue,
			},
			phoneNumber: phoneNumber?.isValid() ? phoneNumber : undefined,
		};

		const extendedChangeEvent = merge(event, additionalProps);

		this.props.onChange(extendedChangeEvent);
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
