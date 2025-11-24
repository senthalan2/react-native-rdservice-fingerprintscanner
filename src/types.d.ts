

export interface DeviceInfoProps {
    isWhitelisted: boolean;
    rdServiceInfoJson: Record<string, any>;
    rdServiceInfoXML: string;
    rdServicePackage: string;
    status: number;
    message: string;
}

export interface DeviceInfoNativeResponseProps extends Omit<DeviceInfoProps, 'rdServiceInfoJson'> {
    rdServiceInfoJsonString: string
}

export interface OptionalInfo {
    status: number;
    message: string;
}

export interface FingerprintDataProps {
    pidDataJson: Record<string, any>;
    pidDataXML: string;
    rdServicePackage: string;
    status: number;
    errInfo: string;
    errorCode: string;
    message: string;
}

export interface FingerprintDataNativeResponseProps extends Omit<FingerprintDataProps, 'pidDataJson'> {
    pidDataJsonString: string
}

export interface DriverDataProps {
    isDeviceDriverFound: boolean;
    message: string;
}

export type PackageNameProp =
    | 'com.secugen.rdservice'
    | 'com.scl.rdservice'
    | 'com.mantra.rdservice'
    | 'com.acpl.registersdk'
    | 'com.rd.gemalto.com.rdserviceapp'
    | 'com.integra.registered.device'
    | 'com.aratek.asix_gms.rdservice'
    | 'rdservice.metsl.metslrdservice'
    | 'com.tatvik.bio.tmf20'
    | 'com.evolute.rdservice'
    | 'com.precision.pb510.rdservice'
    | 'com.mantra.mis100v2.rdservice'
    | 'com.nextbiometrics.rdservice'
    | 'com.iritech.rdservice'
    | 'com.evolute.iris.rdservice';

export interface AvailablePackageProps {
    Secugen: 'com.secugen.rdservice';
    Morpho: 'com.scl.rdservice';
    Mantra: 'com.mantra.rdservice';
    Startek_FM220: 'com.acpl.registersdk';
    Gemalto_3M_Cogent_CSD200: 'com.rd.gemalto.com.rdserviceapp';
    Integra: 'com.integra.registered.device';
    Aratek: 'com.aratek.asix_gms.rdservice';
    Maestros: 'rdservice.metsl.metslrdservice';
    Tatvik_TMF20: 'com.tatvik.bio.tmf20';
    Evolute: 'com.evolute.rdservice';
    PB510: 'com.precision.pb510.rdservice';
    MIS100V2_by_Mantra: 'com.mantra.mis100v2.rdservice';
    NEXT_Biometrics_NB3023: 'com.nextbiometrics.rdservice';
    IriTech_IriShield: 'com.iritech.rdservice';
    Evolute_IRIS: 'com.evolute.iris.rdservice';
}


export interface FaceCaptureDataProps {
    pidDataJson: Record<string, any>;
    pidDataXml: string;
    status: number;
    errInfo: string;
    errorCode: string;
    message: string;
}

export interface FaceCaptureDataNativeResponseProps extends Omit<FaceCaptureDataProps, 'pidDataJson'> {
    pidDataJsonString: string
}