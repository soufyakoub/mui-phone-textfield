import React, { useState, MouseEvent, useRef, KeyboardEvent, useEffect, forwardRef } from 'react';
import Button from '@material-ui/core/Button';
import List from "@material-ui/core/List";
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Popover from "@material-ui/core/Popover";
import { makeStyles } from '@material-ui/core/styles';
import { CountryCallingCode, CountryCode, getCountries, getCountryCallingCode } from "libphonenumber-js";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import ArrowDropDownIcon from './ArrowDropDownIcon';
import Flag from "./Flag";
import territoriesJson from "cldr-localenames-full/main/en/territories.json";

const useStyles = makeStyles(() => ({
	button: {
		padding: 2,
	},
	flag: {
		borderRadius: 4,
	},
}));

const defaultTerritoryDisplayNames = territoriesJson.main.en.localeDisplayNames.territories;
const menuData = getCountries()
	.map(countryCode => ({
		countryCode,
		callingCode: getCountryCallingCode(countryCode),
		countryName: defaultTerritoryDisplayNames[countryCode],
	}))
	.sort((a, b) => a.countryName.localeCompare(b.countryName));

export interface CountriesMenuProps {
	/** The selected country. */
	selectedCountry?: CountryCode,
	/** A map of names to be displayed in the menu for each country code. */
	countryDisplayNames?: Record<CountryCode, string>,
	/** Callback fired when an item from the menu is clicked. */
	onItemClick: (data: { countryCode: CountryCode, callingCode: CountryCallingCode }) => void,
}

export default (props: CountriesMenuProps) => {
	const {
		selectedCountry,
		countryDisplayNames,
		onItemClick,
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
		const dataset = event.currentTarget.dataset;
		const countryCode = dataset.countryCode as CountryCode;
		const callingCode = dataset.callingCode as CountryCallingCode;
		handleClose();

		onItemClick({ countryCode, callingCode });
	};

	const focusItemByIndex = (index: number) => {
		setCurrentIndex(index);
		fixedSizeListRef.current?.scrollToItem(index, "auto");
	}

	const handleKeyDown = (event: KeyboardEvent) => {
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

	return (
		<>
			<Button
				aria-haspopup="menu"
				aria-expanded={open}
				aria-controls="countries"
				onClick={handleButtonClick}
				className={classes.button}
			>
				<Flag countryCode={selectedCountry} className={classes.flag} />
				<ArrowDropDownIcon />
			</Button>

			<Popover
				anchorEl={anchorEl}
				onEntered={handleEntered}
				open={open}
				onExited={handleExited}
				onClose={handleClose}
				onKeyDown={handleKeyDown}
			>
				<FixedSizeList
					itemData={{
						handleMenuItemClick,
						countryDisplayNames,
						currentIndex,
						itemsFocusable,
					}}
					ref={fixedSizeListRef}
					innerElementType={InnerElement}
					height={MENU_HEIGHT}
					width={MENU_WIDTH}
					itemSize={ITEM_SIZE}
					itemCount={menuData.length}
				>
					{FixedSizeListItem}

				</FixedSizeList>
			</Popover>
		</>
	);
};

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

const InnerElement = forwardRef<HTMLOListElement, any>((props, ref) => {
	return <List
		{...props}
		component="ol"
		role="menu"
		aria-label="countries"
		ref={ref}
		disablePadding
	/>
});
