import React, { ChangeEvent, useState, MouseEvent, useRef, KeyboardEvent, useEffect, forwardRef } from "react";
import PropTypes from "prop-types";
import TextField, { TextFieldProps } from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Popover from "@material-ui/core/Popover";
import { makeStyles } from "@material-ui/core/styles";
import grey from "@material-ui/core/colors/grey";
import { AsYouType, PhoneNumber, getCountries, getCountryCallingCode, CountryCode } from "libphonenumber-js";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import Flag from "./Flag";
import territoriesJson from "cldr-localenames-full/main/en/territories.json";

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
	countryDisplayNames?: Partial<Record<CountryCode, string>>,
	/** The currently selected country. */
	country?: CountryCode,
	/** Callback fired when a user selects a country from the menu. */
	onCountrySelect?: (data: OnCountrySelectData) => void,
	/** Callback fired when the input value changes. */
	onChange?: (data: OnChangeData) => void,
};

const useStyles = makeStyles(() => ({
	iconButtonSmall: {
		padding: 9,
	},
	flag: {
		borderRadius: 4,
		borderWidth: 1,
		borderStyle: "solid",
		borderColor: grey[300],
	},
}));

const defaultTerritoryDisplayNames = territoriesJson.main.en.localeDisplayNames.territories;
const countryCodes = getCountries();
const menuData = countryCodes
	.map(countryCode => ({
		countryCode,
		callingCode: getCountryCallingCode(countryCode),
		countryName: defaultTerritoryDisplayNames[countryCode],
	}))
	.sort((a, b) => a.countryName.localeCompare(b.countryName));

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

	const classes = useStyles();
	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [itemsFocusable, setItemsFocusable] = useState(false);
	const fixedSizeListRef = useRef<FixedSizeList>(null);
	const open = Boolean(anchorEl);
	const ITEM_SIZE = 60;
	const MENU_WIDTH = 300;
	// specZ: The maximum height of a simple menu should be one or more rows less than the view
	// height. This ensures a tapable area outside of the simple menu with which to dismiss
	// the menu.
	const MENU_HEIGHT = window.innerHeight - ITEM_SIZE * 2;

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

	const handleButtonClick = (event: MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleEntered = () => {
		setItemsFocusable(true);
	};

	const handleExited = () => {
		setCurrentIndex(0);
		setItemsFocusable(false);
	};

	const handleMenuItemClick = (event: MouseEvent<HTMLElement>) => {
		handleClose();

		if (!onCountrySelect) return;

		const dataset = event.currentTarget.dataset;
		const countryCode = dataset.countryCode as CountryCode;

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

	const focusItemByIndex = (index: number) => {
		setCurrentIndex(index);
		fixedSizeListRef.current?.scrollToItem(index, "auto");
	};

	const handleMenuKeyDown = (event: KeyboardEvent) => {
		event.preventDefault();

		switch (event.key) {

			case "Tab":
			case "Escape":
				handleClose();
				break;

			case "ArrowUp":
				let previous_index = currentIndex - 1;

				if (previous_index < 0) {
					previous_index = menuData.length - 1;
				}

				focusItemByIndex(previous_index);
				break;

			case "ArrowDown":
				let next_index = currentIndex + 1;

				if (next_index >= menuData.length) {
					next_index = 0;
				}

				focusItemByIndex(next_index);
				break;

			case "End":
				focusItemByIndex(menuData.length - 1);
				break;

			case "Home":
				focusItemByIndex(0);
				break;

			default: break;
		}
	}

	return <>

		<TextField
			{...rest}
			select={false}
			type="tel"
			onChange={onChange ? internalOnChange : undefined}
			InputProps={{
				...InputProps,
				startAdornment: <InputAdornment position="start">
					<IconButton
						size={rest.size}
						aria-haspopup="menu"
						aria-expanded={open}
						aria-controls="countries"
						onClick={handleButtonClick}
						classes={{
							sizeSmall: classes.iconButtonSmall,
						}}
					>
						<Flag countryCode={country} className={classes.flag} compensate />
					</IconButton>
				</InputAdornment>,
			}}
		/>

		<Popover
			anchorEl={anchorEl}
			onEntered={handleEntered}
			open={open}
			onExited={handleExited}
			onClose={handleClose}
			onKeyDown={handleMenuKeyDown}
		>
			<FixedSizeList
				itemData={{
					handleMenuItemClick,
					countryDisplayNames,
					currentIndex,
					itemsFocusable,
				}}
				ref={fixedSizeListRef}
				innerElementType={FixedSizeListInnerElement}
				height={MENU_HEIGHT}
				width={MENU_WIDTH}
				itemSize={ITEM_SIZE}
				itemCount={menuData.length}
			>
				{FixedSizeListItem}

			</FixedSizeList>
		</Popover>
	</>
}

function FixedSizeListItem({ index, style, data }: ListChildComponentProps) {
	const {
		handleMenuItemClick,
		countryDisplayNames,
		currentIndex,
		itemsFocusable,
	} = data;

	const {
		countryCode,
		countryName,
		callingCode,
	} = menuData[index];

	const countryDisplayName = countryDisplayNames?.[countryCode] || countryName;
	const should_be_focused = currentIndex === index;

	const ref = useRef<HTMLLIElement>(null);
	const classes = useStyles();

	useEffect(() => {
		if (should_be_focused && itemsFocusable) {
			ref.current?.focus();
		}
	}, [should_be_focused, itemsFocusable]);

	return <ListItem
		style={style}
		ref={ref}
		// Somehow the orca screen reader isn't working unless I use a roving tabindex.
		tabIndex={should_be_focused ? 0 : -1}
		component="li"
		role="menuitem"
		onClick={handleMenuItemClick}
		data-country-code={countryCode}
		data-calling-code={callingCode}
		button
		dense
	>
		<ListItemIcon>
			<Flag countryCode={countryCode} className={classes.flag} />
		</ListItemIcon>
		<ListItemText
			primaryTypographyProps={{
				"aria-label": `country name is ${countryDisplayName}`,
			}}
			secondaryTypographyProps={{
				"aria-label": `calling code is ${callingCode}`,
			}}
			primary={countryDisplayName}
			secondary={"+" + callingCode}
		/>
	</ListItem>;
}

const FixedSizeListInnerElement = forwardRef<HTMLOListElement, any>((props, ref) => {
	return <List
		{...props}
		component="ol"
		role="menu"
		aria-label="countries"
		ref={ref}
		disablePadding
	/>
});

// If a prop is used inside PhoneTextField instead of passing it directly to TextField,
// its corresponding propType should be specified.
PhoneTextField.propTypes = {
	countryDisplayNames: PropTypes.object,
	country: PropTypes.oneOf(countryCodes),
	onCountrySelect: PropTypes.func,
	onChange: PropTypes.func,
	InputProps: PropTypes.object,
};

export default PhoneTextField;
