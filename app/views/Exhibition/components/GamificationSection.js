import FastImage from '@rocket.chat/react-native-fast-image';
import React from 'react';
import { View, StyleSheet, Text, Dimensions, TouchableOpacity } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors, exStyles } from '../../../styles';
import SectionHeader from './SectionHeader';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;

const GamificationSection = ({ navigation, route, ...props }) => {
	const Card = ({ url, name, onPress }) => (
		<TouchableOpacity
			activeOpacity={0.7}
			style={{
				alignItems: 'center',
				marginTop: 24,
				width: screenWidth * 0.38,
				borderRadius: 16,
				paddingTop: 16,
				paddingBottom: 6,
				backgroundColor: colors.unSelected
			}}
			onPress={onPress}>
			<FastImage style={{ height: 60, width: 60 }} source={url} />
			<Text style={[exStyles.infoLink14Med, { color: colors.primaryText }]}>{name}</Text>
		</TouchableOpacity>
	);

	return (
		<>
			<SectionHeader title='Gamification' onPress={() => {}} />
			<View style={{ marginHorizontal: RFValue(24) }}>
				<View style={styles.row}>
					<Card
						url={require('../../../static/icons/leaderboardicon.png')}
						name='LeaderBoard'
						onPress={() => {
							navigation.navigate('LeaderBoard');
						}}
					/>
					<Card
						url={require('../../../static/icons/surveypollicon.png')}
						name='Surveys & Polls'
						onPress={() => navigation.navigate('SurveysPolls')}
					/>
				</View>
				<View style={styles.row}>
					<Card
						url={require('../../../static/icons/scavangerhunt.png')}
						name='Scavanger Hunt'
						onPress={() => navigation.navigate('ScavangerHunt')}
					/>
					<Card
						url={require('../../../static/icons/spinwheelicon.png')}
						name='Spin the wheel'
						onPress={() => {
							navigation.navigate('GamificationView');
						}}
					/>
				</View>
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	row: { flexDirection: 'row', justifyContent: 'space-between' }
});

export default GamificationSection;
