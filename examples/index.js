import React from "react";
import ReactDOM from "react-dom";
import Grid from "@material-ui/core/Grid";
import PhoneInput from "..";

const input_props = [
	{ size: "medium", variant: "outlined" },
	{ size: "medium", variant: "filled" },
	{ size: "medium", variant: "standard" },
	{ size: "small", variant: "outlined" },
	{ size: "small", variant: "filled" },
	{ size: "small", variant: "standard" }
];

ReactDOM.render(
	<React.StrictMode>
		<Grid container spacing={2}>
			{input_props.map(props => <Grid item key={props.size + props.variant} >
				<PhoneInput {...props} label="Phone number" />
			</Grid>)}
		</Grid>
	</React.StrictMode>,
	document.getElementById('root')
);
