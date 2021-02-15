[![npm](https://img.shields.io/npm/dt/mui-phone-textfield)](https://www.npmjs.com/package/mui-phone-textfield)
[![npm](https://img.shields.io/npm/v/mui-phone-textfield)](https://www.npmjs.com/package/mui-phone-textfield)
[![Build Status](https://travis-ci.com/soufyakoub/mui-phone-textfield.svg?branch=main)](https://travis-ci.com/soufyakoub/mui-phone-textfield)
[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)][18]

# mui-phone-textfield
> A phone number input for Material-UI.

![different variants of the same component][1]

[Live demo][2]

## Installation

First, make sure you can handle **image** import/require in your bundler of choice.
For example, here's how to do it in [webpack][19].

Then to install this package:

Via [npm][3]

```sh
npm install mui-phone-textfield
```

Via [yarn][4]

```sh
yarn add mui-phone-textfield
```

## Usage
The component can be used the same way as the [TextField][5] component from [Material-UI][6] with some [additional props][7]:

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

In addtion to [TextField's props][8] (except `onChange`, `select` and `type`), The component accepts the following:

| prop | type | description|
|-|-|-|
| country | string | The selected country. A [two-letter ISO country code][9]. |
| [onCountrySelect][10] | function | Callback fired when a user selects a country from the menu. |
| [onChange][11] | function | Callback fired when the input value changes. |
| countryDisplayNames | object | An object that maps a [two-letter ISO country code][9] to a country name. can be used for localisation. |

**Note**: The `startAdornment` key of `InputProps` is reserved for the menu of countries, but all the other keys are left untouched.

## Event listeners

### onCountrySelect

Callback fired when a user selects a country from the menu. It receives an object with these properties:

- `formattedValue` {string | undefined}: The formatted value for the selected country. Extracted from the `value` prop.
- `phoneNumber` {object | undefined}: An instance of the [PhoneNumber][12] class, or `undefined` if no valid phone number could be parsed from the `value` prop.
- `country` {string}: The selected country. A [two-letter ISO country code][9].

### onChange

Callback fired when the input value changes. It receives an object with these properties:

- `formattedValue` {string}: The formatted value for the selected country. Extracted from the input value.
- `phoneNumber` {object | undefined}: An instance of the [PhoneNumber][12] class, or `undefined` if no valid phone number could be parsed from the input value.
- `event` {object}: The original event that triggered the `onChange` handler.

## Contributing

### Prerequisites
- [nodejs][13]
- [python 3.8][14]
- [pipenv][15]

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

Please follow the [conventional commits][16] specification, because [semantic-release][17] is used to automate the whole package release workflow including: determining the next version number, generating the release notes and publishing the package.

## License

[MIT][18]

[1]: https://media.giphy.com/media/H4YmD0FNarlbRywdpy/giphy.gif
[2]: https://soufyakoub.github.io/mui-phone-textfield/
[3]: https://npmjs.org/
[4]: https://yarnpkg.com
[5]: https://material-ui.com/components/text-fields/
[6]: https://material-ui.com/
[7]: #api
[8]: https://material-ui.com/api/text-field/#props
[9]: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Officially_assigned_code_elements
[10]: #oncountryselect
[11]: #onchange
[12]: https://github.com/catamphetamine/libphonenumber-js/blob/master/README.md#phonenumber
[13]: https://nodejs.org
[14]: https://www.python.org/downloads/release/python-380/
[15]: https://pypi.org/project/pipenv/
[16]: https://www.conventionalcommits.org/en/v1.0.0/
[17]: https://github.com/semantic-release/semantic-release
[18]: LICENSE
[19]: https://webpack.js.org/guides/asset-management/#loading-images
