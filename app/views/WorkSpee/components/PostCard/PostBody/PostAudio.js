import React, { useState, useRef, useEffect } from 'react';
import {
	View, StyleSheet, TouchableOpacity, Text
} from 'react-native';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/FontAwesome5';
// import Icon1 from "react-native-vector-icons/MaterialIcons";

// for video posts
import Video from 'react-native-video';
import MediaControls, { PLAYER_STATES } from 'react-native-media-controls';

// for audio files and posts
// import SoundPlayer from "react-native-sound-player";
import TrackPlayer, {
	useTrackPlayerProgress,
	usePlaybackState
} from 'react-native-track-player';

const PostAudio = (props) => {
	const { position, duration } = useTrackPlayerProgress();
	const isPlayerReady = useRef(false);
	const playbackState = usePlaybackState();
	const [trackId, setTrackId] = useState(null);
	const [playing, setPlaying] = useState();

	const [songUrl] = useState(
		props.type == 1 ? props.url : props.item.postFile.url
	);
	const [songId] = useState(props.type == 1 ? 0 : props.item.id);

	const formatTime = (secs) => {
		const minutes = Math.floor(secs / 60);
		let seconds = Math.ceil(secs - minutes * 60);
		if (seconds < 10) {
			seconds = `0${ seconds }`;
		}
		return `${ minutes }:${ seconds }`;
	};

	function pause() {
		setPlaying(false);
		TrackPlayer.pause();
	}

	const handleChange = (val) => {
		TrackPlayer.seekTo(val);
	};

	function play(id, url) {
		TrackPlayer.setupPlayer().then(async() => {
			// await TrackPlayer.reset();
			await TrackPlayer.add({
				id,
				url
			});
			// const track = await TrackPlayer.getCurrentTrack();
			// const trackObject = await TrackPlayer.getTrack(track);
			// setTrackId(trackObject.id);
			// setTrackId(props.onClickItem);
			// itemid = index;
			// alert(trackId);
			// alert(id);

			await TrackPlayer.play();
			setPlaying(true);
			// setloading(false);
			isPlayerReady.current = true;
		});
	}

	return (
		<View style={{ marginVertical: 10 }}>
			<View style={styles.musicTextContainer}>
				<Text>{props.type == 1 ? '' : props.item.postFile.postFileName}</Text>
			</View>
			<View style={styles.controls}>
				<TouchableOpacity
					style={styles.control}
					onPress={() =>
						// playbackState === TrackPlayer.STATE_PAUSED ||
						// playbackState === TrackPlayer.STATE_STOPPED
						(playing ? pause() : play(songId, songUrl))
					}
				>
					{
						// playbackState === TrackPlayer.STATE_PLAYING
						playing ? (
							<Icon name='pause' size={25} color='#1D87F1' />
						) : (
							<Icon name='play' size={25} color='#1D87F1' />
						)
					}
				</TouchableOpacity>
				<View style={styles.seekBarContainer}>
					<Slider
						style={{
							flex: 1,
							marginRight: 10
						}}
						minimumValue={0}
						value={playing ? position : 0}
						maximumValue={playing ? duration : 0}
						minimumTrackTintColor='#6CD2FF'
						onSlidingComplete={handleChange}
						maximumTrackTintColor='#C4C4C4'
						thumbTintColor='#1D87F1'
					/>
				</View>
				<View style={styles.timerContainer}>
					<Text style={styles.timers}>
						{playing ? formatTime(position) : formatTime(duration)}
					</Text>
				</View>
			</View>
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
	// styling music files
	musicTextContainer: {
		alignItems: 'center',
		marginBottom: 5
	},
	controls: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start',
		height: 50,
		backgroundColor: '#F4F4F4',
		marginHorizontal: 15,
		borderRadius: 30
	},
	control: {
		marginHorizontal: 10
	},
	seekBarContainer: {
		flex: 1,
		borderRadius: 15,
		alignSelf: 'center'
	},
	timers: {
		color: '#000000',
		fontSize: 14,
		fontWeight: '500',
		fontStyle: 'normal',
		lineHeight: 16
	},
	timerContainer: {
		marginRight: 10
	}
});

export default PostAudio;
