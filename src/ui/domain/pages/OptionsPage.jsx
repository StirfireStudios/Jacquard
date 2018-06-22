import React from 'react';

import { withStyles } from '@material-ui/core/styles';

import themes from '../themes';

function OptionsPage(props) {
  return (
    <div>
      I am options
    </div>
  );  
}

export default withStyles(themes.defaultTheme)(OptionsPage);
