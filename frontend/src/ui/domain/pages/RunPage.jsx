import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';

import uuidv4 from 'uuid/v4';

import bondage from 'bondage';

import themes from '../themes';

class RunPage extends React.Component {
	constructor(props) {
		super(props);

		// Create a new bondage runner
		const bondageRunner = new bondage.Runner();

		// Set up the state of the component
		this.state = {
			// The bondage runner used to run the Yarn
			bondageRunner,
			// The bondage iterator used to iterate through the Yarn dialogue
			bondageIterator: null,
			// The results of iteration
			bondageIterationResults: [],
		};
	}

	componentWillMount() {
		// Run the yarn
		this.runYarn(this.props.yarnNodes);
	}

	componentWillReceiveProps(nextProps) {
		// Run the yarn
		this.runYarn(nextProps.yarnNodes);
	}

	onVariableChange = (event) => {
		// Get the variable key
		const variableKey = event.target.name;

		// Get the new variable value
		let variableValue = event.target.value;

		// Parse the value as JSON if possible
		if (variableValue.match(/^(true|false|[0-9.]+)$/)) {
			variableValue = JSON.parse(variableValue);
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
	};

	runYarn = (yarnNodes) => {
		// Do we have at least one node?
		if (yarnNodes.length > 0) {
			// Get the title of the starting node
			const startNodeTitle = yarnNodes[0].title;

			// Load the Yarn data into the bondage runner
			this.state.bondageRunner.load(yarnNodes);

			// Start running the Yarn
			const bondageIterator = this.state.bondageRunner.run(startNodeTitle);

			// Store the bondage iterator and clear the iteration results
			this.setState(
				{
					bondageIterator,
					bondageIterationResults: [],
				},
				// Move to the next step in the Yarn
				() => this.step(),
			);
		}
	};

	selectOption = (bondageIterationResult, bondageIterationResultOptionIndex) => {
		// Select the option
		bondageIterationResult.value.select(bondageIterationResultOptionIndex);

		// Move to the next step in the Yarn
		this.step();
	};

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
				value={variableValues[variableKey]}
				onChange={event => this.onVariableChange(event)}
			/>
		));

		return variableTextFields;
	};

	renderVisitedNodes = () => {
		// Get the keys of the visited nodes
		const visitedNodeKeys = Object.keys(this.state.bondageRunner.visited);

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

		return (
			<div>
				<h2>Yarn</h2>
				<div>
					{results}
				</div>
				<h2>Variables</h2>
				<div>
					{variables}
				</div>
				<h2>Visited</h2>
				<div>
					{visitedNodes}
				</div>
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
