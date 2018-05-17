import React from 'react';
import { shallow } from 'enzyme';
import { ApolloProvider } from 'react-apollo';

// component
import TextNodesEditor from './TextNodesEditor';

import client from '../../../../middleware/apolloClient';


describe('TextNodesEditor', () => {
	it('renders correctly', () => {
		const wrapper = shallow(
			<ApolloProvider
				client={client}
    	>
				<TextNodesEditor
					textNodesUrn="urn:cts:greekLit:tlg0012.tlg001:1.1"
  			/>
			</ApolloProvider>
		);
		expect(wrapper).toBeDefined();
	});
});
