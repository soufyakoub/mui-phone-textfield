# [3.1.0](https://github.com/soufyakoub/mui-phone-textfield/compare/v3.0.0...v3.1.0) (2021-02-15)


### Bug Fixes

* **typescript:** make properties of countryDisplayNames optional ([9d426ce](https://github.com/soufyakoub/mui-phone-textfield/commit/9d426ced53103ef21a2d97d0b0f1051c9665251d))


### Features

* **proptypes:** accept only string values in countryDisplayNames ([1dae4d6](https://github.com/soufyakoub/mui-phone-textfield/commit/1dae4d63db799d0d6e6015eba0139d6a36d59f23))

# [3.0.0](https://github.com/soufyakoub/mui-phone-textfield/compare/v2.2.0...v3.0.0) (2021-02-05)


### Features

* **sprite:** images are external to the js bundle ([8aec39b](https://github.com/soufyakoub/mui-phone-textfield/commit/8aec39b3a8bccbfe62df2e9261e739a3faafdaff))
* **sprite:** two versions are available, for normal and retina displays ([438872b](https://github.com/soufyakoub/mui-phone-textfield/commit/438872ba0d22781f173dee5864077aaf0e9d441d))


### BREAKING CHANGES

* **sprite:** the user is now responsible for processing any
import/require to the sprite image using a bundler like webpack

# [2.2.0](https://github.com/soufyakoub/mui-phone-textfield/compare/v2.1.0...v2.2.0) (2021-01-29)


### Features

* **menubutton:** removed dropdown arrow from the menu button ([f55f474](https://github.com/soufyakoub/mui-phone-textfield/commit/f55f47462e31e4bd771c48f22b0ed162c2b430dc))
* **menubutton:** the flag is now nested in an IconButton instead of a normal button ([7293431](https://github.com/soufyakoub/mui-phone-textfield/commit/72934311e0a392a01c7279a014fb48f910ffa345))

# [2.1.0](https://github.com/soufyakoub/mui-phone-textfield/compare/v2.0.0...v2.1.0) (2021-01-02)


### Bug Fixes

* added missing TextField's value prop ([e45db21](https://github.com/soufyakoub/mui-phone-textfield/commit/e45db2173860cd1d756d9f9dd9629ae13014606e))


### Features

* **menu:** added support for basic keyboard navigation ([2eddd72](https://github.com/soufyakoub/mui-phone-textfield/commit/2eddd72d39ad20aa5802bce43a7e58da8b685f4d))
* **menu:** improved accessibility ([a72d040](https://github.com/soufyakoub/mui-phone-textfield/commit/a72d0402995d6f3d32b54fe2eab0f7ccdcc3a977))
* **menu:** items are less dense ([18e47fa](https://github.com/soufyakoub/mui-phone-textfield/commit/18e47fac6e7fe2f1486f9a3d901a8d27ee91ec80))

# [2.0.0](https://github.com/soufyakoub/mui-phone-textfield/compare/v1.0.1...v2.0.0) (2020-12-23)


### Features

* `onChange` now receives a data object instead of the change event ([3cc83d6](https://github.com/soufyakoub/mui-phone-textfield/commit/3cc83d6221fcf176023060b604453fec829069ca))


### BREAKING CHANGES

* The object passed to `onChange` has the following
properties:
  - `formattedValue`: The formatted value for the selected country. Extracted from the input value.
  - `phoneNumber`: An instance of the
[PhoneNumber](https://github.com/catamphetamine/libphonenumber-js/blob/master/README.md#phonenumber)
class, or `undefined` if no valid phone number could be parsed from the input value.
  - `event`: The original event that triggered the `onChange` handler.

## [1.0.1](https://github.com/soufyakoub/mui-phone-textfield/compare/v1.0.0...v1.0.1) (2020-12-23)


### Bug Fixes

* added missing flags ([6058858](https://github.com/soufyakoub/mui-phone-textfield/commit/605885868b298a8ccc6c1a16224b1ec17f8cdc30))

# 1.0.0 (2020-12-22)


### Features

* **props:** `value`, `error` and `country` can now be passed to the component ([3081b42](https://github.com/soufyakoub/mui-phone-textfield/commit/3081b425dd7cb8d8f0fb1710196c68a699eb09a7))
* **props:** country is now optional ([28ba593](https://github.com/soufyakoub/mui-phone-textfield/commit/28ba593b281e887195a066903fe30df3abbea4b1))


### BREAKING CHANGES

* **props:** the user is now responsible for controlling the input.

  - `onChange` receives the original input change event but with the additional properties
`currentTarget.formattedValue`, and `phoneNumber` if a valid phone number
is extracted from the input's value.

  - `onCountrySelect` receives a data object with the properties:
    - `country`: the selected country.
    - `formattedValue`: the formatted value for the selected country.
    - `phoneNumber`: a PhoneNumber instance if a valid phone number was
extracted from the input's value.
