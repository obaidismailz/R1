import React, { useState, useRef } from 'react';
import {
	View, StyleSheet, Text, TouchableWithoutFeedback
} from 'react-native';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/FontAwesome5';

// for video posts
import Video from 'react-native-video';

const PostVideo = (props) => {
	const videoPlayer = useRef(null);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0.1);
	const [isFullScreen, setIsFullScreen] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [paused, setPaused] = useState(true);

	const [overlay, setOverlay] = useState(false);

	const overlayTimeOut = () => {
		setOverlay(true);
		setTimeout(() => {
			setOverlay(false);
		}, 3000);
	};

	getTime = (t) => {
		const digit = n => (n < 10 ? `0${ n }` : `${ n }`);
		// const t = Math.round(time);
		const sec = digit(Math.floor(t % 60));
		const min = digit(Math.floor((t / 60) % 60));
		const hr = digit(Math.floor((t / 3600) % 60));
		return `${ hr }:${ min }:${ sec }`; // this will convert sec to timer string
		// 33 -> 00:00:33
		// this is done here
		// ok now the theme is good to look
	};

	const onSlide = (slide) => {
		videoPlayer.current.seek(slide);
	};
	const onLoad = data => setDuration(data.duration); // now here the duration is update on load video
	const onProgress = data => setCurrentTime(data.currentTime);
	// const onLoadStart = (data) => setIsLoading(true);

	const onFullScreen = () => {
		// if (isFullScreen) {
		//   Orientation.lockToPortrait();
		// } else {
		//   Orientation.lockToLandscape();
		// }
		// setIsFullScreen(!isFullScreen);
	};

	return (
		<View style={[styles.postContainer, { aspectRatio: 18 / 14 }]}>
			<Video
				style={styles.mediaPlayer}
				onEnd={() => setPaused(true)}
				onLoad={onLoad}
				// onLoadStart={onLoadStart}
				onProgress={onProgress}
				paused={paused}
				ref={videoPlayer}
				resizeMode='contain'
				onFullScreen={isFullScreen}
				volume={10}
				playInBackground
				playWhenInactive
				repeat
				ignoreSilentSwitch='ignore'
				source={{
					uri: props.videoUrl
				}}
			/>
			<TouchableWithoutFeedback
				onPress={() => {
					overlay ? setOverlay(false) : overlayTimeOut();
				}}
			>
				<View style={styles.overlay}>
					{overlay ? (
						<View style={{ ...styles.overlaySet, backgroundColor: '#0006' }}>
							<Icon
								name={paused ? 'play' : 'pause'}
								style={styles.icon}
								color='#ffffff'
								onPress={() => setPaused(!paused)}
							/>
							<View style={styles.sliderCont}>
								<View style={styles.timer}>
									<Text style={{ color: 'white' }}>{getTime(currentTime)}</Text>
									<View style={{ flexDirection: 'row' }}>
										<Text style={{ color: 'white' }}>{getTime(duration)}</Text>
										<Icon
											name={isFullScreen ? 'compress' : 'expand'}
											color='#ffffff'
											style={{ marginHorizontal: 10, fontSize: 15 }}
											// onPress={onFullScreen}
										/>
									</View>
								</View>
								<Slider
									style={{ marginHorizontal: 10 }}
									minimumValue={0}
									value={currentTime}
									maximumValue={duration}
									maximumTrackTintColor='grey'
									minimumTrackTintColor='white'
									thumbTintColor='white' // now the slider and the time will work
									onValueChange={onSlide} // slier input is 0 - 1 only so we want to convert sec to 0 - 1
								/>
							</View>
						</View>
					) : (
						<View style={{ flex: 1, flexDirection: 'row' }} />
					)}
				</View>
			</TouchableWithoutFeedback>
		</View>
	);
};

const styles = StyleSheet.create({
	postContainer: {
		width: '100%',
		alignItems: 'center',
		alignContent: 'center',
		alignSelf: 'center'
	},

	// Video styling
	toolbar: {
		marginTop: 30,
		backgroundColor: 'white',
		padding: 10,
		borderRadius: 5
	},
	mediaPlayer: {
		position: 'absolute',
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
		backgroundColor: 'black',
		justifyContent: 'center'
	},
	// video overlay
	container: {
		flex: 1
	},
	overlay: {
		...StyleSheet.absoluteFillObject
	},
	overlaySet: {
		flex: 1,
		flexDirection: 'row'
	},
	icon: {
		color: 'white',
		left: 0,
		right: 0,
		top: 150,
		position: 'absolute',
		textAlign: 'center',
		textAlignVertical: 'center',
		fontSize: 25
	},
	sliderCont: {
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 0
	},
	timer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: 10
	},
	// video: { width, height: width * 0.6, backgroundColor: "black" },
	fullscreenVideo: {
		backgroundColor: 'black',
		...StyleSheet.absoluteFill,
		elevation: 1
	}
});

export default PostVideo;
