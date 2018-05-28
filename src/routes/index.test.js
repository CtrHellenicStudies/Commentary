import React from 'react';
import { shallow } from 'enzyme';
import { ApolloProvider } from 'react-apollo';

// component
import Routes from './index';
import client from '../middleware/apolloClient';
import configureStore from '../store/configureStore';


describe('Routes', () => {
	it('renders correctly', () => {

		// configure store
		const store = configureStore();

		const wrapper = shallow(
			<ApolloProvider
				client={client}
				store={store}
    	>
				<Routes
      	/>
			</ApolloProvider>
		);
		expect(wrapper).toBeDefined();
	});
});
