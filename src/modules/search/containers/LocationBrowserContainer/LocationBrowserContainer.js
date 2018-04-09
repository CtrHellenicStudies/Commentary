import React from 'react';
import { compose } from 'react-apollo';

import LocationBrowser from '../../components/LocationBrowser';
import refsDeclsQuery from '../../graphql/queries/refsDecls';


const LocationBrowserContainer = props => {

  let location = [];
  let refsDecls = [];

  if (
      props.refsDeclsQuery
    && props.refsDeclsQuery.works
    && props.refsDeclsQuery.works.length
  ) {
    props.refsDeclsQuery.works.forEach(work => {
      if (
          work.refsDecls
        && work.refsDecls.length
      ) {
        refsDecls = work.refsDecls;
      }
    });
  }

  return (
    <LocationBrowser
      location={[1, 1]}
      refsDecls={refsDecls}
    />
  );
};

export default compose(
  refsDeclsQuery,
)(LocationBrowserContainer);