import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core//styles';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

import uuidv4 from 'uuid/v4';

import bondage from 'bondage';

import themes from '../themes';

class RunPage extends React.Component {
	constructor(props) {
		super(props);

		// Create a new bondage runner
		const bondageRunner = new bondage.Runner();

		// Get the default start node title
		const startNodeTitle = (props.yarnNodes.length > 0)
			? props.yarnNodes[0].title
			: '';

		// Set up the state of the component
		this.state = {
			// The bondage runner used to run the Yarn
			bondageRunner,
			// The bondage iterator used to iterate through the Yarn dialogue
			bondageIterator: null,
			// The results of iteration
			bondageIterationResults: [],
			// The exception error thrown by bondage (if any)
			bondageExceptionError: '',
			// The start node
			startNodeTitle,
		};
	}

	onRunButtonClick() {
		// Run the yarn
		this.runYarn(this.props.yarnNodes);
	}

	onStartNodeChoiceChange = (event) => {
		// Get the start node
		const startNodeTitle = event.target.value;

		// Record the start node in our state
		this.setState({
			startNodeTitle,
		});
	}

	onVariableChange = (event) => {
		// Get the variable key
		const variableKey = event.target.name;

		// Get the new variable value
		let variableValue = event.target.value;

		// Parse the value as JSON if possible
		if (variableValue.match(/^(true|false|[0-9.]+)$/)) {
			try {
				variableValue = JSON.parse(variableValue);
			} catch (error) {
				console.log(error);
			}
		}

		// Update the variable in a copy of the bondage runner
		const bondageRunner = { ...this.state.bondageRunner };
		bondageRunner.variables.data[variableKey] = variableValue;

		// Store the updated bondage runner
		this.setState({ bondageRunner });
	}

	step = () => {
		// The iteration results
		const bondageIterationResults = [...this.state.bondageIterationResults];

		// Step through the Yarn
		try {
			let bondageIterationResult = this.state.bondageIterator.next();

			// Keep going until we've finished iteration
			while (!bondageIterationResult.done) {
				// Add the iteration result to our iteration results
				bondageIterationResults.push(bondageIterationResult);

				// Get the iteration result value
				const bondageIterationResultValue = bondageIterationResult.value;

				// Should we be showing options?
				if (bondageIterationResultValue instanceof bondage.OptionsResult) {
					// Stop iterating
					break;
				}

				// Step through the Yarn
				bondageIterationResult = this.state.bondageIterator.next();
			}

			// Store the updated iteration results
			this.setState({
				bondageIterationResults,
			});
		} catch (error) {
			// Set the error
			this.setState({ bondageExceptionError: error });
		}
	};

	runYarn = (yarnNodes) => {
		// Do we have at least one node?
		if (yarnNodes.length > 0) {
			// Get the title of the starting node if we have one, otherwise
			// use the title of the first node
			const startNodeTitle = (this.state.startNodeTitle)
				? this.state.startNodeTitle
				: yarnNodes[0].title;

			// Load the Yarn data into the bondage runner
			try {
				this.state.bondageRunner.load(yarnNodes);

				// Start running the Yarn
				const bondageIterator = this.state.bondageRunner.run(startNodeTitle);

				// Store the bondage iterator and clear the iteration results
				this.setState(
					{
						bondageIterator,
						bondageIterationResults: [],
						bondageExceptionError: '',
					},
					// Move to the next step in the Yarn
					() => this.step(),
				);
			} catch (error) {
				// Set the error
				this.setState({ bondageExceptionError: error });
			}
		}
	};

	selectOption = (bondageIterationResult, bondageIterationResultOptionIndex) => {
		// Select the option
		bondageIterationResult.value.select(bondageIterationResultOptionIndex);

		// Move to the next step in the Yarn
		this.step();
	};

