[![npm](https://img.shields.io/npm/dt/mui-phone-textfield)](https://www.npmjs.com/package/mui-phone-textfield)
[![npm](https://img.shields.io/npm/v/mui-phone-textfield)](https://www.npmjs.com/package/mui-phone-textfield)
[![Build Status](https://travis-ci.com/soufyakoub/mui-phone-textfield.svg?branch=main)](https://travis-ci.com/soufyakoub/mui-phone-textfield)
[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/soufyakoub/mui-phone-textfield/blob/main/LICENSE)

# mui-phone-textfield
> A phone number input for Material-UI.

![different variants of the same component](https://media.giphy.com/media/dfEkB4SEErQuv6l68I/giphy.gif)

[Live demo](https://soufyakoub.github.io/mui-phone-textfield/)

## Installation

Via [npm](https://npmjs.org/)

```sh
npm install mui-phone-textfield
```

Via [yarn](https://yarnpkg.com)

```sh
yarn add mui-phone-textfield
```

## Usage
The component can be used the same way as the [TextField](https://material-ui.com/components/text-fields/) component from [Material-UI](https://material-ui.com/) with some [additional props](https://github.com/soufyakoub/mui-phone-textfield/blob/main/README.md#api):

```javascript
import React, { useState } from "react";
import PhoneTextField from "mui-phone-textfield";

function Example() {
	const [value, setValue] = useState(""); // The input value.
	const [country, setCountry] = useState("US"); // The selected country.
	const [phoneNumber, setPhoneNumber] = useState(); // The PhoneNumber instance.

	const onChange = ({ formattedValue, phoneNumber }) => {
		setValue(formattedValue);
		setPhoneNumber(phoneNumber);
	};

	const onCountrySelect = ({ country, formattedValue, phoneNumber }) => {
		setValue(formattedValue);
		setCountry(country);
		setPhoneNumber(phoneNumber);
	};

	return <PhoneTextField
		label="Phone number"
		error={Boolean(value && phoneNumber?.country !== country)}
		value={value}
		country={country}
		onCountrySelect={onCountrySelect}
		onChange={onChange}
	/>;
}
```

## API

In addtion to [TextField](https://material-ui.com/api/text-field/#props)'s props (except `onChange`, `select` and `type`), The component accepts the following:

| prop | type | description|
|-|-|-|
| country | string | The selected country. A [two-letter ISO country code](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Officially_assigned_code_elements). |
| [onCountrySelect](https://github.com/soufyakoub/mui-phone-textfield/blob/main/README.md#oncountryselect) | function | Callback fired when a user selects a country from the menu. |
| [onChange](https://github.com/soufyakoub/mui-phone-textfield/blob/main/README.md#onchange) | function | Callback fired when the input value changes. |
| countryDisplayNames | object | An object that maps a [two-letter ISO country code](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Officially_assigned_code_elements) to a country name. can be used for localisation. |

**Note**: The `startAdornment` key of `InputProps` prop is reserved for the countries menu, but all the other keys are left untouched.

## Event listeners

### onCountrySelect

Callback fired when a user selects a country from the menu. It receives an object with these properties:

- `formattedValue` {string | undefined}: The formatted value for the selected country. Extracted from the `value` prop.
- `phoneNumber` {object | undefined}: An instance of the [PhoneNumber](https://github.com/catamphetamine/libphonenumber-js/blob/master/README.md#phonenumber) class, or `undefined` if no valid phone number could be parsed from the `value` prop.
- `country` {string}: The selected country. A [two-letter ISO country code](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Officially_assigned_code_elements).

### onChange

Callback fired when the input value changes. It receives an object with these properties:

- `formattedValue` {string}: The formatted value for the selected country. Extracted from the input value.
- `phoneNumber` {object | undefined}: An instance of the [PhoneNumber](https://github.com/catamphetamine/libphonenumber-js/blob/master/README.md#phonenumber) class, or `undefined` if no valid phone number could be parsed from the input value.
- `event` {object}: The original event that triggered the `onChange` handler.

## Contributing

### Prerequisites
- [nodejs](https://nodejs.org)
- [python 3.8](https://www.python.org/downloads/release/python-380/)
- [pipenv](https://pypi.org/project/pipenv/)

### Getting Started

After cloning this repo, ensure dependencies are installed by running:

```sh
npm install
```

And for python dependencies:
```sh
pipenv install
```

Generate the sprite image and stylesheet:
```sh
pipenv run python sprite.py
```

### Development server

To run the development server run:
```sh
npm run start
```

This will serve the examples page to your browser and automatically reload on every change to either the example's files or the `src` files.

### Commiting the changes

Please follow the [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) specification, because [semantic-release](https://github.com/semantic-release/semantic-release) is used to automate the whole package release workflow including: determining the next version number, generating the release notes and publishing the package.

## License

[MIT](https://github.com/soufyakoub/mui-phone-textfield/blob/main/LICENSE)
