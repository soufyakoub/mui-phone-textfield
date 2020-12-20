import React, { Component } from "react";
import PropTypes from 'prop-types';
import TextField, { TextFieldProps } from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import CountriesMenu, { CountriesMenuProps } from "./CountriesMenu";
import { CountryCode, AsYouType, CountryCallingCode, PhoneNumber, getCountries } from "libphonenumber-js";

export type PhoneTextFieldProps = TextFieldProps & {
	/** A map of names to be displayed in the menu for each country code. */
	countryDisplayNames?: CountriesMenuProps["countryDisplayNames"],
	/** The country that will be selected on first render. */
	initialCountry: CountryCode,
	/** Callback fired when the selected country changes. */
	onCountryChange?: (country: CountryCode, callingCode: CountryCallingCode) => void,
	/**
	 * Callback fired when the input value changes.
	 * @param phoneNumber - A `PhoneNumber` instance if the input value is a valid phone number,
	 * `undefined` otherwise.
	 */
	onChange?: (phoneNumber?: PhoneNumber) => void
};

const countryCodes = getCountries();
const countryDisplayNamesShape = countryCodes.reduce((obj, countryCode) => {
	obj[countryCode] = PropTypes.string;
	return obj;
}, {} as Record<CountryCode, typeof PropTypes.string>);

class PhoneTextField extends Component<PhoneTextFieldProps, { currentCountry: CountryCode, value: string }> {

	constructor(props: PhoneTextFieldProps) {
		super(props)

		this.state = {
			currentCountry: props.initialCountry,
			value: "",
		}
	}

	// If a prop is used inside PhoneTextField
	// instead of passing it directly to TextField,
	// its corresponding propType should be specified.
	static propTypes = {
		countryDisplayNames: PropTypes.shape(countryDisplayNamesShape),
		initialCountry: PropTypes.oneOf(countryCodes).isRequired,
		onCountryChange: PropTypes.func,
		onChange: PropTypes.func,
		error: PropTypes.bool,
		InputProps: PropTypes.object,
	}

	updateValue = (newValue: string, defaultCountry: CountryCode) => {
		const formatter = new AsYouType(defaultCountry);
		const formattedValue = formatter.input(newValue);
		const phoneNumber = formatter.getNumber();

		this.setState({ value: formattedValue });

		// Return the phoneNumber instance only when the number is valid for the selected country.
		if (phoneNumber &&
			phoneNumber.country === defaultCountry &&
			phoneNumber.isValid()
		) {
			return phoneNumber;
		}
	};

	handleMenuItemClick: CountriesMenuProps["onItemClick"] = ({ countryCode, callingCode }) => {
		this.setState({ currentCountry: countryCode });
		const phoneNumber = this.updateValue(this.state.value, countryCode);

		this.props.onCountryChange?.(countryCode, callingCode);

		this.props.onChange?.(phoneNumber);
	};

	_onChange: TextFieldProps["onChange"] = event => {
		const phoneNumber = this.updateValue(event.target.value, this.state.currentCountry);

		this.props.onChange?.(phoneNumber);
	};

	render() {
		const {
			initialCountry,
			countryDisplayNames,
			onCountryChange,
			onChange,
			error,
			InputProps,
			...rest
		} = this.props;

		return <TextField
			{...rest}
			select={false}
			type="tel"
			value={this.state.value}
			error={Boolean(this.state.value && error)}
			onChange={this._onChange}
			InputProps={{
				...InputProps,
				// It seems CountriesMenu is rerendered on every value change,
				// that's why PhoneTextField is a class component, since the reference to this.handleMenuItemClick
				// does not change, which prevents rerendering the memoized CountriesMenu component.
				startAdornment: <InputAdornment position="start">
					<CountriesMenu
						selectedCountry={this.state.currentCountry}
						countryDisplayNames={countryDisplayNames}
						onItemClick={this.handleMenuItemClick}
					/>
				</InputAdornment>,
			}}
		/>;
	}
}

export default PhoneTextField;
