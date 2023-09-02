import React, { memo, useState, useEffect } from 'react';
import {
	SafeAreaView,
	StyleSheet,
	Dimensions,
	ScrollView,
	View
} from 'react-native';
import FastImage from '@rocket.chat/react-native-fast-image';
import { getLobbyImage } from '../../../apis/LoopExpoApi';
import { ActivityIndicator, Header } from '../../../components';
import { colors } from '../../../styles';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;

const ScavangerHunt = ({ navigation, ...props }) => {
	const [lobby, setLobby] = useState('');
	const [loading, setloading] = useState(true);

	useEffect(() => {
		getLobby();
	}, []);

	const getLobby = () => {
		getLobbyImage().then((response) => {
			setLobby(response.records.lobby_template.mobile_image);
			setloading(false);
		});
	};

	return (
		<>
			<SafeAreaView style={{ backgroundColor: colors.secondaryColor }} />
			<Header
				title='Scavanger Hunt'
				theme='light'
				onBackPress={() => {
					navigation.goBack();
				}}
			/>
			<View style={{ flex: 1, backgroundColor: colors.white }}>
				<ScrollView showsHorizontalScrollIndicator={false} horizontal>
					<View style={{ height: screenHeight, width: 2080 }}>
						<FastImage
							source={{ uri: lobby }}
							style={{ height: screenHeight }}
						/>
					</View>
				</ScrollView>
			</View>
			{loading ? (
				<ActivityIndicator style={styles.activityIndicator} color='#000000AA' />
			) : null}
		</>
	);
};

const styles = StyleSheet.create({
	slideContainer: {
		height: 100
	},
	activityIndicator: {
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 0,
		top: 0
	}
});

export default memo(ScavangerHunt);
