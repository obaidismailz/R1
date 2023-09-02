import React from 'react';
import { Text, StyleSheet } from 'react-native';

const Smily = ({ ...props }) => (props.id == 'happy' ? (
	<Text style={styles.iconSize}>😄</Text>
) : props.id == 'loved' ? (
	<Text style={styles.iconSize}>😍</Text>
) : props.id == 'sad' ? (
	<Text style={styles.iconSize}>😞</Text>
) : props.id == 'so_sad' ? (
	<Text style={styles.iconSize}>😭</Text>
) : props.id == 'angry' ? (
	<Text style={styles.iconSize}>😠</Text>
) : props.id == 'confused' ? (
	<Text style={styles.iconSize}>😕</Text>
) : props.id == 'smirk' ? (
	<Text style={styles.iconSize}>😏</Text>
) : props.id == 'broken' ? (
	<Text style={styles.iconSize}>💔</Text>
) : props.id == 'expressionless' ? (
	<Text style={styles.iconSize}>😑</Text>
) : props.id == 'cool' ? (
	<Text style={styles.iconSize}>😎</Text>
) : props.id == 'funny' ? (
	<Text style={styles.iconSize}>😂</Text>
) : props.id == 'tired' ? (
	<Text style={styles.iconSize}>😫</Text>
) : props.id == 'lovely' ? (
	<Text style={styles.iconSize}>❤</Text>
) : props.id == 'blessed' ? (
	<Text style={styles.iconSize}>😇</Text>
) : props.id == 'shocked' ? (
	<Text style={styles.iconSize}>😱</Text>
) : props.id == 'sleepy' ? (
	<Text style={styles.iconSize}>😴</Text>
) : props.id == 'pretty' ? (
	<Text style={styles.iconSize}>☺</Text>
) : props.id == 'bored' ? (
	<Text style={styles.iconSize}>😒</Text>
) : null);

export default Smily;

const styles = StyleSheet.create({
	iconSize: {
		fontSize: 18
	}
});
