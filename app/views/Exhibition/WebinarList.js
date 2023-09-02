import * as React from 'react';
import { View, FlatList, Dimensions } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import ItemWebinarLobby from './components/ItemWebinarLobby';

const WebinarList = ({ ...props }) => (
	<View>
		<FlatList
			horizontal
			contentContainerStyle={{ marginTop: RFValue(24) }}
			showsHorizontalScrollIndicator={false}
			data={props.webinars}
			renderItem={({ item, idex }) => <ItemWebinarLobby item={item} />}
		/>
	</View>
);

export default WebinarList;
