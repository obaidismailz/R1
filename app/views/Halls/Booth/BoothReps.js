import * as React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import ItemBoothRep from './components/ItemBoothRep';

export default BoothReps = ({ boothRep, navigation, ...props }) => {
	const BoothRepSeparator = () => (
		<View
			style={{
				marginBottom: 14
			}}
		/>
	);
	return boothRep.length > 0 ? (
		<FlatList
			data={boothRep}
			ListHeaderComponent={<View style={styles.separatorTop} />}
			ListFooterComponent={<View style={styles.separatorBottom} />}
			ItemSeparatorComponent={BoothRepSeparator}
			renderItem={({ item, index }) => (
				<ItemBoothRep
					data={item}
					onPress={() => navigation.navigate('LoopUserProfile', {
						username: item.user.username
					})
					}
				/>
			)}
		/>
	) : null;
};

const styles = StyleSheet.create({
	separatorTop: {
		borderWidth: 0.5,
		borderColor: '#000000',
		opacity: 0.2,
		marginHorizontal: 32,
		marginTop: 16,
		marginBottom: 32
	},
	separatorBottom: {
		borderWidth: 0.5,
		borderColor: '#000000',
		opacity: 0.2,
		marginHorizontal: 32,
		marginTop: 24,
		marginBottom: 40
	}
});
