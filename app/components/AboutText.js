import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { PropTypes } from 'prop-types';
import { colors, exStyles } from '@styles';
import { themes } from '../constants/colors';

const AboutText = ({ ...props }) => {
	const [showMoreText, setShowMoreText] = useState(false);
	const [numberOfLines, setNumberOfLines] = useState(0);

	const onTextLayout = useCallback(e => {
		setNumberOfLines(e.nativeEvent.lines.length);
	}, []);

	const [wordsCount, setWordsCount] = useState(0);

	useEffect(() => {
		setWordsCount(props.text.trim().split(/\s+/).length);
	}, []);

	return (
		<>
			<Text
				numberOfLines={showMoreText ? undefined : 2}
				style={[
					exStyles.infoDetailR16,
					{
						textAlign: props.justify ? 'auto' : 'center',
						color: colors.primaryText,
						flex: 1
					}
				]}
				onTextLayout={onTextLayout}>
				{props.about == ''
					? props.text.replace(/(<([^>]+)>)/gi, '')
					: `About${props.about}:` + ` ${props.text.replace(/(<([^>]+)>)/gi, '')}`}
			</Text>
			{wordsCount >= 20 ? (
				<Pressable
					style={{ alignItems: 'center' }}
					onPress={() => {
						showMoreText ? setShowMoreText(false) : setShowMoreText(true);
					}}>
					<Text
						style={[
							exStyles.infoDetailR16,
							{
								opacity: 0.5,
								color: colors.primaryText,
								flex: 1,
								flexWrap: 'wrap'
							}
						]}>
						{showMoreText ? 'See less' : 'See more'}
					</Text>
				</Pressable>
			) : null}
		</>
	);
};

export default AboutText;
