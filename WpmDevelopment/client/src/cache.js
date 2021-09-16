import { InMemoryCache, makeVar } from '@apollo/client';

export const cache = new InMemoryCache({
	typePolicies: {
		Query: {
			fields: {
				gridSelections: {
					read() {
						return gridSelectionsVar();
					},
				},
				toggleComplete: {
					read() {
						return toggleCompleteVar();
					},
				},
			},
		},
	},
});

const GridSelectionsInitialValue = {
	selectedOrder: false,
	selectedLocation: false,
	selectedItem: false,
	selectedApplication: false,
};

export const gridSelectionsVar = makeVar(GridSelectionsInitialValue);

export const toggleCompleteVar = makeVar('all');
