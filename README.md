[![npm](https://img.shields.io/npm/dt/mui-phone-textfield)](https://www.npmjs.com/package/mui-phone-textfield)
[![npm](https://img.shields.io/npm/v/mui-phone-textfield)](https://www.npmjs.com/package/mui-phone-textfield)
[![Build Status](https://travis-ci.com/soufyakoub/mui-phone-textfield.svg?branch=main)](https://travis-ci.com/soufyakoub/mui-phone-textfield)
[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/soufyakoub/mui-phone-textfield/blob/main/LICENSE)

# mui-phone-textfield
> A phone number input for Material-UI.

![different variants of the same component](https://media.giphy.com/media/QM9ikg4lwuClWrCIZJ/giphy.gif)

[Live demo](https://soufyakoub.github.io/mui-phone-textfield/)

## Installation

via [npm](https://npmjs.org/)

```sh
npm install libphonenumber-js --save
```

via [yarn](https://yarnpkg.com)

```sh
yarn add libphonenumber-js
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

	const onChange = (event) => {
		setValue(event.currentTarget.formattedValue);
		setPhoneNumber(event.phoneNumber);
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
		onChange={onChange} />;
}
```

## API

In addtion to [TextField](https://material-ui.com/api/text-field/#props)'s props, The component accepts the following:

| prop | type | description|
|-|-|-|
| country | string | The selected country. [A two-letter ISO country code](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Officially_assigned_code_elements). |
| onCountrySelect | function | Callback fired when a user selects a country from the menu. |
| countryDisplayNames | object | An object that maps an ISO country code to a country name. can be used for localisation.
**Note**: please provide the same reference to the object when rerendering your component, or else the countries menu will rerender on each input change, which is bad for performance. |

**Note**: some props are forced:
- `select`: forced to be `false`.
- `type`: forced to be `"tel"`.
- The `startAdornment` key of `InputProps` is reserved for the countries menu, but all the others are left untouched.

## Event listeners

The `onChange` and `onCountrySelect` are the most important part of this component:

- `onChange`: callback fired when the input value changes. It receives a react synthetic event with two additional properties:
	- `currentTarget.formattedValue`: the formatted input value for the selected country.
	- `phoneNumber`: an instance of the [PhoneNumber](https://github.com/catamphetamine/libphonenumber-js/blob/master/README.md#phonenumber) class, or `undefined` if no valid phone number for the selected country could be parsed from the input's value.

- `onCountrySelect`: callback fired when a country is selected from the menu. It receives an object with the following properties:
	- `country`: the selected country. [A two-letter ISO country code](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Officially_assigned_code_elements).
	- `formattedValue`: the formatted input value for the selected country.
	- `phoneNumber`: an instance of the [PhoneNumber](https://github.com/catamphetamine/libphonenumber-js/blob/master/README.md#phonenumber) class, or `undefined` if no valid phone number for the selected country could be parsed from the input's value.

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

and for python dependencies:
```sh
pipenv install
```

generate the sprite image and stylesheet:
```sh
pipenv run python sprite.py
```

### Development server

To run the development server run:
```sh
npm run start
```

this will serve the examples page to your browser and automatically reload on every change to either the example's files or the `src` files.

### Commiting the changes

Please follow the [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) specification, because [semantic-release](https://github.com/semantic-release/semantic-release) is used to automate the whole package release workflow including: determining the next version number, generating the release notes and publishing the package.

## License

[MIT](https://github.com/soufyakoub/mui-phone-textfield/blob/main/LICENSE)
