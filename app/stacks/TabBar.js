import React, { useState, useEffect } from 'react';

import { View, TouchableOpacity, Dimensions, StyleSheet, Animated, Keyboard, SafeAreaView } from 'react-native';
import { colors, exStyles } from '@styles';
import BottomMenuTab from './BottomMenuTab';
import { themes } from '../constants/colors';

const totalWidth = Dimensions.get('screen').width;

const TabBar = ({ theme, state, descriptors, navigation }) => {
	const [translateValue] = useState(new Animated.Value(0));
	const tabWidth = totalWidth / state.routes.length;
	const [isKeyboardVisible, setKeyboardVisible] = useState(false);
	const [first, setFirst] = useState(false);

	useEffect(() => {
		const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
			setKeyboardVisible(true); // or some other action
			setFirst(true); // or some other action
		});
		const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
			setKeyboardVisible(false); // or some other action
		});

		return () => {
			keyboardDidHideListener.remove();
			keyboardDidShowListener.remove();
		};
	}, []);

	function renderTab() {
		if (!isKeyboardVisible) {
			return (
				<SafeAreaView
					style={[
						style.tabContainer,
						{
							width: totalWidth,
							backgroundColor: colors.secondaryColor
						}
					]}>
					<View style={{ flexDirection: 'column' }}>
						<Animated.View
							style={[
								style.slider,
								{ backgroundColor: colors.secondaryColor },
								{ backgroundColor: colors.white, zIndex: 100 },
								{
									transform: [{ translateX: translateValue }],
									width: tabWidth - 20
								}
							]}
						/>
						<View style={{ flexDirection: 'row', paddingTop: 4 }}>
							{state.routes.map((route, index) => {
								const { options } = descriptors[route.key];

								const label =
									options.tabBarLabel !== undefined
										? options.tabBarLabel
										: options.title !== undefined
										? options.title
										: route.name;

								const isFocused = state.index === index;
								if (isFocused) {
									Animated.spring(translateValue, {
										toValue: index * tabWidth,
										velocity: 12,
										useNativeDriver: true
									}).start();
								}

								const onPress = () => {
									const event = navigation.emit({
										type: 'tabPress',
										target: route.key,
										canPreventDefault: true
									});
									if (!isFocused && !event.defaultPrevented) {
										navigation.navigate(route.name);
									}
								};

								return (
									<TouchableOpacity
										accessibilityRole='button'
										accessibilityStates={isFocused ? ['selected'] : []}
										accessibilityLabel={options.tabBarAccessibilityLabel}
										onPress={() => onPress()}
										style={{
											flex: 1,
											backgroundColor: themes.dark.tabBackground,
											backgroundColor: colors.secondaryColor
										}}
										key={index}>
										<BottomMenuTab theme={theme} theme='dark' iconName={label.toString()} index={index} isCurrent={isFocused} />
									</TouchableOpacity>
								);
							})}
						</View>
					</View>
				</SafeAreaView>
			);
		} else {
			return null;
		}
	}

	return renderTab();
};

const style = StyleSheet.create({
	tabContainer: {
		shadowOffset: {
			width: 0,
			height: -1
		},
		shadowOpacity: 0.1,
		elevation: 10,
		borderTopColor: '#e5e5e5',
		paddingVertical: 0
	},
	slider: {
		height: 3,
		left: 10,
		borderBottomLeftRadius: 3,
		borderBottomRightRadius: 3,
		width: totalWidth / 2
	}
});

export default TabBar;
