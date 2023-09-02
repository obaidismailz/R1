import React, {memo} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {colors, exStyles} from '@styles';

const LoadingDialog = ({...props}) => (
  <Modal
    transparent={true}
    animationType="fade"
    backdropColor={'black'}
    backdropOpacity={0.5}
    onRequestClose={() => {
      console.log('Modal has been closed.');
    }}
    {...props}>
    <View style={styles.modalStyle}>
      <View style={styles.layoutStyle}>
        <ActivityIndicator
          animating={true}
          size={Platform.OS === 'ios' ? 'small' : 'large'}
          color={colors.primaryColor}
        />
        <Text style={{flex: 1, marginLeft: 20, fontSize: 14}}>
          Please wait ...{' '}
        </Text>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  modalStyle: {
    backgroundColor: '#fff',
    alignSelf: 'center',
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: '100%',
    height: '100%',
  },
  layoutStyle: {
    backgroundColor: '#fff',
    alignSelf: 'center',
    alignItems: 'center',
    paddingLeft: 20,
    margin: 0,
    justifyContent: 'center',
    flexDirection: 'row',
    width: '80%',
    height: 80,
    borderRadius: 8,
  },
});

export default memo(LoadingDialog);
