import React, { useState, MouseEvent } from 'react';
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

const menuData = getCountries().map(countryCode => ({ countryCode, callingCode: getCountryCallingCode(countryCode) }));

export interface CountriesMenuProps {
	currrentCountry: CountryCode,
	territoryDisplayNames?: Record<CountryCode, string>,
	onItemClick: (data: { countryCode: CountryCode, callingCode: CountryCallingCode }) => void
}

export default function CountriesMenu({ currrentCountry, territoryDisplayNames, onItemClick }: CountriesMenuProps) {
	const territories = { ...territoriesJson.main.en.localeDisplayNames.territories, ...territoryDisplayNames };
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
				<Flag countryCode={currrentCountry} className={classes.flag_border} />
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
						selected={menuData[index].countryCode === currrentCountry}
						button
						dense>
						<ListItemIcon>
							<Flag countryCode={menuData[index].countryCode} className={classes.flag_border} />
						</ListItemIcon>
						<ListItemText
							primary={territories[menuData[index].countryCode]}
							secondary={"+" + menuData[index].callingCode} />
					</ListItem>}

				</FixedSizeList>
			</Popover>
		</>
	);
}