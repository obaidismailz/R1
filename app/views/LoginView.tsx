import React from 'react';
import { Alert, Keyboard, StyleSheet, Text, View, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, StatusBar, Image} from 'react-native';
import { connect } from 'react-redux';
import { dequal } from 'dequal';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/core';
import axios from 'axios';
import parse from 'url-parse';
import {
	AuthInput,
	PasswordInput,
	FormButton,
	LoadingDialog
} from '@components';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors, exStyles } from '@styles';
import { LOGIN } from '@utils/Constants';
import { ShareData } from '@utils';

import Button from '../containers/Button';
import I18n from '../i18n';
import * as HeaderButton from '../containers/HeaderButton';
import { themes } from '../constants/colors';
import { withTheme } from '../theme';
import FormContainer, { FormContainerInner } from '../containers/FormContainer';
import TextInput from '../containers/TextInput';
import { loginRequest as loginRequestAction } from '../actions/login';
import LoginServices from '../containers/LoginServices';
import sharedStyles from './Styles';
import { OutsideParamList } from '../stacks/types';
import { VISITORS } from '../utils/Constants';
import { selectServerRequest, serverRequest } from '../actions/server';
import AsyncStorage from '@react-native-community/async-storage';
import { setExpoAuth } from '../utils/vexpo/vExpoFetch';


const styles = StyleSheet.create({
	registerDisabled: {
		...sharedStyles.textRegular,
		...sharedStyles.textAlignCenter,
		fontSize: 16
	},
	title: {
		...sharedStyles.textBold,
		fontSize: 22
	},
	inputContainer: {
		marginVertical: 16
	},
	bottomContainer: {
		flexDirection: 'column',
		alignItems: 'center',
		marginBottom: 32
	},
	bottomContainerText: {
		...sharedStyles.textRegular,
		fontSize: 13
	},
	bottomContainerTextBold: {
		...sharedStyles.textSemibold,
		fontSize: 13
	},
	loginButton: {
		marginTop: 16
	},
	images: {
		height: RFValue(200),
		width: RFValue(200),
		alignSelf: 'center',
		resizeMode: 'stretch'
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
	},
	imgBack: {
		height: RFValue(30),
		width: RFValue(30),
		transform: [{ rotate: '180deg' }],
		tintColor: '#2674ee'
	},
	btnFloatingBack: {
		position: 'absolute',
		padding: RFValue(5),
		top: 0,
		left: 0
	}
});

interface ILoginViewProps {
	navigation: StackNavigationProp<OutsideParamList, 'LoginView'>;
	route: RouteProp<OutsideParamList, 'LoginView'>;
	Site_Name: string;
	Accounts_RegistrationForm: string;
	Accounts_RegistrationForm_LinkReplacementText: string;
	Accounts_EmailOrUsernamePlaceholder: string;
	Accounts_PasswordPlaceholder: string;
	Accounts_PasswordReset: boolean;
	Accounts_ShowFormLogin: boolean;
	isFetching: boolean;
	error: {
		error: string;
	};
	failure: boolean;
	theme: string;
	loginRequest: Function;
	inviteLinkToken: string;
}

class LoginView extends React.Component<ILoginViewProps, any> {
	private passwordInput: any;

	static navigationOptions = ({ route, navigation }: ILoginViewProps) => ({
		title: route?.params?.title ?? 'Rocket.Chat',
		headerRight: () => <HeaderButton.Legal testID='login-view-more' navigation={navigation} />
	});

	constructor(props: ILoginViewProps) {
		super(props);
		this.state = {
			user: props.route.params?.username ?? '',
			password: '',
			loading: false,
			domain: '',
			emailFocused: false,
			passwordFocused: false,
			loginFaild: false
		};
	}

	
	componentDidMount() {
		// BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
		this._unsubscribe = this.props.navigation.addListener('focus', () => {
			AsyncStorage.getItem('url').then((value) => {
				this.setState({ domain: value });
				this.validate(value);
			});
		});
	}

	componentWillUnmount() {
		// BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
		this._unsubscribe();
	}

	UNSAFE_componentWillReceiveProps(nextProps: ILoginViewProps) {
		const { error } = this.props;
		if (nextProps.failure && !dequal(error, nextProps.error)) {
			if (nextProps.error?.error === 'error-invalid-email') {
				this.resendEmailConfirmation();
			} else {
				Alert.alert(I18n.t('Oops'), I18n.t('Login_error'));
			}
		}
	}

