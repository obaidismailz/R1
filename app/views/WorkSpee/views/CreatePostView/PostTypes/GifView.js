import React, { useState, useEffect, memo } from 'react';
import { View, TextInput, StyleSheet, FlatList, Image, Dimensions } from 'react-native';

import * as HeaderButton from '../../../../../containers/HeaderButton';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

import { withTheme } from '../../../../../theme';
import { withDimensions } from '../../../../../dimensions';
import { themes } from '../../../../../constants/colors';
import StatusBar from '../../../../../containers/StatusBar';
import { SafeAreaView } from 'react-native';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const GifView = ({ navigation, isMasterDetail, route, ...props }) => {
	const { theme } = props;

	const [gifs, setGifs] = useState([]);
	const [term, updateTerm] = useState('burger');

	useEffect(() => {
		setHeader();
		fetchGifs();
	}, []);

	setHeader = () => {
		navigation.setOptions({
			title: 'Gif',
			headerLeft: isMasterDetail ? undefined : () => <HeaderButton.CancelModal onPress={close} />
		});
	};

	close = () => {
		navigation.goBack();
	};

	const fetchGifs = async () => {
		try {
			const API_KEY = 'MdK0fD4ureIXgYRMZPUatDTRmeThSvgM';
			const BASE_URL = 'https://api.giphy.com/v1/gifs/search';
			const resJson = await fetch(`${BASE_URL}?api_key=${API_KEY}&q=${term}`);
			const res = await resJson.json();
			setGifs(res.data);
		} catch (error) {
			console.warn(error);
		}
	};

	function onEdit(newTerm) {
		updateTerm(newTerm);
		fetchGifs();
	}

	onSelectGif = url => {
		let newurl = url.substring(0, url.length - 5);
		route.params.gifUrl(newurl);
		navigation.goBack();
	};

	return (
		<SafeAreaView theme={theme} style={{ backgroundColor: 'white', flex: 1 }}>
			<View
				style={{
					flex: 1,
					alignItems: 'center'
				}}>
				<StatusBar theme={theme} backgroundColor={themes[theme].headerBackground} />
				<View style={styles.searchFieldContainer}>
					<TextInput
						placeholder='Search Giphy'
						placeholderTextColor='#000000'
						style={styles.textInput}
						onChangeText={text => onEdit(text)}
					/>
				</View>
				<View style={{ marginHorizontal: 10 }}>
					<FlatList
						data={gifs}
						keyExtractor={(item, index) => index.toString()}
						numColumns={3}
						horizontal={false}
						renderItem={({ item }) => (
							<TouchableWithoutFeedback
								onPress={() => onSelectGif(item.images.original.url)}
								style={{
									flexDirection: 'column',
									margin: 1,
									marginTop: 5
								}}>
								<Image resizeMode='cover' style={styles.image} source={{ uri: item.images.original.url }} />
							</TouchableWithoutFeedback>
						)}
					/>
				</View>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	searchFieldContainer: {
		height: 50,
		backgroundColor: '#ffffff',
		opacity: 0.6,
		marginBottom: 10,
		marginTop: 10,
		marginLeft: 10,
		marginRight: 10,
		borderRadius: 25,

		width: screenWidth * 0.9
	},
	textInput: {
		marginHorizontal: 10,
		height: 50,
		color: '#000000'
	},
	image: {
		width: screenWidth / 3,
		height: 150,
		marginBottom: 5
	}
});

export default withDimensions(withTheme(memo(GifView)));
