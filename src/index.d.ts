declare module "react-native-rdservice-fingerprintscanner" {
    export type deviceInfoProps = {
        isWhitelisted: boolean;
        rdServiceInfoJson: Record<string, any>;
        rdServiceInfoXML: string;
        rdServicePackage: string;
        status: number;
        message: string;
    }

    export type optionalInfo = {
        status: number;
        message: string;
    }

    export type fingerprintDataProps = {
        pidDataJson: Record<string, any>;
        pidDataXML: string;
        rdServicePackage: string;
        status: number;
        errInfo: string;
        errorCode: number;
        message: string;
    }

    export type faceCaptureDataProps = {
        pidDataJson: Record<string, any>;
        pidDataXml: string;
        status: number;
        errInfo: string;
        errorCode: number;
        message: string;
    }

    export type driverDataProps = {
        isDeviceDriverFound: boolean;
        message: string;
    }

    export type availablePackageProps = {
        Secugen: string;
        Morpho: string;
        Mantra: string;
        Startek_FM220: string;
        Gemalto_3M_Cogent_CSD200: string;
        Integra: string;
        Aratek: string;
        Maestros: string;
        Tatvik_TMF20: string;
        Evolute: string;
        PB510: string;
        MIS100V2_by_Mantra: string;
        NEXT_Biometrics_NB3023: string;
        IriTech_IriShield: string;
        Evolute_IRIS: string;
    }

    export const DEFAULT_PID_OPTIONS: string;
    export const AVAILABLE_PACKAGES: availablePackageProps
    export function getDeviceInfo(): Promise<deviceInfoProps | optionalInfo>;
    export function captureFinger(pidOptions?: string): Promise<fingerprintDataProps>;
    export function isDriverFound(packageName: string): Promise<driverDataProps>;
    export function openFingerPrintScanner(packageName: string, pidOptions?: string): Promise<fingerprintDataProps | driverDataProps>;
    export function captureFace(pidOptions?: string): Promise<faceCaptureDataProps>;

}