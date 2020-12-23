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
