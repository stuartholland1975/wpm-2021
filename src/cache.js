/** @format */

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
				mutationApi: {
					read() {
						return mutationApiVar();
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
	selectedDocument: false,
	selectedPeriod: false,
};

const mutationApiInitialValue = {
	data: false,
};

export const gridSelectionsVar = makeVar(GridSelectionsInitialValue);

export const toggleCompleteVar = makeVar('all');

export const mutationApiVar = makeVar(mutationApiInitialValue);
