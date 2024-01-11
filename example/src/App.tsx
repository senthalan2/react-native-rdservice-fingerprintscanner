import * as React from 'react';

import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import {
  getDeviceInfo,
  captureFinger,
  isDriverFound,
  openFingerPrintScanner,
  DEFAULT_PID_OPTIONS,
  AVAILABLE_PACKAGES,
} from 'react-native-rdservice-fingerprintscanner';
const PACKAGE_NAME = AVAILABLE_PACKAGES.Startek_FM220;
export default function App() {
  const start = () => {
    getDeviceInfo()
      .then((res) => {
        console.log(res, 'DEVICE INFO');
      })
      .catch((e) => {
        console.log(e, 'ERROR_DEVICE_INFO ');
      });
  };

  const openScanner = () => {
    openFingerPrintScanner(PACKAGE_NAME)
      .then((res) => {
        console.log(res, 'FINGER CAPTURE');
      })
      .catch((e) => {
        console.log(e, 'ERROR_FINGER_CAPTURE');
      });
  };

  const capture = () => {
    // const pidOptions =
    //   '<PidOptions><Opts fCount="1" fType="0" iCount="0" pCount="0" format="0" pidVer="2.0" timeout="20000" otp="" posh="LEFT_INDEX" env="S" wadh="" /> <Demo></Demo> <CustOpts> <Param name="Param1" value="" /> </CustOpts> </PidOptions>';
    captureFinger() //you can pass pidOptions to "captureFinger(pidOptions)"" method otherwise it takes DEFAULT_PID_OPTIONS
      .then((res) => {
        console.log(res, 'FINGER CAPTURE');
      })
      .catch((e) => {
        console.log(e, 'ERROR_FINGER_CAPTURE');
      });
  };

  const checkDriver = () => {
    isDriverFound(PACKAGE_NAME)
      .then((res) => {
        console.log(res, 'DRIVER CHECK');
      })
      .catch((e) => {
        console.log(e, 'ERROR_DRIVER CHECK');
      });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={checkDriver}
        style={{
          padding: 10,
          marginVertical: 5,
          paddingHorizontal: 30,
          backgroundColor: 'tomato',
          borderRadius: 10,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            color: '#FFFFFF',
          }}
        >
          Check Driver
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={openScanner}
        style={{
          padding: 10,
          marginVertical: 5,
          paddingHorizontal: 30,
          backgroundColor: 'tomato',
          borderRadius: 10,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            color: '#FFFFFF',
          }}
        >
          Open Scanner
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={start}
        style={{
          padding: 10,
          marginVertical: 5,
          paddingHorizontal: 30,
          backgroundColor: 'tomato',
          borderRadius: 10,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            color: '#FFFFFF',
          }}
        >
          Start
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={capture}
        style={{
          padding: 10,
          marginVertical: 5,
          paddingHorizontal: 30,
          backgroundColor: 'tomato',
          borderRadius: 10,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            color: '#FFFFFF',
          }}
        >
          Capture
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
