import React, { memo } from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  ActivityIndicator,
  Platform,
} from "react-native";
import { colors, exStyles } from "@styles";
import { RFValue } from "react-native-responsive-fontsize";
import { TouchableOpacity } from "react-native";

const ProgressDialog = ({ ...props }) => (
  <Modal
    transparent={true}
    animationType="fade"
    backdropColor={"black"}
    backdropOpacity={0.5}
    onRequestClose={() => {
      console.log("Modal has been closed.");
    }}
    {...props}
  >
    <View style={styles.modalStyle}>
      <View style={styles.layoutStyle}>
        <Text style={{ fontSize: 14 }}>
          {props.title === undefined ? "Downloading..." : props.title}
        </Text>
        <View
          style={{
            height: RFValue(10),
            backgroundColor: "#ececec",
            width: "100%",
            marginTop: RFValue(10),
          }}
        >
          <View
            style={{
              height: "100%",
              backgroundColor: colors.primaryColor,
              width: `${props.progress ? props.progress : 0}%`,
            }}
          ></View>
        </View>
        <TouchableOpacity
          style={{
            padding: 5,
            marginTop: RFValue(15),
            marginBottom: RFValue(15),
            alignSelf: "flex-end",
          }}
          onPress={props.onCancel}
        >
          <Text style={{ color: colors.primaryColor }}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  modalStyle: {
    backgroundColor: "#fff",
    alignSelf: "center",
    margin: 0,
    justifyContent: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    width: "100%",
    height: "100%",
  },
  layoutStyle: {
    backgroundColor: "#fff",
    alignSelf: "center",
    alignItems: "center",
    // paddingLeft: 20,
    paddingHorizontal: 20,
    margin: 0,
    justifyContent: "center",
    // flexDirection: 'row',
    width: "80%",
    // height: 80,
    paddingTop: RFValue(15),
    borderRadius: 8,
  },
});

export default memo(ProgressDialog);
