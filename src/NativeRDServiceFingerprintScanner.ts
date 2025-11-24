import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';
import type { DeviceInfoNativeResponseProps, DriverDataProps, FaceCaptureDataNativeResponseProps, FingerprintDataNativeResponseProps, OptionalInfo } from './types';

export interface Spec extends TurboModule {
    getDeviceInfo(): Promise<DeviceInfoNativeResponseProps | OptionalInfo>;
    getIsDriverFound(packageName: string): Promise<DriverDataProps>;
    openFingerPrintScanner(packageName: string, pidOptions: string): Promise<FingerprintDataNativeResponseProps | DriverDataProps>;
    captureFinger(pidOptions: string): Promise<FingerprintDataNativeResponseProps>;
    captureFace(pidOptions: string): Promise<FaceCaptureDataNativeResponseProps>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('RDServiceFingerprintScanner');
