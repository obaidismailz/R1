import * as React from 'react';
import { memo, useEffect, useState } from 'react';
import {
	View,
	StyleSheet,
	Dimensions,
	FlatList,
	Pressable,
	Text
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors, exStyles } from '@styles';
import { ActivityIndicator } from '@components';
import { withTheme } from '../../theme';
import { withDimensions } from '../../dimensions';
import { themes } from '../../constants/colors';
import ItemAttendees from './components/ItemAttendees';
import {
	bookMarkedAttendees,
	fetchAttendees
} from '../../actions/social/attendees';
import Suggestions from './Suggestions';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;
const Attendees = ({
	navigation, isMasterDetail, route, ...props
}) => {
	const { theme } = props;
	const dispatch = useDispatch();
	const state = useSelector(state => state.attendees);
	const [option, setOption] = useState(0);

	useEffect(() => {
		if (state.attendees.length == 0) {
			dispatch(fetchAttendees());
		}
	}, []);

	const separator = () => (
		<View
			style={{
				height: 1,
				backgroundColor: '#000000',
				opacity: 0.2,
				marginLeft: 24
			}}
		/>
	);

	const FilterOptions = () => (
		<View style={styles.categoriesTypeContainer}>
			<Pressable
				onPress={() => setOption(0)}
				style={[
					styles.tab,
					{
						backgroundColor: option === 0 ? colors.primaryColor : '#F2F2F2'
					}
				]}
			>
				<Text
					style={[
						exStyles.infoDetailR16,
						{
							color: option === 0 ? 'white' : 'grey'
						}
					]}
				>
					All
				</Text>
			</Pressable>
			<Pressable
				onPress={() => setOption(1)}
				style={[
					styles.tab,
					{
						backgroundColor: option === 1 ? colors.primaryColor : '#F2F2F2'
					}
				]}
			>
				<Text
					style={[
						exStyles.infoDetailR16,
						{
							color: option === 1 ? 'white' : 'grey'
						}
					]}
				>
					Recommended
				</Text>
			</Pressable>
		</View>
	);

	return (
		<View style={{ flex: 1 }}>
			<FilterOptions />
			{option == 0 ? (
				<FlatList
					contentContainerStyle={{ paddingBottom: 32 }}
					data={state.attendees}
					renderItem={({ item }) => (
						<ItemAttendees
							data={item}
							isMasterDetail={isMasterDetail}
							onPress={() => navigation.navigate('LoopUserProfile', {
								username: item.username
							})
							}
						/>
					)}
					ListEmptyComponent={
						state.loading ? <ActivityIndicator theme={theme} /> : null
					}
					ItemSeparatorComponent={separator}
				/>
			) : option == 1 ? (
				<Suggestions
					navigation={navigation}
					isMasterDetail={isMasterDetail}
					route={route}
					{...props}
				/>
			) : (
				<FlatList
					contentContainerStyle={{ paddingBottom: 32 }}
					data={state.bookmarked}
					renderItem={({ item }) => (
						<ItemAttendees
							data={item}
							isMasterDetail={isMasterDetail}
							onPress={() => navigation.navigate('LoopUserProfile', {
								username: item.username
							})
							}
						/>
					)}
					ItemSeparatorComponent={separator}
				/>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	categoriesTypeContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginVertical: RFValue(16)
	},

	tab: {
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 4,
		marginRight: 16,
		borderRadius: 10,
		paddingHorizontal: 12
	}
});

// home tab whole, auditorim

// export default memo(Lobby);
export default withDimensions(withTheme(memo(Attendees)));
