# react-native-rdservice-fingerprintscanner

React Native library to easily integrate Fingerprint Device support in your app (for UIDAI Aadhaar based secure authentication in India). It is only for Android Devices.

As per [UIDAI](https://uidai.gov.in/) (Aadhaar) guidelines, only registered biometric devices can be used for Aadhaar Authentication. These devices come with RDService drivers (usually available on PlayStore) that exposes a standard API.

This library makes it easy to work with all such devices so that your app can search for installed drivers and get the fingerprint data after a scan.

For reference, you may check out the ([Aadhaar Registered Devices by UIDAI](https://uidai.gov.in/images/resource/Aadhaar_Registered_Devices_2_0_4.pdf)).

## Installation

```sh
npm install react-native-rdservice-fingerprintscanner
```

Add jitpack in your root build.gradle file at the end of repositories: `android/build.gradle`

```java
allprojects {
  repositories {
    // ...
    maven { url 'https://jitpack.io' }
  }
}
```

## Usage

```js
import {
  getDeviceInfo,
  captureFinger,
  isDriverFound,
  openFingerPrintScanner,
  captureFace,
  AVAILABLE_PACKAGES,
  DEFAULT_PID_OPTIONS,
} from 'react-native-rdservice-fingerprintscanner';

// ...

getDeviceInfo()
  .then((response) => {
    console.log(response, 'DEVICE DRIVER FOUND'); // Response about Device Driver
  })
  .catch((error) => {
    console.log(error, 'DEVICE DRIVER NOT FOUND'); //Failed to get device information
  });

captureFinger(pidOptions) // You can pass pidOptions (optional) to the "captureFinger" method; otherwise, it will use DEFAULT_PID_OPTIONS.
  .then((response) => {
    console.log(response, 'FINGER CAPTURE'); // FingerPrint Response
  })
  .catch((e) => {
    console.log(e, 'ERROR_FINGER_CAPTURE'); // Failed to capture the Fingerprint
  });

isDriverFound(PACKAGE_NAME) // You can use "AVAILABLE_PACKAGES" for the PACKAGE_NAME
  .then((res) => {
    console.log(res, 'DRIVER CHECK');
  })
  .catch((error) => {
    console.log(error, 'ERROR_DRIVER CHECK');
  });

openFingerPrintScanner(PACKAGE_NAME, pidOptions) // You can pass pidOptions (optional) to the "openFingerPrintScanner" method; otherwise, it will use DEFAULT_PID_OPTIONS
  .then((res) => {
    console.log(res, 'FINGER CAPTURE');
  })
  .catch((e) => {
    console.log(e, 'ERROR_FINGER_CAPTURE');
  });

captureFace(pidOptions) // You should pass pidOptions to the "captureFace" method. The DEFAULT_PID_OPTIONS will not work for this method
  .then((response) => {
    console.log(response, 'FACE CAPTURE'); // Face Response
  })
  .catch((e) => {
    console.log(e, 'ERROR_FACE_CAPTURE'); // Failed to capture the Face
  });
```

## Using pidOptions and RD Service Methods

`pidOptions` is an XML string that you need to pass to the `captureFinger`, `openFingerPrintScanner` and `captureFace` methods.

Refer to Version 2.0 of UIDAI [Revision 6](https://uidai.gov.in/images/resource/Aadhaar_Registered_Devices_2_0_4.pdf) and [Revision 7](https://uidai.gov.in/images/resource/Aadhaar_Registered_Devices_2_0_Revision-7_of_Jan_2022.pdf) documents for `pidOptions` used in `captureFinger` and `openFingerPrintScanner` methods.

The `pidOptions` passed to the `captureFace` method should include the wadh value, which is an encrypted hash key encoded in Base64.

Refer to Version 2.5 of UIDAI [Revision 1](https://uidai.gov.in/images/resource/Aadhaar_Authentication_API-2.5_Revision-1_of_January_2022.pdf) document for `pidOptions` used in `captureFace` method.

`DEFAULT_PID_OPTIONS` is used when you not passed the `pidOptions` to the `captureFinger()` and `openFingerPrintScanner` Methods.

`PACKAGE_NAME` is required to check the rd service. (eg) The Package name of StarTek Device is `com.acpl.registersdk`

You can use `AVAILABLE_PACKAGES` for `PACKAGE_NAME`.

`Note`: Call the `captureFinger` method after receiving a response from the `getDeviceInfo` method. Calling `captureFinger` before `getDeviceInfo` will only return an error in the catch block [(refer to the example code)](https://github.com/senthalan2/react-native-rdservice-fingerprintscanner/blob/main/example/src/App.js). Call the `openFingerPrintScanner` method only after the `isDriverFound` method returns true; if the driver is not found, `openFingerPrintScanner` will return a driver not found error. The two methods `isDriverFound` and `openFingerPrintScanner` are used to locate the selected RD Service, which is passed as an argument (device driver package name) to these methods. The [AadhaarFaceRD](https://play.google.com/store/apps/details?id=in.gov.uidai.facerd&hl=en) app must be installed to use the `captureFace` method.

## Response JSON Object

`getDeviceInfo()` Method Reponse

| Key        | Value   | Description  |
| ---------- | ------- | ------------ |
| status  | -1 or 1 or 0   | `-1` - Device Driver not Found, `1` - READY, `0` - NOTREADY                                                |
| isWhitelisted     | true or false  | IT is about the Device is Approved or not. `true` - Approved, `false` - Not Approved  |
| rdServiceInfoJson | JSON DATA  | The device returns XML DATA of Device Information. this parameter contains converted JSON DATA of XML DATA |
| rdServiceInfoXML  | XML DATA | Device Information  |
| rdServicePackage  | Device Package  |
| message           | Message about Success or Failure |

`captureFinger()` and `openFingerPrintScanner()` Methods Reponse

| Key  | Value   | Description |
| ---- | ------- | ----------- |
| status  | 1 or 0  | `1` - Fingerprint Captured Successfully, `0` - FingerPrint not Captured (Check Connection of Device and OTG Connection Settings in Mobile)                                   |
| errorCode  | ERROR CODE from RD Service | Refer [UIDAI Document](https://uidai.gov.in/images/resource/Aadhaar_Registered_Devices_2_0_Revision-7_of_Jan_2022.pdf) and [RDService Error Details](https://github.com/senthalan2/react-native-rdservice-fingerprintscanner/blob/main/Assets/RDService_Error_Details.pdf) |
| errInfo  | Error Message according to the ERROR CODE | Refer [UIDAI Document](https://uidai.gov.in/images/resource/Aadhaar_Registered_Devices_2_0_Revision-7_of_Jan_2022.pdf) and [RDService Error Details](https://github.com/senthalan2/react-native-rdservice-fingerprintscanner/blob/main/Assets/RDService_Error_Details.pdf) |
| pidDataJson  | JSON DATA  | The device returns PID DATA of Captured Fingerprint. this parameter contains converted JSON pidData of XML pidData  |
| pidDataXML   | XML DATA  | pidData Captured Fingerprint 
| rdServicePackage | Device Package  |
| message    | Message about Success or Failure    |

`isDriverFound()` Method Response

| Key                 | Value  | Description  |
| ------------------- | -------- | ---------- |
| isDeviceDriverFound | true or false | `true` - Driver Found, `false` - Driver not found |
| message  | Message about the driver found or not |

`captureFace()` method Reponse

| Key              | Value              | Description |
| ---------------- | ------------------ | --------- |
| status           | 1 or 0  | `1` - Face Captured Successfully, `0` - Face not Captured |
| errorCode        | ERROR CODE from RD Service  | Refer [UIDAI Document](https://uidai.gov.in/images/resource/Aadhaar_Authentication_API-2.5_Revision-1_of_January_2022.pdf) |
| errInfo          | Error Message according to the ERROR CODE | Refer [UIDAI Document](https://uidai.gov.in/images/resource/Aadhaar_Authentication_API-2.5_Revision-1_of_January_2022.pdf) |
| pidDataJson      | JSON DATA  | The [AadhaarFaceRD](https://play.google.com/store/apps/details?id=in.gov.uidai.facerd&hl=en) app returns PID data of the captured face. This parameter contains the JSON-converted version of the XML PID data |
| pidDataXML       | XML DATA | PID data of the captured face  |
| message          | Message about Success or Failure  |


## Tested Devices

| Device Name   | Result             |
| ------------- | ------------------ |
| Startek FM220 | :white_check_mark: |
| MORPHO        | :white_check_mark: |
| MANTRA        | :white_check_mark: |
| Tatvik TMF20  | :white_check_mark: |
| PB510         | :white_check_mark: |

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

## Would you like to support me?

<a href="https://www.buymeacoffee.com/senthalan2" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-red.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>
