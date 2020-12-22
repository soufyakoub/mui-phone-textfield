import React, { useState, MouseEvent, memo } from 'react';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Popover from "@material-ui/core/Popover";
import { makeStyles } from '@material-ui/core/styles';
import { CountryCallingCode, CountryCode, getCountries, getCountryCallingCode } from "libphonenumber-js";
import { FixedSizeList } from "react-window";
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
	const ITEM_SIZE = 45;
	const MENU_WIDTH = 300;
	// specZ: The maximum height of a simple menu should be one or more rows less than the view
	// height. This ensures a tapable area outside of the simple menu with which to dismiss
	// the menu.
	const MENU_HEIGHT = window.innerHeight - ITEM_SIZE * 2;
	const classes = useStyles();
	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

	const handleClick = (event: MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleMenuItemClick = (event: MouseEvent<HTMLElement>) => {
		const dataset = event.currentTarget.dataset;
		const countryCode = dataset.countryCode as CountryCode;
		const callingCode = dataset.callingCode as CountryCallingCode;
		handleClose();

		onItemClick({ countryCode, callingCode });
	};

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
				keepMounted
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={handleClose}
				PaperProps={{
					id: "countries-menu",
				}}>

				<FixedSizeList
					height={MENU_HEIGHT}
					width={MENU_WIDTH}
					itemSize={ITEM_SIZE}
					itemCount={menuData.length}>

					{({ index, style }) => <ListItem
						style={{
							...style,
							paddingTop: 0,
							paddingBottom: 0,
						}}
						onClick={handleMenuItemClick}
						data-country-code={menuData[index].countryCode}
						data-calling-code={menuData[index].callingCode}
						selected={menuData[index].countryCode === selectedCountry}
						button
						dense>
						<ListItemIcon>
							<Flag countryCode={menuData[index].countryCode} className={classes.flag_border} />
						</ListItemIcon>
						<ListItemText
							primary={countryDisplayNames?.[menuData[index].countryCode] || menuData[index].countryName}
							secondary={"+" + menuData[index].callingCode} />
					</ListItem>}

				</FixedSizeList>
			</Popover>
		</>
	);
}

export default memo(CountriesMenu);
