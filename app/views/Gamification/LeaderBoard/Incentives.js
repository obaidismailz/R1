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
const InCentives = ({ ...props }) => {
	const { theme } = props;
	const { inCentives } = props;

	const separator = () => <View style={styles.separator} />;

	const Header = () => (
		<Text
			style={[
				exStyles.infoLink14Med,
				{
					color: colors.secondaryText,
					marginHorizontal: 32,
					textAlign: 'center',
					marginTop: 16,
					marginBottom: 32
				}
			]}
		>
			Gifts/incentives offered by our sponsors and organizers for top rankers
		</Text>
	);
	return (
		<View
			style={{
				flex: 1
			}}
		>
			<FlatList
				ListHeaderComponent={<Header />}
				data={inCentives}
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
						<Text
							style={[
								exStyles.infoLargeM16,
								{
									color: colors.primaryText
								}
							]}
						>
							{index == 0
								? `${ index + 1 }st`
								: index == 1
									? `${ index + 1 }nd`
									: index == 2
										? `${ index + 1 }rd`
										: `${ index + 1 }th`}
						</Text>

						<Text
							style={[
								exStyles.infoLargeM16,
								{
									color: colors.secondaryColor
								}
							]}
						>
							{item.incentive}
						</Text>
					</View>
				)}
			/>
		</View>
	);
};

export default withDimensions(withTheme(memo(InCentives)));

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
		marginHorizontal: 24,
		marginVertical: 16
	}
});
