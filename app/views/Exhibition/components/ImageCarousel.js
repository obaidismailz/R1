import FastImage from '@rocket.chat/react-native-fast-image';
import * as React from 'react';
import {
	StyleSheet, View, ScrollView, Dimensions, Image
} from 'react-native';

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

class ImageCarousel extends React.Component {
	scrollRef = React.createRef();

	constructor(props) {
		super(props);

		this.state = {
			selectedIndex: 0
		};
		this.scrollRef = React.createRef();
	}

	componentDidMount = () => {
		setInterval(() => {
			this.setState(
				prev => ({
					selectedIndex:
						prev.selectedIndex === this.props.images.length - 1
							? 0
							: prev.selectedIndex + 1
				}),
				() => {
					this.scrollRef.current.scrollTo({
						animated: true,
						x: DEVICE_WIDTH * this.state.selectedIndex,
						y: 0
					});
				}
			);
		}, 3000);
	};

	setSelectedIndex = (event) => {
		const { contentOffset } = event.nativeEvent;
		const viewSize = event.nativeEvent.layoutMeasurement;

		// Divide the horizontal offset by the width of the view to see which page is visible
		const selectedIndex = Math.floor(contentOffset.x / viewSize.width);
		this.setState({ selectedIndex });
	};

	render() {
		const { images } = this.props;
		const { selectedIndex } = this.state;
		return (
			<View>
				<ScrollView
					horizontal
					pagingEnabled
					onMomentumScrollEnd={this.setSelectedIndex}
					ref={this.scrollRef}
				>
					{images.map(image => (
						<FastImage
							style={styles.backgroundImage}
							source={{ uri: image.file }}
							key={image.file}
						/>
					))}
				</ScrollView>
				<View style={styles.circleDiv}>
					{images.map((image, i) => (
						<View
							style={[
								styles.whiteCircle,
								{ opacity: i === selectedIndex ? 0.5 : 1 }
							]}
							key={image.file}
							active={i === selectedIndex}
						/>
					))}
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	backgroundImage: {
		height: Dimensions.get('window').width * 0.7,
		width: Dimensions.get('window').width
	},
	circleDiv: {
		position: 'absolute',
		bottom: 15,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		width: '100%',
		height: 10
	},
	whiteCircle: {
		width: 6,
		height: 6,
		borderRadius: 3,
		margin: 5,
		backgroundColor: '#fff'
	}
});

export default ImageCarousel;
