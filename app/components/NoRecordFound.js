import React, { memo } from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { colors, exStyles } from "../styles";
const NoRecordFound = ({ ...props }) => (
  <View style={[{ flex: 1 }, props.style]}>
    <Text
      style={[{ fontSize: RFValue(16), color: "grey", alignSelf: 'center' }, props.textStyle]}
    >
      {"No Record Found"}
    </Text>
  </View>
);

const styles = {};

export default memo(NoRecordFound);
