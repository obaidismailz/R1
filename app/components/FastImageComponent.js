import React, { memo, useState } from "react";
import { TouchableOpacity, Text, View, ActivityIndicator } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { colors, exStyles } from "../styles";
import FastImage from "@rocket.chat/react-native-fast-image";

const FastImageComponent = ({ ...props }) => {
  const [loading, setLoading] = useState(true);

  return (
    <View
      style={[
        {
          overflow: "hidden",
          justifyContent: "center",
          alignItems: "center",
        },
        props.style,
      ]}
    >
      <FastImage
        style={props.style}
        source={props.source}
        onLoadStart={() => setLoading(true)}
        onLoad={() => setLoading(false)}
      />
      {loading ? <ActivityIndicator style={{ position: "absolute" }} size={'small'} /> : null}
    </View>
  );
};

const styles = {
  createButton: {
    marginTop: RFValue(10),
    paddingVertical: RFValue(10),
    backgroundColor: colors.primaryColor,
    // backgroundColor: colors.secondaryColor,
    elevation: 3,
    borderRadius: RFValue(16),
    // height: RFValue(54),
    borderColor: "#48a9ee",
    // alignSelf: 'center',
    justifyContent: "center",
    alignItems: "center",
    // paddingHorizontal: 20,
    // marginHorizontal: 20,
  },
  androw: {
    shadowColor: "#468ad4",
    shadowOffset: {
      width: 0,
      height: RFValue(10),
    },
    shadowOpacity: 0.1,
    shadowRadius: 0.9,
  },
};

export default memo(FastImageComponent);