	get showRegistrationButton() {
		const { Accounts_RegistrationForm, inviteLinkToken } = this.props;
		return Accounts_RegistrationForm === 'Public' || (Accounts_RegistrationForm === 'Secret URL' && inviteLinkToken?.length);
	}

	completeUrl = (url) => {
		const parsedUrl = parse(url, true);
		if (parsedUrl.auth.length) {
			url = parsedUrl.origin;
		}

		url = url && url.replace(/\s/g, '');

		if (
			/^(\w|[0-9-_]){3,}$/.test(url)
			&& /^(htt(ps?)?)|(loca((l)?|(lh)?|(lho)?|(lhos)?|(lhost:?\d*)?)$)/.test(
				url
			) === false
		) {
			url = `${ url }.rocket.chat`;
		}

		if (
			/^(https?:\/\/)?(((\w|[0-9-_])+(\.(\w|[0-9-_])+)+)|localhost)(:\d+)?$/.test(
				url
			)
		) {
			if (/^localhost(:\d+)?/.test(url)) {
				url = `http://${ url }`;
			} else if (/^https?:\/\//.test(url) === false) {
				url = `https://${ url }`;
			}
		}

		return url.replace(/\/+$/, '').replace(/\\/g, '/');
	};

	validate = async(text) => {
		const { connectServer } = this.props;
		const cert = null;
		const temp = ShareData.getInstance().rcBaseUrl;
		const server = this.completeUrl(temp);
		// await this.basicAuth(server, temp);
		connectServer(server, cert, text);
	};

	login = () => {
		const { navigation, Site_Name } = this.props;
		navigation.navigate('LoginView', { title: Site_Name });
	};

	register = () => {
		const { navigation, Site_Name } = this.props;
		navigation.navigate('RegisterView', { title: Site_Name });
	};

	forgotPassword = () => {
		const { navigation, Site_Name } = this.props;
		navigation.navigate('ForgotPasswordView', { title: Site_Name });
	};

	resendEmailConfirmation = () => {
		const { user } = this.state;
		const { navigation } = this.props;
		navigation.navigate('SendEmailConfirmationView', { user });
	};

	valid = () => {
		const { user, password } = this.state;
		const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		if (user === '' && password === '') {
			alert('Please enter email and password');
			return false;
		} else if (user === '') {
			alert('Please enter email');
			return false;
		} else if (reg.test(user) === false) {
			alert('Please enter valid email');
			return false;
		} else if (password === '') {
			alert('Please enter password');
			return false;
		} else {
			return true;
		}
		// return user.trim() && password.trim();
	};

	submit = () => {
		if (!this.valid()) {
			return;
		}

		const { user, password } = this.state;
		const { loginRequest } = this.props;
		Keyboard.dismiss();
		this.loopExpoLogin()
			.then((resp) => {
				if (resp === 200) {
				} else {
				}
				const { user, password } = this.state;
				const { loginRequest } = this.props;
				loginRequest({ user, password });
			})
			.catch((error) => {});
	};

	loopExpoLogin = async() => {
		this.setState({ loading: true, loginFaild: false });
		const { user, password } = this.state;
		return new Promise((resolve, reject) => {
			const params = {
				email: user,
				password
			};
			axios({
				method: 'POST',
				url: ShareData.getInstance().baseUrl + LOGIN,
				data: params
			})
				.then((response) => {
					if (response.status === 200 || response.status === 600) {
						if (response.data._metadata.status === 'SUCCESS') {
							this.setState({ loading: false, loginFaild: false });
							const sharedata = {
								...response.data.records.user,
								access_token: response.data.records.access_token,
								timeline_token: response.data.records.timeline.access_token,
								user_id: response.data.records.timeline.user_id,
								name: `${ response.data.records.user.fname } ${ response.data.records.user.lname }`,
								image: response.data.records.user.image,
								email: response.data.records.user.email,
								userName: response.data.records.user.username,
								rcUserId: response.data.records.chat.userId,
								rcToken: response.data.records.chat.authToken,
								workspeeToken: response.data.records.timeline.access_token,
								rcBaseUrl: response.data.records.config.filter(
									conf => conf.key === 'rc_chat_url'
								)[0].value
							};
							setExpoAuth(response.data.records.access_token);
							ShareData.getInstance().setUserData(sharedata);

							AsyncStorage.setItem('user', JSON.stringify(sharedata))
								.then(() => {
									AsyncStorage.setItem('timelineurl', 'https://react').then(
										() => {
											AsyncStorage.setItem(
												'timelinee',
												JSON.stringify(response.data.records.timeline)
											).then(() => {
												resolve(200);
											});
										}
									);
								})
								.catch((e) => {
									this.setState({ loading: false, loginFaild: true });
									resolve(404);
								});
						} else {
							this.setState({ loading: false, loginFaild: true });
							reject(404);
						}
					} else {
						this.setState({ loading: false, loginFaild: true });
						reject(404);
					}
				})
				.catch((error) => {
					this.setState({ loading: false, loginFaild: true });
					resolve(404);
				});
		});
	};

