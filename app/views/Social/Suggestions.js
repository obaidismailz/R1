import * as React from 'react';
import { memo, useEffect } from 'react';
import { View, Dimensions, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ShareData } from '@utils';
import { ActivityIndicator } from '@components';
import { withTheme } from '../../theme';
import { withDimensions } from '../../dimensions';
import { themes } from '../../constants/colors';
import ItemAttendees from './components/ItemAttendees';
import { fetchSuggestedAttendees } from '../../actions/social/attendees';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;

const Suggestions = ({
	navigation, isMasterDetail, route, ...props
}) => {
	const { theme } = props;
	const dispatch = useDispatch();
	const state = useSelector(state => state.attendees);

	useEffect(() => {
		if (state.suggestedAttendees.length == 0) {
			dispatch(fetchSuggestedAttendees(ShareData.getInstance().interest));
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

	return (
		<View style={{ flex: 1 }}>
			<FlatList
				contentContainerStyle={{ paddingBottom: 32 }}
				data={state.suggestedAttendees}
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
		</View>
	);
};

// export default memo(Lobby);
export default withDimensions(withTheme(memo(Suggestions)));
