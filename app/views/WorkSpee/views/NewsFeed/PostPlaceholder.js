import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import PropTypes from 'prop-types';
import { themes } from '../../../../constants/colors';
import { withTheme } from '../../../../theme';
// import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const PostPlaceholder = React.memo(({ theme }) => {
	return (
		<>
			<View
				style={{
					marginTop: 2,
					backgroundColor: 'white',
					height: 250,
					marginBottom: 6
				}}></View>
		</>
	);
});

PostPlaceholder.propTypes = {
	theme: PropTypes.string
};

export default withTheme(PostPlaceholder);
