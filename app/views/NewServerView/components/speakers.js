import React from 'react';
import {
	View, StyleSheet, Text, FlatList
} from 'react-native';
import { exStyles, colors } from '../../../styles';
import Itemauditoriumstaff from './ItemAuditoriumStaff';

const Speakers = props => (props.data.length > 0 ? (
	<FlatList
		ListHeaderComponent={(
			<View style={styles.txtHeading}>
				<Text style={[exStyles.infoLargeM16, { color: colors.darkText }]}>
					Speakers
				</Text>
			</View>
		)}
		data={props.data}
		renderItem={({ item }) => (item.status == 1 ? (
			<Itemauditoriumstaff
				data={item}
				onPress={() => {
					alert('Please Sign in to view profile');
				}}
			/>
		) : null)
		}
	/>
) : null);

const styles = StyleSheet.create({
	txtHeading: {
		marginTop: 24,
		paddingStart: 32,
		backgroundColor: colors.unSelected,
		paddingVertical: 4
	}
});

export default Speakers;
