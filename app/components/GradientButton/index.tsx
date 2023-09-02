import React from 'react';
import { StyleSheet, Text } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import LinearGradient from 'react-native-linear-gradient';

import { themes } from '../../constants/colors';
import sharedStyles from '../../views/Styles';
import ActivityIndicator from '../../containers/ActivityIndicator';

interface IButtonProps {
	title: string;
	type: string;
	onPress(): void;
	disabled: boolean;
	backgroundColor: string;
	loading: boolean;
	theme: string;
	color: string;
	fontSize: any;
	style: any;
	styleText?: any;
	testID: string;
}

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 14,
		justifyContent: 'center',
		borderRadius: 6
	},
	text: {
		fontSize: 18,
		...sharedStyles.textMedium,
		...sharedStyles.textAlignCenter
	},
	disabled: {
		opacity: 0.5,
	}
});

export default class GradientButton extends React.PureComponent<Partial<IButtonProps>, any> {
	static defaultProps = {
		title: 'Press me!',
		type: 'primary',
		onPress: () => alert('It works!'),
		disabled: false,
		loading: false
	};

	render() {
		const { title, type, onPress, disabled, backgroundColor, color, loading, style, theme, fontSize, styleText,height, ...otherProps } =
			this.props;
		const isPrimary = type === 'primary';

		let textColor =  isPrimary ? themes[theme!].buttonText : themes[theme!].buttonTextPink ;

		if (color) {
			textColor = color;
		}

		return (
			<LinearGradient style={[style,{ borderRadius: 6, padding: isPrimary ? 0:  1 }]} start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#8490FF', '#FF6FAB']}>
				<Touchable
					onPress={onPress}
					disabled={disabled || loading}
					style={[
						styles.container,
						{height: height},
						backgroundColor
							? { backgroundColor }
							: { backgroundColor: isPrimary ? 'transparent' : themes[theme!].secondaryButton },
						disabled && styles.disabled,
						
					]}
					accessibilityLabel={title}
					{...otherProps}>
					{loading ? (
						<ActivityIndicator color={textColor} />
					) : (
						<Text style={[styles.text, { color: textColor }, fontSize && { fontSize }, styleText]} accessibilityLabel={title}>
							{title}
						</Text>
					)}
				</Touchable>
			</LinearGradient>
		);
	}
}
