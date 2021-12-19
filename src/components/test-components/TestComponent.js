/** @format */

import React from 'react';
import SiteWorksheets from '../reports/SiteWorksheets';
import { PDFViewer } from '@react-pdf/renderer';

const TestComponent = () => {

	return (
		<>
			<h1>
				TEST
			</h1>
			<PDFViewer height={1000} width={1000}>
				<SiteWorksheets />
			</PDFViewer>
		</>
	);
};

export default TestComponent;
