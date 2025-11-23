import RDServiceFingerprintScanner from "./NativeRDServiceFingerprintScanner";
import type { AvailablePackageProps, DeviceInfoNativeResponseProps, DeviceInfoProps, DriverDataProps, FaceCaptureDataProps, FingerprintDataProps, OptionalInfo, PackageNameProp } from "./types";


export const AVAILABLE_PACKAGES: AvailablePackageProps = {
    Secugen: 'com.secugen.rdservice',
    Morpho: 'com.scl.rdservice',
    Mantra: 'com.mantra.rdservice',
    Startek_FM220: 'com.acpl.registersdk',
    Gemalto_3M_Cogent_CSD200: 'com.rd.gemalto.com.rdserviceapp',
    Integra: 'com.integra.registered.device',
    Aratek: 'com.aratek.asix_gms.rdservice',
    Maestros: 'rdservice.metsl.metslrdservice',
    Tatvik_TMF20: 'com.tatvik.bio.tmf20',
    Evolute: 'com.evolute.rdservice',
    PB510: 'com.precision.pb510.rdservice',
    MIS100V2_by_Mantra: 'com.mantra.mis100v2.rdservice',
    NEXT_Biometrics_NB3023: 'com.nextbiometrics.rdservice',
    IriTech_IriShield: 'com.iritech.rdservice',
    Evolute_IRIS: 'com.evolute.iris.rdservice',
};

export const DEFAULT_PID_OPTIONS: string = `<PidOptions ver="1.0"> <Opts fCount="1" fType="0" iCount="0" pCount="0" format="0" pidVer="2.0" timeout="20000" otp="" posh="UNKNOWN" env="P" wadh="" /> <Demo></Demo><CustOpts> <Param name="ValidationKey" value="" /> </CustOpts> </PidOptions>`;

export function getDeviceInfo(): Promise<DeviceInfoProps | OptionalInfo> {
    return new Promise((resolve, reject) => {
        RDServiceFingerprintScanner.getDeviceInfo()
            .then((res) => {
                if (res.status === -1) {
                    const resObj: OptionalInfo = {
                        status: res.status,
                        message: res.message,
                    };
                    resolve(resObj);
                } else {
                    const resTyped = res as DeviceInfoNativeResponseProps;
                    const resObj: DeviceInfoProps = {
                        isWhitelisted: resTyped.isWhitelisted,
                        rdServiceInfoJson: JSON.parse(resTyped.rdServiceInfoJsonString),
                        rdServiceInfoXML: resTyped.rdServiceInfoXML,
                        rdServicePackage: resTyped.rdServicePackage,
                        status: resTyped.status,
                        message: resTyped.message,
                    };
                    resolve(resObj);
                }
            })
            .catch((err) => {
                reject(err);
            });
    });
}

export function getIsDriverFound(packageName: PackageNameProp): Promise<DriverDataProps> {
    return new Promise((resolve, reject) => {
        if (packageName) {
            RDServiceFingerprintScanner.getIsDriverFound(packageName)
                .then((res) => {
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
        } else {
            reject('Package name cannot be empty');
        }
    });
}

export function openFingerPrintScanner(
    packageName: PackageNameProp,
    pidOptions: string = DEFAULT_PID_OPTIONS
): Promise<FingerprintDataProps | DriverDataProps> {
    return new Promise((resolve, reject) => {
        if (!packageName) {
            reject('Package name cannot be empty');
            return;
        }
        RDServiceFingerprintScanner.openFingerPrintScanner(
            packageName,
            pidOptions
        )
            .then((res) => {
                if ('pidDataJsonString' in res && res.pidDataJsonString) {
                    const resObj: FingerprintDataProps = {
                        pidDataJson: JSON.parse(res.pidDataJsonString),
                        pidDataXML: res.pidDataXML,
                        rdServicePackage: res.rdServicePackage,
                        status: res.status,
                        errInfo: res.errInfo,
                        errorCode: res.errorCode,
                        message: res.message,
                    };
                    resolve(resObj);
                } else {
                    resolve(res as DriverDataProps);
                }
            })
            .catch((err) => {
                reject(err);
            });

    });
}

export function captureFinger(pidOptions: string = DEFAULT_PID_OPTIONS): Promise<FingerprintDataProps> {
    return new Promise((resolve, reject) => {
        RDServiceFingerprintScanner.captureFinger(pidOptions)
            .then((res) => {
                const resObj: FingerprintDataProps = {
                    pidDataJson: JSON.parse(res.pidDataJsonString),
                    pidDataXML: res.pidDataXML,
                    rdServicePackage: res.rdServicePackage,
                    status: res.status,
                    errInfo: res.errInfo,
                    errorCode: res.errorCode,
                    message: res.message,
                };
                resolve(resObj);
            })
            .catch((err) => {
                reject(err);
            });
    });
}

export function captureFace(pidOptions: string = DEFAULT_PID_OPTIONS): Promise<FaceCaptureDataProps> {
    return new Promise((resolve, reject) => {
        RDServiceFingerprintScanner.captureFace(pidOptions)
            .then((res) => {
                const resObj: FaceCaptureDataProps = {
                    pidDataJson: JSON.parse(res.pidDataJsonString),
                    pidDataXml: res.pidDataXml,
                    status: res.status,
                    errInfo: res.errInfo,
                    errorCode: res.errorCode,
                    message: res.message,
                };
                resolve(resObj);
            })
            .catch((err) => {
                reject(err);
            });
    });
}
