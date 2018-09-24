import React from 'react';
import { compose } from 'react-apollo';

// component
import TextNodes from '../../components/TextNodes';

// graphql
import textNodesQuery from '../../graphql/queries/textNodesQuery';


const TextNodesContainer = props => {
  let textNodes = [];

  return (
    <TextNodes
      textNodes={textNodes}
    />
  );
}

export default compose(
  textNodesQuery,
)(TextNodesContainer);
