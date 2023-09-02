import MaskedView from '@react-native-community/masked-view';
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { themes } from '../constants/colors';
import sharedStyles from '../views/Styles';


interface ITextProps {
	title: string;
	theme: string;
	fontSize: any;
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
		fontSize: 16,
		...sharedStyles.textMedium,
        ...sharedStyles.textAlignCenter,
	},
});

export default class GradientText extends React.PureComponent<Partial<ITextProps>, any> {
	static defaultProps = {
		title: 'text!',
	};

	render() {
		const { title, theme, fontSize, styleText, ...otherProps } =
			this.props;
        return (
            <MaskedView maskElement={
                <Text style={styles.text} >{title }</Text>
            }>
			<LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#F6A83B', '#F6A83B']}>
				<Text style={[styles.text, { opacity: 0 }, fontSize && { fontSize }]} accessibilityLabel={title} {...otherProps}>
					{title}
				</Text>
            </LinearGradient>
            </MaskedView>
		);
	}
}
