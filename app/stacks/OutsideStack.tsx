import React from 'react';
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack';
import { connect } from 'react-redux';

import { ThemeContext } from '../theme';
import { ModalAnimation, StackAnimation, defaultHeader, themedHeader } from '../utils/navigation';
// Outside Stack
import NewServerView from '../views/NewServerView';
import WorkspaceView from '../views/WorkspaceView';
import LoginView from '../views/LoginView';
import ForgotPasswordView from '../views/ForgotPasswordView';
import SendEmailConfirmationView from '../views/SendEmailConfirmationView';
import RegisterView from '../views/RegisterView';
import LegalView from '../views/LegalView';
import AuthenticationWebView from '../views/AuthenticationWebView';
import { OutsideModalParamList, OutsideParamList } from './types';

import EventListView from '../views/NewServerView/EventListView';
import EventInfoView from '../views/NewServerView/EventInfoView';
import ErrorPage404 from '../views/ErrorPage404';
import FAQ from '../views/NewServerView/FAQ';
import ComingSoonView from '../views/NewServerView/ComingSoonView';
import WebviewScreen from '../views/WebviewScreen';
// import Signup from '../views/Signup'; 
import Signup from '../views/SignUp/Signup';
import ForgotPassword from '../views/ForgotPassword';
// import ForgotPassword from '../views/ForgotPassword';

// Outside
const Outside = createStackNavigator<OutsideParamList>();
const _OutsideStack = () => {
	const { theme } = React.useContext(ThemeContext);

	return (
		<Outside.Navigator screenOptions={{ ...defaultHeader, ...themedHeader(theme), ...StackAnimation } as StackNavigationOptions}>
			<Outside.Screen name='NewServerView' component={NewServerView} options={NewServerView.navigationOptions} />
			<Outside.Screen name='WorkspaceView' component={WorkspaceView} options={WorkspaceView.navigationOptions} />
			<Outside.Screen
				name='EventListView'
				component={EventListView}
				options={{ headerShown: false}}
			/>
			<Outside.Screen
				name='EventInfoView'
				component={EventInfoView}
				options={{headerShown: false}}
			/>
			<Outside.Screen
				name='ErrorPage404'
				component={ErrorPage404}
				options={{ headerShown: false }}
			/>
			<Outside.Screen
				name='OutSideWebviewScreen'
				component={WebviewScreen}
				options={{ headerShown: false }}
			/>
			<Outside.Screen
				name='FAQ'
				component={FAQ}
				options={{ headerShown: false }}
			/>
			<Outside.Screen
				name='ComingSoonView'
				component={ComingSoonView}
				options={{ headerShown: false }}
			/>
			<Outside.Screen
				name='Signup'
				component={Signup}
				options={{ headerShown: false }}
			/>
			<Outside.Screen name='LoginView' component={LoginView} options={{headerShown: false}} />
			<Outside.Screen name='ForgotPassword' component={ForgotPassword} options={{ headerShown: false}} />
			<Outside.Screen name='SendEmailConfirmationView' component={SendEmailConfirmationView} />
			<Outside.Screen name='RegisterView' component={RegisterView} options={RegisterView.navigationOptions} />
			<Outside.Screen name='LegalView' component={LegalView} options={LegalView.navigationOptions} />
		</Outside.Navigator>
	);
};

const mapStateToProps = (state: any) => ({
	root: state.app.root
});

const OutsideStack = connect(mapStateToProps)(_OutsideStack);

// OutsideStackModal
const OutsideModal = createStackNavigator<OutsideModalParamList>();
const OutsideStackModal = () => {
	const { theme } = React.useContext(ThemeContext);

	return (
		<OutsideModal.Navigator mode='modal' screenOptions={{ ...defaultHeader, ...themedHeader(theme), ...ModalAnimation }}>
			<OutsideModal.Screen name='OutsideStack' component={OutsideStack} options={{ headerShown: false }} />
			<OutsideModal.Screen
				name='AuthenticationWebView'
				component={AuthenticationWebView}
				options={AuthenticationWebView.navigationOptions}
			/>
		</OutsideModal.Navigator>
	);
};

export default OutsideStackModal;
