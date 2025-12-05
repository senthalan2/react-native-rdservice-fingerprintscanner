package com.rdservicefingerprintscanner;

import android.content.Intent;

/**
 * An interface to implement RDServiceManager callback functions.
 * @author https://github.com/manustays
 */
public interface RDServiceEvents {

  /**
   * An RDService driver is discovered. For each installed driver, this function will be called separately with the current status and package-name of that driver.
   * @param rdServiceInfo Status response as XML string from the discovered RDService device driver
   * @param rdServicePackage The discovered RDService device driver package name
   * @param isWhitelisted True if the discovered package is whitelisted, false otherwise
   */
  void onRDServiceDriverDiscovery(String rdServiceInfo, String rdServicePackage, Boolean isWhitelisted);

  /**
   * A fingerprint scan data is received from the RDService.
   * @param pidData The fingerprint scan PID data as XML string
   */
  void onRDServiceCaptureResponse(String pidData, String rdServicePackage);

  /**
   * A face scan data is received from the FaceRD.
   * @param pidData The face scan PID data as XML string
   */
  void onRDServiceFaceCaptureResponse(String pidData);

  /**
   * No installed RDService driver was found.
   */
  void onRDServiceDriverNotFound();

  /**
   * An installed RDService driver did not return a proper status.
   * @param resultCode The resultCode returned by the RDServiver driver activity
   * @param data The data returned by the RDServiver driver activity
   * @param rdServicePackage The package name of the RDService driver
   */
  void onRDServiceDriverDiscoveryFailed(int resultCode, Intent data, String rdServicePackage, String reason);

  /**
   * Captured request sent to an RDService driver failed.
   * @param resultCode The resultCode returned by the RDServiver driver activity
   * @param data The data returned by the RDServiver driver activity
   * @param rdServicePackage The package name of the RDService driver
   */
  void onRDServiceCaptureFailed(int resultCode, Intent data, String rdServicePackage);

  /**
   * Captured request sent to an RDService face capture failed.
   * @param resultCode The resultCode returned by the FaceRD
   * @param data The data returned by the FaceRD activity
   */
  void onRDServiceFaceCaptureFailed(String msg);

  void onDeviceDriverFound(Boolean isFound);
}
