import * as React from 'react';
import { memo, useRef, useState, useEffect } from 'react';
import { View, Text, Image, SafeAreaView, StyleSheet, StatusBar, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { AuthInput, LoadingDialog, FormButton } from '@components';
import axios from 'axios';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors, exStyles } from '@styles';
import { FORGOT_PASSWORD } from '@utils/Constants';
import { ShareData } from '@utils';
import { VISITORS } from '../utils/Constants';

const ForgotPassword = ({ navigation, route }) => {
	const reffEmail = useRef(null);
	const reffPassword = useRef(null);
	const [email, setEmail] = useState('');
	const [loading, setLoading] = useState(false);
	useEffect(() => {}, []);

	const submit = async () =>
		new Promise((resolve, reject) => {
			setLoading(true);
			const params = {
				email
			};
			axios({
				method: 'POST',
				url: ShareData.getInstance().baseUrl + FORGOT_PASSWORD,
				data: params
			})
				.then(response => {
					if (response.status === 200 || response.status === 600) {
						if (response.data._metadata.status === 'SUCCESS') {
							resolve(response.data._metadata.message);
						} else {
							reject(response.data._metadata.message);
						}
					} else {
						reject('Failed to reset password, Please try again later.');
					}
				})
				.catch(error => {
					setLoading(false);
					reject(`Failed to reset password, Please try again later${error}`);
				});
		});

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
			<StatusBar backgroundColor={colors.secondaryColor} barStyle='light-content' />
			<KeyboardAvoidingView
				style={{
					flex: 1,
					justifyContent: 'center',
					paddingHorizontal: RFValue(30)
				}}>
				<TouchableOpacity
					style={{
						paddingVertical: RFValue(5),
						paddingHorizontal: RFValue(5),
						position: 'absolute',
						top: RFValue(10)
						// left: RFValue(5),
					}}
					onPress={() => navigation.goBack()}>
					<Image
						style={{
							height: 40,
							width: 40,
							resizeMode: 'contain',
							transform: [{ rotate: '180deg' }]
						}}
						source={require('../static/icons/NextIcon.png')}
					/>
				</TouchableOpacity>
				<Image style={styles.images} source={require('../static/icons/ForgetPassword.png')} />
				<Text
					style={[
						exStyles.largeTitleR28,
						{
							color: '#F6A83B',
							alignSelf: 'center',
							textAlign: 'center'
						}
					]}>
					{'Forgot Your\n Password?'}
				</Text>
				<Text
					style={[
						exStyles.infoLink14Med,
						{
							color: colors.secondaryText,
							alignSelf: 'center',
							marginTop: 8,
							marginBottom: 50,
							textAlign: 'center'
						}
					]}>
					{'Share your email to get a link to\n reset your password'}
				</Text>

				<AuthInput
					reff={reffEmail}
					marginStyle={{ marginTop: RFValue(0), width: '100%' }}
					value={email}
					placeholder='Type Your Email'
					autoCapitalize='none'
					keyboardType='url'
					onSubmitEditing={() => {
						submit()
							.then(msg => {
								alert(msg);
							})
							.catch(err => alert(err));
					}}
					onChangeText={text => setEmail(text)}
				/>

				<FormButton
					title='Send'
					extraStyle={{
						marginTop: RFValue(80),
						backgroundColor: '#F6A83B',
						borderColor: '#F6A83B'
					}}
					onPress={() => {
						// alert(FORGOT_PASSWORD);
						submit()
							.then(msg => {
								alert(msg);
								setTimeout(() => {
									setLoading(false);
								}, 3000);
							})
							.catch(err => alert(err));
					}}
				/>

				<View
					style={{
						flexDirection: 'row',
						alignSelf: 'center',
						justifyContent: 'center',
						alignItems: 'center',
						marginTop: RFValue(20)
					}}>
					<Text
						style={[
							exStyles.infoLink14Med,
							{
								color: colors.secondaryText,
								justifyContent: 'center',
								alignItems: 'center',
								alignSelf: 'center',
								textAlignVertical: 'top'
							}
						]}>
						Don't have an account?
					</Text>
					<TouchableOpacity
						onPress={() => {
							navigation.navigate('Signup', {
								header: 'Sign up',
								url: VISITORS
							});
						}}>
						<Text style={[exStyles.infoLink14Med, { color: colors.secondaryColor }]}> Sign Up Here</Text>
					</TouchableOpacity>
				</View>
			</KeyboardAvoidingView>
			<LoadingDialog visible={loading} />
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	images: {
		height: RFValue(80),
		width: RFValue(80),
		marginBottom: 24,
		alignSelf: 'center',
		resizeMode: 'contain',
		tintColor: '#F6A83B'
	},
	textInput: {
		flex: 1,
		paddingVertical: 15,
		paddingStart: 15,
		fontSize: RFValue(16),
		color: '#48a9ee'
	},

	heading: {
		alignSelf: 'center',
		color: 'red',
		fontSize: RFValue(22),
		marginTop: RFValue(20),
		fontWeight: 'bold'
	}
});

export default memo(ForgotPassword);
