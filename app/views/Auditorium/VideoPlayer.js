import * as React from "react";
import { memo, useRef, useState, useEffect, useImperativeHandle } from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  SafeAreaView,
  StyleSheet,
  StatusBar,
} from "react-native";
import { AuthInput, Header, ActivityIndicator } from "@components";
import { RFValue } from "react-native-responsive-fontsize";
import { colors, exStyles } from "@styles";
import Video from "react-native-video";
import Slider from "@react-native-community/slider";
import Icon from "react-native-vector-icons/FontAwesome5";
import Orientation from "react-native-orientation-locker";
import { useBackHandler } from "@react-native-community/hooks";

const VideoPlayer = ({ navigation, route }) => {
  const { videoUrl } = route.params;
  console.error(videoUrl);
  const videoPlayer = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0.1);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [paused, setPaused] = useState(true);
  const [overlay, setOverlay] = useState(false);

  useBackHandler(() => {
    if (isFullScreen) onFullScreen();
    else navigation.goBack();
    return true;
  });
  useEffect(() => {
    return () => {
      Orientation.lockToPortrait();
    };
  }, []);

  const overlayTimeOut = () => {
    setOverlay(true);
    setTimeout(() => {
      setOverlay(false);
    }, 3000);
  };

  getTime = (t) => {
    const digit = (n) => (n < 10 ? `0${n}` : `${n}`);
    const sec = digit(Math.floor(t % 60));
    const min = digit(Math.floor((t / 60) % 60));
    const hr = digit(Math.floor((t / 3600) % 60));
    return hr + ":" + min + ":" + sec;
  };

  const onSlide = (slide) => {
    videoPlayer.current.seek(slide);
  };
  const onLoad = (data) => setDuration(data.duration); // now here the duration is update on load video
  const onProgress = (data) => setCurrentTime(data.currentTime);
  const onFullScreen = () => {
    setIsFullScreen(!isFullScreen);
    if (isFullScreen) Orientation.lockToPortrait();
    else Orientation.lockToLandscapeLeft();
  };

  return (
    <>
      <SafeAreaView style={{ backgroundColor: colors.secondaryColor }} />
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.black }}>
        <StatusBar
          backgroundColor={colors.secondaryColor}
          barStyle={"light-content"}
        />
        {isFullScreen ? null : (
          <Header
            title={route.params.header !== undefined ? route.params.header : ""}
            theme={"light"}
            onBackPress={() => {
              navigation.goBack();
            }}
          />
        )}
        <View style={{ flex: 1, justifyContent: "center" }}>
          <View style={[styles.postContainer]}>
            <Video
              style={styles.mediaPlayer}
              onEnd={() => setPaused(true)}
              onLoad={onLoad}
              onProgress={onProgress}
              paused={paused}
              ref={videoPlayer}
              resizeMode="contain"
              fullscreen={isFullScreen}
              fullscreenOrientation={"landscape"}
              volume={10}
              playInBackground={true}
              playWhenInactive={true}
              repeat={true}
              ignoreSilentSwitch="ignore"
              source={{
                uri: "https://zoom.us/rec/play/_8DELKJTWYQ60VteQiNG7k8sCSdUMCjxtRBtqmxWHrP9UE8RN1SOHHg2tNsjuQ0bP5hR8RtESqSy0wpS.4WvhMoE5mk4CIfHr",
              }}
            />
            <TouchableWithoutFeedback
              onPress={() => {
                overlay ? setOverlay(false) : overlayTimeOut();
              }}
            >
              <View style={styles.overlay}>
                {overlay ? (
                  <View
                    style={{ ...styles.overlaySet, backgroundColor: "#0006" }}
                  >
                    <Icon
                      name={paused ? "play" : "pause"}
                      style={styles.icon}
                      color="#ffffff"
                      onPress={() => setPaused(!paused)}
                    />
                    <View style={styles.sliderCont}>
                      <View style={styles.timer}>
                        <Text style={{ color: "white" }}>
                          {getTime(currentTime)}
                        </Text>
                        <View style={{ flexDirection: "row" }}>
                          <Text style={{ color: "white" }}>
                            {getTime(duration)}
                          </Text>
                          <Icon
                            name={isFullScreen ? "compress" : "expand"}
                            color="#ffffff"
                            style={{ marginHorizontal: 10, fontSize: 15 }}
                            onPress={onFullScreen}
                          />
                        </View>
                      </View>
                      <Slider
                        style={{ marginHorizontal: 10 }}
                        minimumValue={0}
                        value={currentTime}
                        maximumValue={duration}
                        maximumTrackTintColor="grey"
                        minimumTrackTintColor="white"
                        thumbTintColor="white" // now the slider and the time will work
                        onValueChange={onSlide} // slier input is 0 - 1 only so we want to convert sec to 0 - 1
                      />
                    </View>
                  </View>
                ) : (
                  <View style={{ flex: 1, flexDirection: "row" }}></View>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
    alignContent: "center",
    alignSelf: "center",
    backgroundColor: "red",
  },

  //Image styling
  postImage: {
    aspectRatio: 18 / 14,
    width: "100%",
  },

  //album Image styling
  image: {
    width: 300,
    marginHorizontal: 0.5,
  },

  //Video styling
  toolbar: {
    marginTop: 30,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
  },
  mediaPlayer: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: "black",
    justifyContent: "center",
  },
  //video overlay
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  overlaySet: {
    flex: 1,
    flexDirection: "row",
  },
  icon: {
    color: "white",
    left: 0,
    right: 0,
    // top: '50%',
    alignSelf: "center",
    position: "absolute",
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 25,
  },
  sliderCont: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  timer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  // video: { width, height: width * 0.6, backgroundColor: "black" },
  fullscreenVideo: {
    backgroundColor: "black",
    ...StyleSheet.absoluteFill,
    elevation: 1,
  },

  //styling music files
  musicTextContainer: {
    alignItems: "center",
    marginBottom: 5,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    height: 50,
    backgroundColor: "#F4F4F4",
    marginHorizontal: 15,
    borderRadius: 30,
  },
  control: {
    marginHorizontal: 10,
  },
  seekBarContainer: {
    flex: 1,
    borderRadius: 15,
    alignSelf: "center",
  },
  timers: {
    color: "#000000",
    fontSize: 14,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 16,
  },
  timerContainer: {
    marginRight: 10,
  },

  //Polling post styling
  pollingDetailContainer: { marginHorizontal: 15 },
  pollingTextContainer: { color: "#000000", fontSize: 16 },
  pollAnswersContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    borderRadius: 15,
    height: 40,
    marginHorizontal: 15,
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: "rgba(0, 0, 0, 0.04)",
  },
  checkIconStyle: { marginHorizontal: 5 },
  pollAnswerTextContainer: {
    marginRight: 15,
  },
  pollVotingPercentage: {
    position: "absolute",
    right: 5,
  },
});

export default memo(VideoPlayer);
