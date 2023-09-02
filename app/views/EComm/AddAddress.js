import * as React from 'react';
import { memo, useRef, useState, useEffect, createRef } from 'react';
import {
	View,
	Text,
	Image,
	SafeAreaView,
	StyleSheet,
	ScrollView,
	KeyboardAvoidingView,
	Alert,
	Platform,
	TextInput,
	Dimensions,
	TouchableOpacity,
	FlatList,
	AsyncStorage,
	ImageBackground,
	Pressable
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Header, SearchInput, LoadingDialog, FormButton } from '@components';
import axios from 'axios';
import { RFValue } from 'react-native-responsive-fontsize';
import { ShareData } from '@utils';
import ActionSheet from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-crop-picker';
import FastImage from '@rocket.chat/react-native-fast-image';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import json from '@nozbe/watermelondb/decorators/json';
import { setUser as setUserFun } from '../../actions/login';
import StatusBar from '../../containers/StatusBar';
import { themes } from '../../constants/colors';
import { withDimensions } from '../../dimensions';
import { withTheme } from '../../theme';
import { colors, exStyles } from '../../styles';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;
const AddAddress = ({ navigation, route, ...props }) => {
	const { theme } = props;
	const [loading, setLoading] = useState(false);

	const [first_name, set_first_name] = useState('');
	const [last_name, set_last_name] = useState('');
	const [email, set_Email] = useState('');
	const [phone_number, set_phone_number] = useState('');
	const [country, set_country] = useState('');
	const [state, set_state] = useState('');
	const [city, set_city] = useState('');
	const [zipcode, set_zipcode] = useState('');
	const [streetAddress, set_streetAddress] = useState('');
	const [streetAddress2, set_streetAddress2] = useState('');

	useEffect(() => {
		if (route.params !== undefined && route.params.isEdit !== undefined) {
			const { first_name, last_name, phone_number, email, country, city, zipcode, streetAddress, streetAddress2, state } =
				ShareData.getInstance().deliveryAddress;
			set_first_name(first_name);
			set_last_name(last_name);
			set_Email(email);
			set_phone_number(phone_number);
			set_country(country);
			set_state(state);
			set_city(city);
			set_zipcode(zipcode);
			set_streetAddress(streetAddress);
			set_streetAddress2(streetAddress2);
		}
	}, []);

	const checkRequiredFields = () => {
		if (
			first_name === '' ||
			last_name === '' ||
			phone_number === '' ||
			email === '' ||
			country === '' ||
			city === '' ||
			zipcode === '' ||
			streetAddress === ''
		) {
			alert('Please fill required fields');
			return;
		}
		ShareData.getInstance().setDeliveryAddress({
			first_name,
			last_name,
			phone_number,
			email,
			country,
			city,
			zipcode,
			streetAddress,
			streetAddress2,
			state
		});
		navigation.goBack();
		if (route.params !== undefined && route.params.updateAddress !== undefined) {
			route.params.updateAddress();
		}
		navigation.navigate('MyAddress', {
			data: route.params.data,
			cartIndex: route.params.cartIndex
		});
	};

	const ModalHeader = () => (
		<View>
			<View style={styles.modalHeader}>
				<Pressable
					style={({ pressed }) => [
						{
							backgroundColor: pressed ? 'rgba(0, 0, 0, 0.06)' : 'transprent'
						},
						styles.closeButton
					]}
					onPress={() => {
						navigation.goBack();
					}}>
					<MaterialCommunityIcons name='window-close' size={24} color='#424242' />
				</Pressable>
				<Text
					style={{
						fontSize: RFValue(20),
						color: 'black'
					}}>
					Add Delivery Address
				</Text>
				<Pressable
					style={({ pressed }) => [
						{
							backgroundColor: pressed ? 'rgba(0, 0, 0, 0.06)' : 'transprent'
						},
						styles.closeButton
					]}
					onPress={() => {
						checkRequiredFields();
					}}>
					<Feather name='check' size={24} color='#424242' />
				</Pressable>
			</View>
			<View style={{ height: RFValue(20) }} />
		</View>
	);

	return (
		<>
			<SafeAreaView theme={theme} style={{ backgroundColor: themes[theme].headerBackground }} />
			<SafeAreaView theme={theme} style={[styles.modalView, { backgroundColor: 'white', flex: 1 }]}>
				<StatusBar theme={theme} backgroundColor={themes[theme].headerBackground} />
				<KeyboardAvoidingView
					behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
					style={{ flex: 1, backgroundColor: colors.white }}>
					{ModalHeader()}

					<ScrollView style={{ flex: 1 }} contentContainerStyle={{}}>
						<InputFeild
							isRequired
							onChangeText={txt => {
								set_first_name(txt);
							}}
							title='First Name'
							value={first_name}
						/>
						<InputFeild
							isRequired
							onChangeText={txt => {
								set_last_name(txt);
							}}
							title='Last Name'
							value={last_name}
						/>
						<InputFeild
							isRequired
							keyboardType='phone-pad'
							onChangeText={txt => {
								set_phone_number(txt);
							}}
							title='Phone Number'
							value={phone_number}
						/>
						<InputFeild
							isRequired
							keyboardType='email-address'
							onChangeText={txt => {
								set_Email(txt);
							}}
							title='Email'
							value={email}
						/>

						<InputFeild
							isRequired
							onChangeText={txt => {
								set_country(txt);
							}}
							title='Country'
							value={country}
						/>
						<InputFeild
							isRequired
							onChangeText={txt => {
								set_state(txt);
							}}
							title='State'
							value={state}
						/>
						<InputFeild
							isRequired
							onChangeText={txt => {
								set_city(txt);
							}}
							title='City'
							value={city}
						/>
						<InputFeild
							isRequired
							keyboardType='numeric'
							onChangeText={txt => {
								set_zipcode(txt);
							}}
							title='Postal/Zip Code'
							value={zipcode}
						/>
						<InputFeild
							isRequired
							onChangeText={txt => {
								set_streetAddress(txt);
							}}
							title='Street & Address'
							value={streetAddress}
						/>
						<InputFeild
							onChangeText={txt => {
								set_streetAddress2(txt);
							}}
							title='Street & Address 2 (optional)'
							value={streetAddress2}
						/>
					</ScrollView>
				</KeyboardAvoidingView>
			</SafeAreaView>
		</>
	);
};