	// handleFocusEmail = () => this.setState({ emailFocused: true });

	// handleBlurEmail = () => this.setState({ emailFocused: false });

	// handleFocusPassword = () => this.setState({ passwordFocused: true });

	// handleBlurPassword = () => this.setState({ passwordFocused: false });

	renderUserForm = () => {
		const { user } = this.state;
		const {
			Accounts_EmailOrUsernamePlaceholder,
			Accounts_PasswordPlaceholder,
			Accounts_PasswordReset,
			Accounts_RegistrationForm_LinkReplacementText,
			isFetching,
			theme,
			Accounts_ShowFormLogin
		} = this.props;

		if (!Accounts_ShowFormLogin) {
			return null;
		}

		return (
			<>
				<Text style={[styles.title, sharedStyles.textBold, { color: themes[theme].titleText }]}>{I18n.t('Login')}</Text>
				<TextInput
					label={I18n.t('Username_or_email')}
					containerStyle={styles.inputContainer}
					placeholder={Accounts_EmailOrUsernamePlaceholder || I18n.t('Username_or_email')}
					keyboardType='email-address'
					returnKeyType='next'
					onChangeText={(value: string) => this.setState({ user: value })}
					onSubmitEditing={() => {
						this.passwordInput.focus();
					}}
					testID='login-view-email'
					textContentType='username'
					autoCompleteType='username'
					theme={theme}
					value={user}
				/>
				<TextInput
					label={I18n.t('Password')}
					containerStyle={styles.inputContainer}
					inputRef={e => {
						this.passwordInput = e;
					}}
					placeholder={Accounts_PasswordPlaceholder || I18n.t('Password')}
					returnKeyType='send'
					secureTextEntry
					onSubmitEditing={this.submit}
					onChangeText={(value: string) => this.setState({ password: value })}
					testID='login-view-password'
					textContentType='password'
					autoCompleteType='password'
					theme={theme}
				/>
				<Button
					title={I18n.t('Login')}
					type='primary'
					onPress={this.submit}
					testID='login-view-submit'
					loading={isFetching}
					disabled={!this.valid()}
					theme={theme}
					style={styles.loginButton}
				/>
				{Accounts_PasswordReset && (
					<Button
						title={I18n.t('Forgot_password')}
						type='secondary'
						onPress={this.forgotPassword}
						testID='login-view-forgot-password'
						theme={theme}
						color={themes[theme].auxiliaryText}
						fontSize={14}
					/>
				)}
				{this.showRegistrationButton ? (
					<View style={styles.bottomContainer}>
						<Text style={[styles.bottomContainerText, { color: themes[theme].auxiliaryText }]}>
							{I18n.t('Dont_Have_An_Account')}
						</Text>
						<Text
							style={[styles.bottomContainerTextBold, { color: themes[theme].actionTintColor }]}
							onPress={this.register}
							testID='login-view-register'>
							{I18n.t('Create_account')}
						</Text>
					</View>
				) : (
					<Text style={[styles.registerDisabled, { color: themes[theme].auxiliaryText }]}>
						{Accounts_RegistrationForm_LinkReplacementText}
					</Text>
				)}
			</>
		);
	};

