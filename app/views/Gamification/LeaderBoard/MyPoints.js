import React, { useState, memo } from 'react';
import {
	FlatList, View, Text, StyleSheet, Dimensions
} from 'react-native';
import FastImage from '@rocket.chat/react-native-fast-image';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors, exStyles } from '@styles';
import { SvgUri } from 'react-native-svg';
import { withTheme } from '../../../theme';
import { withDimensions } from '../../../dimensions';
import { themes } from '../../../constants/colors';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;
const MyPoints = ({ ...props }) => {
	const { theme } = props;
	const { points, myPoints } = props;

	const separator = () => <View style={styles.separator} />;

	const Header = () => (
		<>
			<Text
				style={[
					exStyles.infoLink14Med,
					{
						color: colors.secondaryText,
						marginHorizontal: 32,
						textAlign: 'center',
						marginTop: 16
					}
				]}
			>
				View your activity details and earned points here!
			</Text>
			<Text
				style={[
					exStyles.largeTitleR28,
					{
						padding: 4,
						backgroundColor: colors.unSelected,
						textAlign: 'center',
						color: colors.primaryText,
						marginVertical: RFValue(24)
					}
				]}
			>
				{'Total Points: '}
				<Text style={{ fontWeight: '700' }}>{myPoints}</Text>
			</Text>
		</>
	);
	return (
		<View
			style={{
				flex: 1
			}}
		>
			<FlatList
				ListHeaderComponent={<Header />}
				data={points}
				ItemSeparatorComponent={separator}
				renderItem={({ item, index }) => (
					<View
						style={{
							flexDirection: 'row',
							marginHorizontal: 24,
							justifyContent: 'space-between',
							alignItems: 'center'
						}}
					>
						<View>
							<Text
								style={[
									exStyles.infoLargeM16,
									{
										color: colors.primaryText
									}
								]}
							>
								{item.activity.area.name}
							</Text>
							<Text
								style={[
									exStyles.infoLargeM16,
									{
										color: colors.secondaryText
									}
								]}
							>
								({item.activity.criteria.name})
							</Text>
						</View>

						<Text
							style={[
								exStyles.infoLargeM16,
								{
									color: colors.secondaryColor
								}
							]}
						>
							{item.scores}
						</Text>
					</View>
				)}
			/>
		</View>
	);
};

export default withDimensions(withTheme(memo(MyPoints)));

const styles = StyleSheet.create({
	position: {
		fontSize: 24,
		fontWeight: '700',
		lineHeight: 28,
		letterSpacing: 0.8,
		color: '#684B00',
		alignSelf: 'center'
	},
	scores: {
		fontSize: 14,
		fontWeight: '700',
		lineHeight: 24,
		color: '#684B00',
		alignSelf: 'center'
	},
	separator: {
		height: 1,
		backgroundColor: colors.separatorColor,
		marginStart: 64,
		marginVertical: 16
	}
});
