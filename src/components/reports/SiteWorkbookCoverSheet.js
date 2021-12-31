import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';


Font.register({ family: 'Roboto', src: 'https://github.com/google/fonts/raw/master/apache/roboto/static/Roboto-Regular.ttf' });

const styles = StyleSheet.create({
	page: {
		flexDirection: 'row',
		backgroundColor: '#E4E4E4'
	},
	section: {
		margin: 10,
		padding: 10,
		flexGrow: 1
	},
	title: {
		textAlign: 'center',
		fontWeight: 'bold',
		textDecoration: 'underline',
		fontSize: 25,
		//	fontFamily: 'Roboto'
	},
	footer: {
		textAlign: 'center'
	}
});



const SiteWorkbookCoverSheet = ({ data }) => {




	return (
		<Document>
			<Page size="A4" style={styles.page} orientation='landscape'>
				<View style={styles.section}>
					<Text style={styles.title}>{data.projectTitle}</Text>
					<View style={styles.section}>
						<Text >
							TEXT GOES HERE
						</Text>
					</View>
					<Text style={styles.footer} render={({ pageNumber, totalPages }) => (
						`${pageNumber} / ${totalPages}`
					)} fixed />
				</View>


			</Page>
		</Document>
	);
};

export default SiteWorkbookCoverSheet;