	render() {
		const { Accounts_ShowFormLogin, theme, navigation } = this.props;
		
		return (
		<>
		<SafeAreaView
			style={{
				backgroundColor: colors.white
			}}
		/>
		<SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
			<StatusBar backgroundColor={colors.white} barStyle='dark-content' />
			<KeyboardAvoidingView
						style={{
					marginTop: 32,
					justifyContent: 'center',
					marginHorizontal: RFValue(36)
				}}
			>
				<Image
					style={styles.images}
					source={require('../static/images/logo.png')}
				/>

				<AuthInput
					marginStyle={{ marginTop: RFValue(60), width: '100%' }}
					value={this.state.user}
					placeholder='Email'
					autoCapitalize='none'
					keyboardType='url'
					onSubmitEditing={() => {}}
					onChangeText={text => this.setState({ user: text.trim(), loginFaild: false })
					}
				/>

				<PasswordInput
					marginStyle={{ marginTop: RFValue(10), width: '100%' }}
					value={this.state.password}
					placeholder='Password'
					autoCapitalize='none'
					keyboardType='url'
					onSubmitEditing={() => {
						this.submit();
					}}
					onChangeText={text => this.setState({ password: text, loginFaild: false })
					}
				/>

				<TouchableOpacity
					onPress={() => {
						this.props.navigation.navigate('ForgotPassword');
					}}
					activeOpacity={0.5}
					style={{ marginTop: RFValue(8), alignSelf: 'flex-end' }}
				>
					<Text
						style={[exStyles.infoLink14Med, { color: colors.primaryColor }]}
					>
						Forgot Password?
					</Text>
				</TouchableOpacity>

				<FormButton
					title='Sign In'
					extraStyle={{
						marginTop: RFValue(20),
						backgroundColor: '#F6A83B',
						borderColor: '#F6A83B'
					}}
					onPress={() => {
						this.submit();
					}}
				/>

				{this.state.loginFaild && (
					<Text
						style={[
							exStyles.infoLink14Med,
							{
								marginTop: RFValue(20),
								fontSize: RFValue(15),
								color: 'red',
								justifyContent: 'center',
								alignItems: 'center',
								alignSelf: 'center'
							}
						]}
					>
						Invalid Email or Password, Try Again
					</Text>
				)}

				<View
					style={{
						flexDirection: 'row',
						alignSelf: 'center',
						justifyContent: 'center',
						alignItems: 'center',
						marginTop: RFValue(20)
					}}
				>
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
						]}
					>
						Don't have an account?
					</Text>
					<TouchableOpacity
						onPress={() => {
							this.props.navigation.navigate('Signup', {
								header: 'Sign up',
								url: VISITORS
							});
						}}
					>
						<Text
							style={[
								exStyles.infoLink14Med,
								{ color: colors.secondaryColor }
							]}
						>
							{' '}
							Sign Up Here
						</Text>
					</TouchableOpacity>
				</View>
			</KeyboardAvoidingView>
			<LoadingDialog visible={this.state.loading} />
			<TouchableOpacity
				style={styles.btnFloatingBack}
				onPress={() => {
					navigation.goBack();
				}}
			>
				<Image
					style={styles.imgBack}
					source={require('../static/icons/NextIcon.png')}
				/>
			</TouchableOpacity>
		</SafeAreaView>
	</>)
		// return (
		// 	<FormContainer theme={theme} testID='login-view'>
		// 		<FormContainerInner>
		// 			<LoginServices separator={Accounts_ShowFormLogin} navigation={navigation} />
		// 			{this.renderUserForm()}
		// 		</FormContainerInner>
		// 	</FormContainer>
		// );
	}
}

const mapStateToProps = (state: any) => ({
	server: state.server.server,
	Site_Name: state.settings.Site_Name,
	Accounts_ShowFormLogin: state.settings.Accounts_ShowFormLogin,
	Accounts_RegistrationForm: state.settings.Accounts_RegistrationForm,
	Accounts_RegistrationForm_LinkReplacementText: state.settings.Accounts_RegistrationForm_LinkReplacementText,
	isFetching: state.login.isFetching,
	failure: state.login.failure,
	error: state.login.error && state.login.error.data,
	Accounts_EmailOrUsernamePlaceholder: state.settings.Accounts_EmailOrUsernamePlaceholder,
	Accounts_PasswordPlaceholder: state.settings.Accounts_PasswordPlaceholder,
	Accounts_PasswordReset: state.settings.Accounts_PasswordReset,
	inviteLinkToken: state.inviteLinks.token
});

const mapDispatchToProps = (dispatch: any) => ({
	connectServer: (server, certificate, username, fromServerHistory) => dispatch(serverRequest(server, certificate, username, fromServerHistory)),
	loginRequest: (params: any) => dispatch(loginRequestAction(params))
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(LoginView));
