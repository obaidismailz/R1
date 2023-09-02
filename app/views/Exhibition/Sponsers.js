import * as React from 'react';
import {
	View,
	Dimensions,
	TouchableOpacity,
	StyleSheet,
	Platform,
	Text
} from 'react-native';
import FastImage from '@rocket.chat/react-native-fast-image';
import { colors, exStyles } from '@styles';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import Icon from 'react-native-vector-icons/Ionicons';
import SectionHeader from './components/SectionHeader';
import Navigation from '../../lib/Navigation';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;

export const SLIDER_WIDTH = Dimensions.get('window').width;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7);
export default Sponsers = ({
	lobbybanner, isVideos, videos, ...props
}) => {
	const [index, setIndex] = React.useState(0);
	const carouselRef = React.useRef(null);

	const goForward = () => {
		carouselRef.current.snapToNext();
		setIndex(index + 1);
	};

	React.useEffect(() => {}, []);

	const Card = ({ item, index }, parallaxProps) => (isVideos ? (
		<TouchableOpacity
			activeOpacity={0.6}
			style={styles.shadowBox}
			onPress={() => {
				Navigation.navigate(
					props.isLogin ? 'WebviewScreen' : 'OutSideWebviewScreen',
					{
						title: '',
						link: `https://www.youtube.com/watch?v=${ item.video_id }`
					}
				);
			}}
		>
			<FastImage
				style={styles.bannerImage}
				source={{
					uri: `https://img.youtube.com/vi/${ item.video_id }/hqdefault.jpg`
				}}
				parallaxFactor={0.5}
				{...parallaxProps}
			>
				<Icon
					name='play-circle-outline'
					size={56}
					color='#ffffff'
					style={{ alignSelf: 'center' }}
				/>
			</FastImage>
		</TouchableOpacity>
	) : (
		<TouchableOpacity
			activeOpacity={0.6}
			style={styles.shadowBox}
			onPress={() => (item.link == ''
				? null
				: Navigation.navigate('WebviewScreen', {
					title: item.link,
					link: item.link
						  }))
			}
		>
			<FastImage
				resizeMode='stretch'
				style={styles.bannerImage}
				source={{
					uri: item.mobile_image
				}}
				parallaxFactor={0.5}
				{...parallaxProps}
			/>
		</TouchableOpacity>
	));

	return (
		<>
			{isVideos ? null : (
				<SectionHeader
					title='Our Sponsers'
					onPress={() => {}}
					pressable={false}
				/>
			)}
			<View style={{ marginTop: 24, marginBottom: -32 }}>
				<Carousel
					ref={carouselRef}
					data={isVideos ? videos : lobbybanner}
					renderItem={Card}
					sliderHeight={200}
					sliderWidth={screenWidth}
					itemWidth={screenWidth - 100}
					onSnapToItem={index => setIndex(index)}
				/>
				<Pagination
					dotsLength={isVideos ? videos.length : lobbybanner.length}
					activeDotIndex={index}
					carouselRef={carouselRef}
					dotStyle={{
						width: 10,
						height: 10,
						borderRadius: 5,
						marginHorizontal: -10,
						backgroundColor: 'rgba(0, 0, 0, 0.92)'
					}}
					inactiveDotOpacity={0.4}
					inactiveDotScale={0.6}
					tappableDots
				/>
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	bannerImage: {
		height: 200,
		width: '100%',
		justifyContent: 'center',
		borderRadius: 12
	},
	shadowBox: {
		margin: 8,
		borderWidth: 1,
		borderColor: 'rgba(0,0,0,0.1)',
		borderRadius: 8
	}
});