	renderStartNodeRunner = () => {
		// Build the start node choices
		const startNodeChoices = this.props.yarnNodes.map(yarnNode => (
			<MenuItem
				key={uuidv4()}
				value={yarnNode.title}
			>
				{yarnNode.title}
			</MenuItem>
		));

		return (
			<Grid container spacing={24}>
				<Grid item xs={6}>
					<InputLabel htmlFor="start-node-choices">Start Node</InputLabel>
					<Select
						value={this.state.startNodeTitle}
						onChange={this.onStartNodeChoiceChange}
						fullWidth
						inputProps={{
							name: 'start-node',
							id: 'start-node-choices',
						}}
					>
						{startNodeChoices}
					</Select>
				</Grid>
				<Grid item xs={3}>
					<Button
						variant="raised"
						size="large"
						fullWidth
						onClick={() => this.onRunButtonClick()}
					>
						Run From Node
					</Button>
				</Grid>
			</Grid>
		);
	}

	renderVariables = () => {
		// Get the variable values
		const variableValues = this.state.bondageRunner.variables.data;

		// Get the keys of the variable data
		const variableKeys = Object.keys(variableValues);

		// Generate the variable text fields
		const variableTextFields = variableKeys.map(variableKey => (
			<TextField
				key={variableKey}
				name={variableKey}
				label={variableKey}
				fullWidth
				readOnly={false}
				multiline={false}
				value={String(variableValues[variableKey])}
				onChange={event => this.onVariableChange(event)}
			/>
		));

		return variableTextFields;
	};

	renderVisitedNodes = () => {
		// Get the keys of the visited nodes
		const visitedNodeKeys = Object.keys(this.state.bondageRunner.visited);

		// Render each visited node
		const visitedNodeTextFields = visitedNodeKeys.map(visitedNodeKey => (
			<p key={visitedNodeKey}>
				{visitedNodeKey}
			</p>
		));

		return visitedNodeTextFields;
	};

	renderOptions = (bondageIterationResult) => {
		// Get the iteration result options
		const bondageIterationResultOptions = bondageIterationResult.value.options;


		// Render each of the options
		const options = bondageIterationResultOptions.map((option, bondageIterationResultOptionIndex) => (
			<Button
				key={uuidv4()}
				variant="raised"
				onClick={() => this.selectOption(bondageIterationResult, bondageIterationResultOptionIndex)}
			>
				{option}
			</Button>
		));

		return options;
	};

	render() {
		// The start node runner
		const startNodeRunner = this.renderStartNodeRunner();

		// Render the variables
		const variables = this.renderVariables();

		// Render the visited nodex
		const visitedNodes = this.renderVisitedNodes();

		// Render each of the bondage iteration results
		const results = this.state.bondageIterationResults.map((bondageIterationResult) => {
			// Get the iteration result value
			const bondageIterationResultValue = bondageIterationResult.value;

			// Should we be showing options?
			if (bondageIterationResultValue instanceof bondage.OptionsResult) {
				return this.renderOptions(bondageIterationResult);
			}

			// Otherwise display the result
			return (
				<p key={uuidv4()}>
					{bondageIterationResultValue.text}
				</p>
			);
		});

		// Build the yarn state
		const yarnState = (this.state.bondageExceptionError)
			? (
				<p>{`${this.state.bondageExceptionError}`}</p>
			)
			: (
				<div>
					{(results.length > 0) &&
						<div>
							<h2>Yarn</h2>
							{results}
						</div>
					}
					{(variables.length > 0) &&
						<div>
							<h2>Variables</h2>
							{variables}
						</div>
					}
					{(visitedNodes.length > 0) &&
						<div>
							<h2>Visited</h2>
							{visitedNodes}
						</div>
					}
				</div>
			);

		return (
			<div>
				{startNodeRunner}
				{yarnState}
			</div>
		);
	}
}

RunPage.propTypes = {
	yarnNodes: PropTypes.arrayOf(PropTypes.object),
};

RunPage.defaultProps = {
	yarnNodes: null,
};

export default withStyles(themes.defaultTheme)(RunPage);
