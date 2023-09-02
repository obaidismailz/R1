import * as React from 'react';
import {memo, useRef, useState, useEffect, useImperativeHandle} from 'react';
import {
  View,
  Text,
  Image,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  TextInput,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import {Header} from '@components';
import axios from 'axios';
import {RFValue} from 'react-native-responsive-fontsize';
import {colors, exStyles} from '../../styles';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
const Lobby = ({navigation, route}) => {
  useEffect(() => {}, []);

  const TileItem = props => (
    <TouchableOpacity
      style={{flexDirection: 'row', paddingVertical: RFValue(10)}}
      onPress={() => props.onPress && props.onPress()}>
      <Text style={{flex: 1, fontSize: RFValue(14)}}>{props.title}</Text>
      <Image
        style={{
          height: RFValue(25),
          width: RFValue(25),
          resizeMode: 'contain',
        }}
        source={require('@assets/NextIcon.png')}
      />
    </TouchableOpacity>
  );

  return (
    <View style={{flex: 1, backgroundColor: colors.white}}>
      <Header title={'Exhibition'} />
      <ScrollView contentContainerStyle={{paddingHorizontal: RFValue(20)}}>
        <Image
          style={{
            height: screenWidth * 0.6,
            width: screenWidth - RFValue(40),
            resizeMode: 'contain',
            borderRadius: RFValue(2),
          }}
          source={require('@assets/banner.png')}
        />
        <Text style={styles.txtBlogTitle}>
          {'Texworld Evolution Expresso Lorem Ipsum'}
        </Text>
        <Text style={styles.txtDate}>{'April 12 - May 25, 2021'}</Text>

        <Text
          style={{
            fontSize: RFValue(14),
            color: 'black',
            marginTop: RFValue(5),
          }}>
          {
            'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum '
          }
        </Text>

        <TileItem title={'Information Desk'} />
        <TileItem title={'Become an Exhibitor'} />
        <TileItem title={'Our Partners'} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  txtBlogTitle: {
    fontSize: RFValue(18),
    color: 'black',
    marginTop: RFValue(10),
  },
  txtDate: {
    fontSize: RFValue(12),
    color: 'grey',
    // marginTop: RFValue(10),
  },
});

// home tab whole, auditorim

export default memo(Lobby);
