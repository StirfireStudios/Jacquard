import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';

import themes from '../themes';

function mapStateToProps(state) {
  const Project = state.Project;  
  return {
    sections: Project.sections,
  }
}

function NodePage() {
  return (
    <div>
      I am the node page      
    </div>
  );
}

export default connect(mapStateToProps)(withStyles(themes.defaultTheme)(NodePage));
