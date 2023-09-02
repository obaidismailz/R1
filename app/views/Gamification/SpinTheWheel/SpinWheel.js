import React from 'react';
import {
	StyleSheet,
	View,
	Text as RNText,
	Dimensions,
	Animated
} from 'react-native';
import Svg, {
	G, Path, Text as SvgText, TSpan
} from 'react-native-svg';
import * as d3Shape from 'd3-shape';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { colors } from '@styles';
import { snap } from '@popmotion/popcorn';
import { RFValue } from 'react-native-responsive-fontsize';

const { width } = Dimensions.get('screen');
const { height } = Dimensions.get('screen');

const wheelSize = width * 0.6;
const fontSize = 26;
const oneTurn = 360;
const knobFill = '#407A93';

const makeWheel = (segments) => {
	const data = Array.from({ length: segments.length }).fill(1);
	const arcs = d3Shape.pie()(data);

	return arcs.map((arc, index) => {
		const instance = d3Shape
			.arc()
			.padAngle(0.01)
			.outerRadius(width / 2)
			.innerRadius(20);

		return {
			path: instance(arc),
			color: segments[index].color,
			value: segments[index].label,
			centroid: instance.centroid(arc),
			score: segments[index].score
		};
	});
};

export default class SpinWheel extends React.Component {
	_wheelPaths = makeWheel(this.props.data);

	_angle = new Animated.Value(0);

	angle = 0;

	angleBySegment = oneTurn / this.props.data.length;

	angleOffset = this.angleBySegment / 2;

	state = {
		enabled: true,
		finished: false,
		winner: null,
		segment: this.props.data.length
	};

	componentDidMount() {
		this._angle.addListener((event) => {
			if (this.state.enabled) {
				this.setState({
					enabled: false,
					finished: false
				});
			}
			this.angle = event.value;
		});
	}

	updateValue = (value) => {
		this.props.onCallBack(value);
	};

	onPan = ({ nativeEvent }) => {
		if (nativeEvent.state === State.END) {
			const { velocityY } = nativeEvent;
			this.spin();
		}
	};

	spin = () => {
		Animated.decay(this._angle, {
			velocity: Math.floor(Math.random() * -1000),
			deceleration: 0.999,
			useNativeDriver: true
		}).start(() => {
			this._angle.setValue(this.angle % oneTurn);
			const snapTo = snap(oneTurn / this.state.segment);
			Animated.timing(this._angle, {
				toValue: snapTo(this.angle),
				duration: 400,
				useNativeDriver: true
			}).start(() => {
				const winnerIndex = this._getWinnerIndex();
				this.setState({
					enabled: true,
					finished: true,
					winner: this._wheelPaths[winnerIndex].value
				});
				this.updateValue({
					label: this._wheelPaths[winnerIndex].value,
					score: this._wheelPaths[winnerIndex].score,
					color: this._wheelPaths[winnerIndex].color
				});
			});
		});
	};

	_getWinnerIndex = () => {
		const deg = Math.abs(Math.round(this.angle % oneTurn));
		return Math.floor(deg / this.angleBySegment);
	};

	_renderWinner = () => (
		<RNText style={styles.winnerText}>Winner is: {this.state.winner}</RNText>
	);

	renderKnob = () => {
		const knobSize = 40;
		const kNOB = Animated.modulo(
			Animated.divide(
				Animated.modulo(
					Animated.subtract(this._angle, this.angleOffset),
					oneTurn
				),
				new Animated.Value(this.angleBySegment)
			),
			1
		);
		return (
			<Animated.View
				style={{
					width: RFValue(knobSize),
					height: RFValue(knobSize * 2),
					alignSelf: 'center',
					justifyContent: 'center',
					position: 'absolute',
					top: RFValue(wheelSize * 0.3)
				}}
			>
				<Svg
					width={RFValue(knobSize)}
					stroke='#336276'
					height={RFValue((knobSize * 100) / 57)}
					viewBox='0 0 57 100'
					style={{
						transform: [{ rotate: '180deg' }]
					}}
				>
					<Path
						d='M28.034,0C12.552,0,0,12.552,0,28.034S28.034,100,28.034,100s28.034-56.483,28.034-71.966S43.517,0,28.034,0z   M28.034,40.477c-6.871,0-12.442-5.572-12.442-12.442c0-6.872,5.571-12.442,12.442-12.442c6.872,0,12.442,5.57,12.442,12.442  C40.477,34.905,34.906,40.477,28.034,40.477z'
						fill={knobFill}
					/>
				</Svg>
			</Animated.View>
		);
	};

	renderWheel = () => (
		<View
			style={[
				styles.container,
				{ backgroundColor: 'white', borderRadius: width * 0.78, padding: 8 }
			]}
		>
			<Animated.View
				style={{
					alignItems: 'center',
					justifyContent: 'center',
					transform: [
						{
							rotate: this._angle.interpolate({
								inputRange: [-oneTurn, 0, oneTurn],
								outputRange: [`-${ oneTurn }deg`, '0deg', `${ oneTurn }deg`]
							})
						}
					]
				}}
			>
				<Svg
					width={RFValue(wheelSize)}
					height={RFValue(wheelSize)}
					viewBox={`0 0 ${ width } ${ width }`}
					style={{
						transform: [{ rotate: `-${ this.angleOffset }deg` }]
					}}
				>
					<G y={width / 2} x={width / 2}>
						{this._wheelPaths.map((arc, i) => {
							const [x, y] = arc.centroid;
							const number = arc.value;
							return (
								<G key={`arc-${ i }`}>
									<Path d={arc.path} fill={arc.color} />
									<G
										rotation={
											(i * oneTurn) / this.state.segment + this.angleOffset
										}
										origin={`${ x }, ${ y }`}
									>
										<SvgText
											x={x}
											y={y - 70}
											fill='white'
											fontSize={fontSize}
											textAnchor='middle'
										>
											<TSpan x={x} dy={fontSize}>
												{arc.value}
											</TSpan>
										</SvgText>
									</G>
								</G>
							);
						})}
					</G>
				</Svg>
			</Animated.View>
			{this.renderKnob()}
		</View>
	);

	render() {
		return (
			<PanGestureHandler>
				<View style={styles.container}>{this.renderWheel()}</View>
			</PanGestureHandler>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 8,
		marginBottom: 12
	}
});
