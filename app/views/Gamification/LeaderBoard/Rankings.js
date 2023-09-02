import React, { useState, memo } from 'react';
import { FlatList, View, Text, StyleSheet, Dimensions } from 'react-native';
import FastImage from '@rocket.chat/react-native-fast-image';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors, exStyles } from '@styles';
import { SvgUri } from 'react-native-svg';
import { ShareData } from '@utils';
import { withTheme } from '../../../theme';
import { withDimensions } from '../../../dimensions';
import { themes } from '../../../constants/colors';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;
const Rankings = ({ ...props }) => {
	const { theme } = props;
	const { rankings } = props;
	const winners = props.rankings[0];
	const position = 4;

	const separator = () => <View style={styles.separator} />;

	const Winner = ({ item, ...props }) => (
		<View
			style={{
				alignItems: 'center'
			}}>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',

					position: 'relative',
					top: props.position == '1st' ? 32 : props.position == '2nd' ? 72 : 106
				}}>
				{props.position == '1st' ? (
					<FastImage
						style={{
							height: 20,
							width: 20,
							marginEnd: 8
						}}
						source={require('../../../static/icons/crown.png')}
					/>
				) : null}
				<Text style={[exStyles.infoLargeM16, { color: 'white' }]}>{item.user.fname}</Text>
			</View>

			<FastImage
				source={{ uri: item.user.image }}
				style={{
					height: 60,
					width: 60,
					borderRadius: 30,
					borderWidth: 1,
					borderColor: colors.black20,
					position: 'relative',
					top: props.position == '1st' ? 32 : props.position == '2nd' ? 72 : 104
				}}
			/>

			<View
				style={{
					position: 'relative',
					top: props.position == '1st' ? 40 : props.position == '2nd' ? 80 : 110
				}}>
				<Text style={styles.position}>{props.position}</Text>
				<Text style={styles.scores}>{item.scores}</Text>
			</View>
		</View>
	);

	const Header = () => (
		<View
			style={{
				height: screenHeight * 0.35,
				backgroundColor: themes[theme].headerBackground,
				borderBottomEndRadius: 40,
				borderBottomStartRadius: 40,
				paddingTop: 16,
				marginBottom: 16,
				alignItems: 'baseline'
			}}>
			<FastImage
				style={{
					position: 'absolute',
					bottom: 0,
					height: 250,
					width: '100%'
				}}
				source={require('../../../static/icons/Leaderboard.png')}>
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'center'
					}}>
					<Winner item={winners[2]} position='3rd' />
					<View style={{ width: RFValue(32) }} />
					<Winner item={winners[0]} position='1st' />
					<View style={{ width: RFValue(32) }} />
					<Winner item={winners[1]} position='2nd' />
				</View>
			</FastImage>
		</View>
	);
	return (
		<View
			style={{
				flex: 1
			}}>
			<FlatList
				ListHeaderComponent={<Header />}
				data={rankings[1]}
				ItemSeparatorComponent={separator}
				renderItem={({ item, index }) => (
					<View
						style={{
							paddingVertical: 16,
							flexDirection: 'row',
							justifyContent: 'flex-start',
							paddingHorizontal: 16,
							alignItems: 'center',
							backgroundColor: item.user.username == ShareData.getInstance().userName ? '#69DBC633' : 'transparent'
						}}>
						<Text style={[exStyles.infoLargeM16, { color: colors.primaryText, width: 32 }]}>{index + position}</Text>
						<FastImage
							source={{ uri: item.user.image }}
							style={{
								height: 60,
								width: 60,
								borderRadius: 60 / 2,
								borderWidth: 1,
								borderColor: colors.black20,
								marginStart: 16,
								marginEnd: 8
							}}
						/>
						<View style={{ alignSelf: 'flex-start' }}>
							<Text style={[exStyles.infoLargeM16, { color: colors.primaryText }]}>
								{`${item.user.fname} ${item.user.lname}`}
							</Text>
							<Text style={[exStyles.infoLargeM16, { color: colors.secondaryText }]}>{item.user.job_title}</Text>
						</View>
						<Text
							style={[
								exStyles.infoLargeM16,
								{
									alignSelf: 'flex-start',
									position: 'absolute',
									top: 16,
									right: 16,
									color: colors.secondaryColor
								}
							]}>
							{`${item.scores} ` + 'pts'}
						</Text>
					</View>
				)}
			/>
		</View>
	);
};

export default withDimensions(withTheme(memo(Rankings)));

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
		marginStart: 64
	}
});
