import React, { memo, useState, useEffect } from 'react';
import {
	View,
	Image,
	Text,
	TouchableOpacity,
	Dimensions,
	Pressable,
	Modal,
	Linking,
	SafeAreaView,
	StyleSheet
} from 'react-native';
import FastImage from '@rocket.chat/react-native-fast-image';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors, exStyles } from '@styles';

import { FormButton } from '@components';
import { ShareData } from '@utils';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;
const ModalAddProductToCart = ({ ...props }, ref) => {
	const [quantity, setQuantity] = useState(1);

	useEffect(() => {
		if (props.visible) {
			setQuantity(1);
		}
	}, [props.visible]);

	const Header = () => (
		<View style={{}}>
			<Text style={styles.heading} />
			<Pressable
				style={({ pressed }) => [
					{
						backgroundColor: pressed ? 'rgba(0, 0, 0, 0.06)' : 'white'
					},
					styles.headerCloseIcon
				]}
				onPress={() => {
					props.onClose();
				}}
			>
				<MaterialIcons name='close' size={RFValue(25)} color='#424242' />
			</Pressable>
		</View>
	);

	return (
		<Modal
			animationType='slide'
			transparent
			visible={props.visible}
			onRequestClose={() => {
				props.onClose();
			}}
		>
			<SafeAreaView style={styles.centeredView}>
				<View style={styles.modalView}>
					<Header />
					<View style={styles.prodDetailsContainer}>
						<FastImage
							style={styles.productImage}
							source={{ uri: props.data.image }}
						/>
						<View>
							<Text style={styles.txtProdName}>{props.data.name}</Text>
							<Text style={styles.txtUnitPrice}>Unit Price</Text>
							<Text style={[styles.txtProdName, { color: '#7E8389' }]}>
								{' $'}
								{props.data.price}
							</Text>
						</View>
					</View>

					<View
						style={{
							flexDirection: 'row',
							backgroundColor: '#F2F2F2',
							paddingVertical: RFValue(10)
						}}
					>
						<View style={styles.barInContainer}>
							<Text style={{ color: '#424242', fontSize: RFValue(16) }}>
								Quantity
							</Text>
						</View>
						<View style={styles.barInContainer}>
							<Pressable
								style={styles.btnAddSub}
								onPress={() => {
									if (quantity !== 1) {
										setQuantity(q => q - 1);
									}
								}}
							>
								{/* <Image
                  source={require("@assets/minusSimple.png")}
                  style={styles.iconAddSub}
                /> */}
							</Pressable>
							<Text style={styles.txtQuantity}>{quantity}</Text>
							<Pressable
								style={styles.btnAddSub}
								onPress={() => {
									setQuantity(q => q + 1);
								}}
							>
								{/* <Image
									source={require('@assets/plusSimple.png')}
									style={styles.iconAddSub}
								/> */}
							</Pressable>
						</View>
					</View>
					<View style={styles.divider} />

					<View
						style={{
							flexDirection: 'row',
							paddingVertical: RFValue(10)
						}}
					>
						<View style={styles.barInContainer}>
							<Text style={{ color: '#424242', fontSize: RFValue(16) }}>
								Total
							</Text>
						</View>
						<View style={styles.barInContainer}>
							<Text style={styles.txtQuantity}>
								{' $'}
								{(props.data.price * quantity).toFixed(2)}
							</Text>
						</View>
					</View>
					<View style={styles.divider} />
					<View style={{ marginTop: RFValue(60) }} />

					<FormButton
						title='ADD TO CART'
						extraStyle={{ width: RFValue(150), alignSelf: 'center' }}
						onPress={() => {
							props.onConfirm(quantity);
						}}
					/>
				</View>
			</SafeAreaView>
		</Modal>
	);
};

const styles = StyleSheet.create({
	centeredView: {
		height: screenHeight,
		width: screenWidth,
		justifyContent: 'flex-end',
		backgroundColor: 'rgba(0, 0, 0, 0.6)'
	},
	modalView: {
		// height: screenHeight / 2,
		width: screenWidth,
		backgroundColor: 'white',
		borderTopRightRadius: RFValue(40),
		borderTopLeftRadius: RFValue(40),
		borderWidth: 1,
		borderColor: '#cecece',
		paddingTop: RFValue(22),
		paddingBottom: RFValue(80)
	},

	// Header
	heading: {
		fontSize: RFValue(20),
		fontStyle: 'normal',
		textAlign: 'center',
		color: '#7E8389',
		fontWeight: '500'
	},
	headerCloseIcon: {
		position: 'absolute',
		right: RFValue(28),
		alignSelf: 'flex-end'
	},

	// body
	itemHeadingContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 20,
		marginTop: 30
	},
	productImage: {
		height: RFValue(88),
		width: RFValue(88),
		borderRadius: RFValue(12),
		resizeMode: 'stretch',
		justifyContent: 'center',
		alignItems: 'center'
	},
	prodDetailsContainer: {
		paddingHorizontal: RFValue(24),
		marginTop: RFValue(15),
		marginBottom: RFValue(25),
		flexDirection: 'row'
	},
	txtProdName: {
		fontSize: RFValue(14),
		marginStart: RFValue(10),
		color: '#424242'
	},
	txtUnitPrice: {
		fontSize: RFValue(11),
		marginStart: RFValue(10),
		color: '#7E8389'
	},
	txtQuantity: {
		fontSize: RFValue(16),
		color: '#000000'
	},
	barInContainer: {
		flex: 1,
		justifyContent: 'center',
		flexDirection: 'row',
		justifyContent: 'center'
	},
	btnAddSub: {
		justifyContent: 'center',
		alignItems: 'center',
		height: RFValue(24),
		width: RFValue(24),
		borderRadius: RFValue(6),
		marginHorizontal: RFValue(15),
		backgroundColor: colors.primaryColor
	},
	iconAddSub: {
		height: RFValue(10),
		width: RFValue(10),
		resizeMode: 'contain'
	},
	divider: {
		height: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.2)'
	}
});

export default memo(ModalAddProductToCart);
