import * as React from 'react';
import {
	View, Text, StyleSheet, Pressable
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors, exStyles } from '@styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default SectionHeader = ({ length, text, ...props }) => (
	<View style={styles.sortItemContainer}>
		<Text style={[exStyles.infoLink14Med, { color: 'black' }]}>
			{length}
			{'  '}
			<Text style={[exStyles.infoLink14Med, { color: colors.secondaryText }]}>
				{text}
			</Text>
		</Text>
	</View>
);

const styles = StyleSheet.create({
	sortItemContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: 10,
		backgroundColor: '#ececec',
		paddingHorizontal: 20,
		paddingVertical: 4,
		borderRadius: 3
	},
	onPressSortStyle: { borderRadius: 20 }
});
