import React, { useState, MouseEvent, memo, useRef, KeyboardEvent, useEffect } from 'react';
import Button from '@material-ui/core/Button';
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
	flag_button: {
		padding: 2,
	},
	flag_border: {
		borderRadius: 4,
	},
	menu_list: {
		// IOS momentum scrolling.
		WebkitOverflowScrolling: 'touch',
	}
}));

const defaultTerritoryDisplayNames = territoriesJson.main.en.localeDisplayNames.territories;
const menuData = getCountries()
	.map(countryCode => ({
		countryCode,
		callingCode: getCountryCallingCode(countryCode),
		countryName: defaultTerritoryDisplayNames[countryCode]
	}))
	.sort((a, b) => a.countryName.localeCompare(b.countryName));

export interface CountriesMenuProps {
	/** The selected country. */
	selectedCountry?: CountryCode,
	/** A map of names to be displayed in the menu for each country code. */
	countryDisplayNames?: Record<CountryCode, string>,
	/** Callback fired when an item from the menu is clicked. */
	onItemClick: (data: { countryCode: CountryCode, callingCode: CountryCallingCode }) => void
}

function CountriesMenu({ selectedCountry, countryDisplayNames, onItemClick }: CountriesMenuProps) {
	const ITEM_SIZE = 60;
	const MENU_WIDTH = 300;
	// specZ: The maximum height of a simple menu should be one or more rows less than the view
	// height. This ensures a tapable area outside of the simple menu with which to dismiss
	// the menu.
	const MENU_HEIGHT = window.innerHeight - ITEM_SIZE * 2;
	const classes = useStyles();
	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [itemsFocusable, setItemsFocusable] = useState(false);
	const fixedSizeListRef = useRef<FixedSizeList>(null);

	const handleClick = (event: MouseEvent<HTMLElement>) => {
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
				aria-controls="countries-menu"
				aria-haspopup="true"
				onClick={handleClick}
				className={classes.flag_button}>
				<Flag countryCode={selectedCountry} className={classes.flag_border} />
				<ArrowDropDownIcon />
			</Button>

			<Popover
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onEntered={handleEntered}
				onExited={handleExited}
				onClose={handleClose}
				onKeyDown={handleKeyDown}
				PaperProps={{
					id: "countries-menu",
				}}>

				<FixedSizeList
					itemData={{
						handleMenuItemClick,
						countryDisplayNames,
						currentIndex,
						itemsFocusable,
					}}
					ref={fixedSizeListRef}
					height={MENU_HEIGHT}
					width={MENU_WIDTH}
					itemSize={ITEM_SIZE}
					itemCount={menuData.length}>
					{FixedSizeListItem}
				</FixedSizeList>
			</Popover>
		</>
	);
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

	const should_be_focused = currentIndex === index;

	const ref = useRef<HTMLDivElement>(null);
	const classes = useStyles();

	useEffect(() => {
		if (should_be_focused && itemsFocusable) {
			ref.current?.focus();
		}
	}, [should_be_focused, itemsFocusable]);

	return <ListItem
		style={style}
		ref={ref}
		onClick={handleMenuItemClick}
		data-country-code={countryCode}
		data-calling-code={callingCode}
		button
		dense>
		<ListItemIcon>
			<Flag countryCode={countryCode} className={classes.flag_border} />
		</ListItemIcon>
		<ListItemText
			primary={countryDisplayNames?.[countryCode] || countryName}
			secondary={"+" + callingCode} />
	</ListItem>;
}

export default memo(CountriesMenu);