const InputFeild = memo(props => (
	<View style={[styles.containerInputFeild]}>
		<Text style={styles.txtFeildTitle}>
			{props.title}
			{props.isRequired && <Text style={[styles.txtFeildTitle, { color: 'red' }]}> *</Text>}
		</Text>
		<TextInput
			maxLength={500}
			style={[
				styles.txtinputFeild,
				{
					borderTopWidth: props.textBorder ? 1 : 0
				},
				props.inputStyle
			]}
			multiline={props.multiline}
			numberOfLines={props.numberOfLines}
			onChangeText={t => {
				props.onChangeText(t);
			}}
			value={props.value}
			{...props}
		/>

		{props.children}
	</View>
));

const styles = StyleSheet.create({
	modalView: {
		height: screenHeight,
		width: screenWidth,
		backgroundColor: 'white',
		borderTopRightRadius: RFValue(40),
		borderTopLeftRadius: RFValue(40),
		borderWidth: 1,
		borderColor: '#cecece',
		paddingTop: RFValue(32)
	},
	containerInputFeild: {
		borderColor: '#cecece',
		// marginHorizontal: RFValue(10),
		borderColor: '#cecece',
		borderBottomWidth: 1
	},
	txtFeildTitle: {
		// width: RFValue(100),
		paddingStart: RFValue(10),
		fontSize: RFValue(16),
		marginTop: RFValue(10),
		color: 'grey'
	},
	txtinputFeild: {
		flex: 1,
		borderColor: '#cecece',
		paddingVertical: RFValue(10),
		paddingStart: RFValue(10),
		fontSize: RFValue(16),
		color: 'black'
	},
	imgProfilePic: {
		height: RFValue(88),
		width: RFValue(88),
		borderRadius: RFValue(88),
		resizeMode: 'stretch',
		alignSelf: 'center',
		marginTop: RFValue(20)
	},
	txtChangeProfile: {
		color: colors.primaryColor,
		textDecorationLine: 'underline',
		fontSize: RFValue(14),
		marginBottom: RFValue(20)
	},
	modalHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginStart: 28,
		marginEnd: 28,
		alignItems: 'center'
	},
	closeButton: {
		borderRadius: 16,
		width: 32,
		height: 32,
		alignItems: 'center',
		justifyContent: 'center'
	}
});

export default connect(null, null)(withDimensions(withTheme(AddAddress)));
