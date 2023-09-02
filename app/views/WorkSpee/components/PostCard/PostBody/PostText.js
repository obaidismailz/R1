import React, { memo, useCallback, useState } from 'react';
import {
	Linking, StyleSheet, Pressable, Text
} from 'react-native';
import { colors, exStyles } from '@styles';
import ParsedText from 'react-native-parsed-text';
import { RFValue } from 'react-native-responsive-fontsize';
import { withDimensions } from '../../../../../dimensions';
import { withTheme } from '../../../../../theme';
import Navigation from '../../../../../lib/Navigation';

const PostText = ({ ...props }) => {
	const text = props.postText;

	const [showMoreText, setShowMoreText] = useState(false);
	const [numberOfLines, setNumberOfLines] = useState(0);

	const onTextLayout = useCallback((e) => {
		setNumberOfLines(e.nativeEvent.lines.length);
	}, []);

	function handleUrlPress(url, matchIndex) {
		Linking.openURL(url);
	}

	function handlePhonePress(phone, matchIndex) {
		Linking.openURL(`tel:${ phone }`);
	}

	function handleNamePress(name, matchIndex) {
		const username = name.replace(/[^a-zA-Z ]/g, '');
		Navigation.navigate('LoopUserProfile', { username });
	}

	function handleEmailPress(email, matchIndex) {
		Linking.openURL(`mailto:${ email }`);
	}

	function handleUrlDecode(url) {
		return decodeURI(url);
	}

	function renderMentionText(matchingString, matches) {
		const match = matchingString.replace(/[^a-zA-Z ]/g, '');
		return match;
	}

	function renderHashTagText(matchingString, matches) {
		const match = matchingString.replace(/[\[\]']+/g, '');
		return match;
	}

	return (
		<>
			{props.postText == null || props.postText == '' ? null : (
				<>
					<ParsedText
						numberOfLines={showMoreText ? undefined : 3}
						onTextLayout={onTextLayout}
						style={{
							fontSize: 16,
							lineHeight: 24,
							fontWeight: '400',
							fontStyle: 'normal',
							textAlign: 'justify',
							letterSpacing: 0.3,
							color: colors.primaryText,
							marginHorizontal: RFValue(16)
						}}
						parse={[
							{
								type: 'url',
								style: styles.text,
								onPress: handleUrlPress,
								renderText: handleUrlDecode
							},
							{ type: 'phone', style: styles.text, onPress: handlePhonePress },
							{ type: 'email', style: styles.text, onPress: handleEmailPress },
							{
								pattern: /@\[(\w+)\]/,
								style: styles.text,
								onPress: handleNamePress,
								renderText: renderMentionText
							},
							{
								pattern: /#\[(\w+)\]/,
								style: styles.text,
								renderText: renderHashTagText
							}
						]}
						childrenProps={{ allowFontScaling: true }}
					>
						{text == null ? '' : text}
					</ParsedText>
					{numberOfLines >= 3 ? (
						<Pressable
							style={{ marginHorizontal: RFValue(16) }}
							onPress={() => {
								showMoreText ? setShowMoreText(false) : setShowMoreText(true);
							}}
						>
							<Text
								style={[
									exStyles.infoDetailR16,
									{
										opacity: 0.5,
										color: colors.primaryText,
										flex: 1,
										flexWrap: 'wrap'
									}
								]}
							>
								{showMoreText ? 'See less' : 'See more'}
							</Text>
						</Pressable>
					) : null}
				</>
			)}
		</>
	);
};

const styles = StyleSheet.create({
	text: {
		color: colors.secondaryColor,
		fontSize: RFValue(14),
		fontWeight: '600'
	}
});

export default withDimensions(withTheme(memo(PostText)));
