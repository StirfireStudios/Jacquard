import React from 'react';

import { connect } from 'react-redux';

import Typography from 'material-ui/Typography';

import { withStyles } from 'material-ui/styles';

import Button from 'material-ui/Button';

import * as AsyncActions from '../../../../actionsAsync/preview/sourceData';

import themes from '../../themes';

function validateClicked() {
	AsyncActions.Validate(this.props.project);
}

function renderButton() {
	let name = (this.props.valid ? "Compiled!" : "Compile");
	return (
		<Button
			variant="raised"
			size="large"
			onClick={validateClicked.bind(this)}
			disabled={this.props.busy | this.props.valid}
		>
			{name}
	  </Button>
	);
}

function renderErrors() {
	if (!this.props.errorsExist) return null;
	const errors = [];
	for(let index = 0; index < this.props.errors.length; index++) {
		const error = this.props.errors[index];
		let message = "";
		if (typeof(error) === 'string') {
			message = error;
		} else {
			message = error.toString();
		}
		errors.push(
			<div key={index}>
				{message}
			</div>
		)
	}

	return <div>{errors}</div>;
}

class ValidationPanel extends React.Component {
	render() {
		if (this.props.valid && !this.props.errorsExist) return null;
		return (
			<div>
				{renderButton.call(this)} 
				{renderErrors.call(this)}
			</div>
		);
	}
}

function mapStateToProps(state) {
	const SourceData = state.Preview.SourceData;
	console.log("Errors exist:" + (SourceData.errors.length > 0));
	return {
		valid: SourceData.valid,
		busy: SourceData.compiling,
		errorsExist: SourceData.errors.length > 0,
		errors: SourceData.errors,
	}
}


export default withStyles(themes.defaultTheme)(connect(mapStateToProps)(ValidationPanel));
