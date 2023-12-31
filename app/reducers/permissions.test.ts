import { setPermissions, updatePermission } from '../actions/permissions';
import { mockedStore } from './mockedStore';
import { initialState } from './permissions';

describe('test permissions reducer', () => {
	it('should return initial state', () => {
		const state = mockedStore.getState().permissions;
		expect(state).toEqual(initialState);
	});

	it('should return modified store after setPermissions', () => {
		const permissions = { hasEditPermission: 'enabled', hasForceDeletePermission: 'enabled' };
		mockedStore.dispatch(setPermissions(permissions));
		const state = mockedStore.getState().permissions;
		expect(state).toEqual(permissions);
	});

	it('should return empty store after remove user', () => {
		mockedStore.dispatch(updatePermission('hasEditPermission', 'disabled'));
		const state = mockedStore.getState().permissions;
		expect(state.hasEditPermission).toEqual('disabled');
	});
});
