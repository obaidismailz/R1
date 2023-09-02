import React, { useState, useEffect, memo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as HeaderButton from '../../../../../containers/HeaderButton';
import { withDimensions } from '../../../../../dimensions';
import { withTheme } from '../../../../../theme';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

const CheckInView = ({ navigation, isMasterDetail, route, ...props }) => {
	const { theme } = props;

	useEffect(() => {
		setHeader();
	}, []);

	setHeader = () => {
		navigation.setOptions({
			title: 'Check In',
			headerLeft: isMasterDetail ? undefined : () => <HeaderButton.CancelModal onPress={close} />
		});
	};

	close = () => {
		navigation.goBack();
	};

	onSelectPlace = value => {
		route.params.selectedPlace(value);
		navigation.goBack();
	};

	return (
		<View style={styles.view}>
			<GooglePlacesAutocomplete
				minLength={2} // minimum length of text to search
				autoFocus={true}
				returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
				listViewDisplayed='auto' // true/false/undefined
				fetchDetails={true}
				renderDescription={row => row.description}
				placeholder='Search Places'
				onPress={(data, details = null) => {
					// 'details' is provided when fetchDetails = true
					this.onSelectPlace(data.description);
				}}
				query={{
					key: 'AIzaSyBpb3cDLn6K6bqrO3j-uraVfyCrLQmaJ-g',
					language: 'en',
					types: 'address'
				}}
				styles={{
					textInputContainer: {
						width: '100%'
					},
					textInput: {
						height: 38,
						color: '#5d5d5d',
						fontSize: 16
					},
					description: {
						fontWeight: 'bold'
					},
					predefinedPlacesDescription: {
						color: '#1faadb'
					}
				}}
				currentLocation={true}
				currentLocationLabel='Current location'
				debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	view: {
		flex: 1,
		alignItems: 'center',
		backgroundColor: '#E5E5E5'
	}
});

export default withDimensions(withTheme(memo(CheckInView)));
