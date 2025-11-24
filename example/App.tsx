import * as React from 'react';

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import {
  getDeviceInfo,
  captureFinger,
  isDriverFound,
  openFingerPrintScanner,
  DEFAULT_PID_OPTIONS,
  AVAILABLE_PACKAGES,
  captureFace,
  type faceCaptureDataProps,
} from 'react-native-rdservice-fingerprintscanner';
import RNSimpleCrypto from 'react-native-simple-crypto';

const PACKAGE_NAME = AVAILABLE_PACKAGES.Startek_FM220;
export default function App() {
  const [faceData, setfaceData] = React.useState<faceCaptureDataProps | null>(
    null
  );
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

  const generateWadhForFaceAuth_KUA = async () => {
    try {
      let VERSION = '2.5';
      let RESIDENT_AUTHENTICATION_TYPE = 'P';
      let RESIDENT_CONSENT = 'Y';
      let LOCAL_LANGUAGE_IR = 'N';
      let DECRYPTION = 'N';
      let PRINT_FORMAT = 'N';

      let combineData =
        VERSION +
        RESIDENT_AUTHENTICATION_TYPE +
        RESIDENT_CONSENT +
        LOCAL_LANGUAGE_IR +
        DECRYPTION +
        PRINT_FORMAT;

      const messageBytes =
        RNSimpleCrypto.utils.convertUtf8ToArrayBuffer(combineData);

      const hashBuffer = await RNSimpleCrypto.SHA.sha256(messageBytes);

      const hashBase64 =
        RNSimpleCrypto.utils.convertArrayBufferToBase64(hashBuffer);

      return hashBase64;
    } catch (error) {
      console.error('Error hashing and encoding:', error);
    }
  };

  const handleCaptureFace = async () => {
    const GeneratedwadhKey = await generateWadhForFaceAuth_KUA();
    const uniqueId = Date.now().toString();
    console.log(GeneratedwadhKey, 'GENRATED WADH');

    const pidOptionsXML = `<?xml version="1.0" encoding="UTF-8"?>
    <PidOptions ver="1.0" env="P">
      <Opts
        fCount=""
        fType=""
        iCount=""
        iType=""
        pCount=""
        pType=""
        format=""
        pidVer="2.0"
        timeout="20000"
        posh=""
        wadh="${GeneratedwadhKey}"
      />
      <CustOpts>
        <Param name="txnId" value="${uniqueId}" />
        <Param name="purpose" value="auth" />
        <Param name="language" value="en" />
      </CustOpts>
    </PidOptions>`;

    captureFace(pidOptionsXML)
      .then((res) => {
        setfaceData(res);
      })
      .catch((e) => {
        console.log(e.message, 'ERROR');

        Alert.alert('Failed', e?.toString());
      });
  };
  if (faceData) {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 15 }}>
          <Text style={{ color: 'white' }}>{JSON.stringify(faceData)}</Text>
          <TouchableOpacity
            onPress={() => {
              setfaceData(null);
            }}
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
              Clear Face Data
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

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
      <TouchableOpacity
        onPress={handleCaptureFace}
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
          Capture Face
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
