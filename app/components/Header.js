import React, { memo, useState } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import { colors, exStyles } from '@styles';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FastImage from '@rocket.chat/react-native-fast-image';
import IonIcons from 'react-native-vector-icons/Ionicons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { themes } from '../constants/colors';

const Header = ({ theme, ...props }, ref) => {
	const [isFocused, setIsFocused] = useState(!!props.defaultFocus);
	const searchInputRef = React.useRef(null);
	return (
		<View style={[styles.mainContainer, { backgroundColor: themes[theme].headerBackground }]}>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center'
				}}>
				{props.onCrossPress && (
					<TouchableOpacity
						activeOpacity={0.7}
						onPress={() => {
							props.onCrossPress && props.onCrossPress();
						}}>
						<AntDesign name='close' size={24} color={colors.white} />
					</TouchableOpacity>
				)}
				{props.onMenuPress && (
					<TouchableOpacity
						activeOpacity={0.7}
						onPress={() => {
							props.onMenuPress && props.onMenuPress();
						}}>
						<Image
							style={{
								height: 24,
								width: 24
							}}
							source={require('../static/icons/MenuIcon.png')}
						/>
					</TouchableOpacity>
				)}
				{props.onBackPress && (
					<TouchableOpacity
						activeOpacity={0.7}
						onPress={() => {
							props.onBackPress && props.onBackPress();
						}}>
						<MaterialIcon name='keyboard-arrow-left' size={32} color={colors.white} />
					</TouchableOpacity>
				)}
			</View>
			{!isFocused ? (
				<>
					<Text numberOfLines={1} style={[exStyles.mediumTitleMed20, styles.title]}>
						{props.title}
					</Text>
					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'flex-end',
							alignItems: 'center'
						}}>
						{props.onChangeSearch && (
							<TouchableOpacity
								activeOpacity={0.7}
								style={{ marginHorizontal: 12 }}
								onPress={() => {
									if (props.onSearchPress !== undefined) {
										props.onSearchPress();
										return;
									}
									setIsFocused(true);
								}}>
								<AntDesign name='search1' size={22} color={colors.white} />
							</TouchableOpacity>
						)}

						{props.onCartPress && (
							<TouchableOpacity
								activeOpacity={0.7}
								style={{ marginHorizontal: 12 }}
								onPress={() => props.onCartPress && props.onCartPress()}>
								<Entypo name='shopping-cart' size={22} color='white' />
							</TouchableOpacity>
						)}
						{props.onQRPress && (
							<TouchableOpacity
								activeOpacity={0.7}
								style={{ marginHorizontal: 12 }}
								onPress={() => {
									props.onQRPress && props.onQRPress();
								}}>
								<MIcon name='qrcode-scan' size={20} color='white' />
							</TouchableOpacity>
						)}
						{props.onNotificationPress && (
							<TouchableOpacity
								activeOpacity={0.7}
								style={{ marginHorizontal: 12 }}
								onPress={() => {
									props.onNotificationPress && props.onNotificationPress();
								}}>
								{props.badgeCount != undefined && props.badgeCount != '' && (
									<View style={styles.vi}>
										<Text
											style={[
												styles.txtBadge,
												props.badgeCount > 99
													? {
															fontSize: 8
													  }
													: {}
											]}>
											{props.badgeCount > 99 ? '99+' : props.badgeCount}
										</Text>
									</View>
								)}
								<MIcon name='bell-outline' size={24} color={colors.white} />
							</TouchableOpacity>
						)}
						{props.onBreifcasePress && (
							<TouchableOpacity
								activeOpacity={0.7}
								style={{
									justifyContent: 'center',
									alignItems: 'center',
									marginHorizontal: 12
								}}
								onPress={() => {
									props.onBreifcasePress && props.onBreifcasePress();
								}}>
								<IonIcons
									name={props.isBriefcased === true ? 'briefcase' : 'md-briefcase-outline'}
									size={24}
									color={props.isBriefcased === true ? colors.primaryColor : colors.white}
								/>
							</TouchableOpacity>
						)}
						{props.onAddPress && (
							<TouchableOpacity
								activeOpacity={0.7}
								style={{
									justifyContent: 'center',
									alignItems: 'center',
									marginHorizontal: 12
								}}
								onPress={() => {
									props.onAddPress && props.onAddPress();
								}}>
								<IonIcons name='ios-add' size={24} color={colors.white} />
							</TouchableOpacity>
						)}
						{props.onSharePress && (
							<TouchableOpacity
								activeOpacity={0.7}
								style={{ marginHorizontal: 12 }}
								onPress={() => {
									props.onSharePress && props.onSharePress();
								}}>
								<MIcon name='share-variant' size={22} color={colors.white} />
							</TouchableOpacity>
						)}

						{props.onEditPress && (
							<TouchableOpacity
								activeOpacity={0.7}
								style={{ marginHorizontal: 12 }}
								onPress={() => {
									props.onEditPress && props.onEditPress();
								}}>
								<MaterialIcon name='edit' size={22} color={colors.white} />
							</TouchableOpacity>
						)}
						{props.onOptionsPress && (
							<TouchableOpacity
								activeOpacity={0.7}
								style={{ marginHorizontal: 12 }}
								onPress={() => {
									props.onOptionsPress && props.onOptionsPress();
								}}>
								<FeatherIcon name='more-vertical' size={24} color={colors.white} />
							</TouchableOpacity>
						)}
						{props.onCheckPress && (
							<TouchableOpacity
								activeOpacity={0.7}
								style={{ padding: RFValue(10), paddingEnd: RFValue(20) }}
								onPress={() => {
									props.onCheckPress && props.onCheckPress();
								}}>
								<IonIcons name='ios-checkmark-sharp' size={24} color={colors.white} />
							</TouchableOpacity>
						)}
						{props.textButtonPress && (
							<TouchableOpacity
								activeOpacity={0.7}
								style={{
									marginEnd: RFValue(8),
									borderRadius: 4,
									borderWidth: 1,
									borderColor: 'white',
									alignItems: 'center'
								}}
								onPress={() => {
									props.textButtonPress && props.textButtonPress();
								}}>
								<Text style={[exStyles.infoDetailR16, { color: 'white', paddingHorizontal: 2 }]}>{props.buttonText}</Text>
							</TouchableOpacity>
						)}
					</View>
					{props.children}
				</>
			) : (
				!props.hideField && (
					<View style={styles.inputContainer}>
						<TextInput
							style={styles.txtInput}
							ref={searchInputRef}
							selectionColor='#fff'
							placeholder={props.placeholder}
							placeholderTextColor='#efefef'
							value={props.value}
							onChangeText={props.onChangeSearch}
							onSubmitEditing={props.onSubmitEditing}
						/>
						<Entypo
							name='circle-with-cross'
							size={24}
							color={colors.white}
							style={{ paddingEnd: RFValue(10) }}
							onPress={() => {
								if (props.defaultFocus) {
									searchInputRef.current.clear();
								} else {
									setIsFocused(false);
								}
							}}
						/>
					</View>
				)
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	mainContainer: {
		paddingHorizontal: 16,
		height: 44,
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center'
	},
	title: {
		color: 'white',
		flex: 1,
		marginStart: 24
	},
	inputContainer: {
		backgroundColor: '#5290f1',
		flexDirection: 'row',
		flex: 1,
		marginStart: RFValue(10),
		borderRadius: RFValue(5),
		height: RFValue(30),
		alignItems: 'center'
	},
	txtInput: {
		flex: 1,
		paddingHorizontal: RFValue(10),
		color: '#fff',
		paddingVertical: 0,
		fontSize: 18
	},
	vi: {
		position: 'absolute',
		width: 18,
		height: 18,
		top: -8,
		right: -8,
		backgroundColor: 'red',
		padding: 2,

		borderRadius: 9
	},
	txtBadge: {
		textAlign: 'center',
		textAlignVertical: 'center',
		color: '#fff',
		fontWeight: '500',
		fontSize: 10
	}
});

export default memo(Header);
