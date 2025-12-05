package com.rdservicefingerprintscanner

import android.app.Activity
import android.app.AlertDialog
import android.content.Intent
import com.facebook.react.bridge.Arguments.createMap
import com.facebook.react.bridge.BaseActivityEventListener
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule
import fr.arnaudguyon.xmltojsonlib.XmlToJson
import org.json.JSONException
import org.json.JSONObject


@ReactModule(name = RDServiceFingerprintScannerModule.NAME)
class RDServiceFingerprintScannerModule(reactContext: ReactApplicationContext) :
  NativeRDServiceFingerprintScannerSpec(reactContext), RDServiceEvents {
  var promise: Promise? = null
  private val rdServiceManager: RDServiceManager
  var servicePackage: String = ""

  init {
    reactContext.addActivityEventListener(RDServiceActivityEventListener())
    rdServiceManager = RDServiceManager.Builder(this).create()
  }

  override fun getName(): String {
    return NAME
  }


  // Example method
  // See https://reactnative.dev/docs/native-modules-android
  override fun getDeviceInfo(promise: Promise) {
    this.promise = promise
    val activity = reactApplicationContext.currentActivity
    rdServiceManager.discoverRdService(activity)
  }

  override fun getIsDriverFound(packageName: String?, promise: Promise) {
    this.promise = promise
    val activity = reactApplicationContext.currentActivity
    rdServiceManager.getIsDriverFound(packageName, activity)
  }

  override fun openFingerPrintScanner(packageName: String?, pidOptions: String, promise: Promise) {
    this.promise = promise
    val activity = reactApplicationContext.currentActivity
    rdServiceManager.openFingerPrintScanner(packageName, pidOptions, activity)
  }


  override fun captureFinger(pidOptions: String, promise: Promise) {
    this.promise = promise
    val activity = reactApplicationContext.currentActivity
    rdServiceManager.captureRdService(servicePackage, pidOptions, activity)
  }


  override fun captureFace(pidOptions: String, promise: Promise?) {
    this.promise = promise
    val activity = reactApplicationContext.currentActivity
    rdServiceManager.captureFace(pidOptions, activity)
  }


  override fun onDeviceDriverFound(isFound: Boolean) {
    try {
      val responseData = createMap()
      responseData.putBoolean("isDeviceDriverFound", isFound)
      responseData.putInt("status", if (isFound) 1 else 0)
      responseData.putString(
        "message",
        if (isFound) "Device Driver is Discovered" else "Device Driver not found"
      )
      promise!!.resolve(responseData)
    } catch (e: Exception) {
      promise!!.reject("DRIVER_FOUND_ERROR", e.message)
    }
  }

  override fun onRDServiceDriverDiscovery(
    rdServiceInfo: String,
    rdServicePackage: String,
    isWhitelisted: Boolean
  ) {
    // Called when an installed driver is discovered
    servicePackage = rdServicePackage
    val xmlToJson = XmlToJson.Builder(rdServiceInfo).build()
    val jsonString = xmlToJson.toString()
    try {
      val obj = JSONObject(jsonString)
      val statusMsg = obj.getJSONObject("RDService").getString("status")
      val responseData = createMap()
      if (statusMsg == "READY") {
        responseData.putInt("status", 1)
        responseData.putString("message", "Device is Ready")
      } else {
        responseData.putInt("status", 0)
        responseData.putString(
          "message",
          "Make Sure the Device is Connected and OTG Connection is Enabled in your Mobile"
        )
      }
      responseData.putString("rdServiceInfoJsonString", jsonString)
      responseData.putString("rdServiceInfoXML", rdServiceInfo)
      responseData.putString("rdServicePackage", rdServicePackage)
      responseData.putBoolean("isWhitelisted", isWhitelisted)
      promise!!.resolve(responseData)
    } catch (e: JSONException) {
      promise!!.reject("DRIVER_DISCOVERY_FAILED", "Driver Discovery Failed")
    }
  }

  override fun onRDServiceCaptureResponse(pidData: String, rdServicePackage: String?) {
    val xmlToJson = XmlToJson.Builder(pidData).build()
    val jsonString = xmlToJson.toString()

    try {
      val obj = JSONObject(jsonString)
      val response = obj.getJSONObject("PidData").getJSONObject("Resp")
      val errorCode = response.getString("errCode")
      var errInfo = ""
      val responseData = createMap()
      if (errorCode.toInt() == 0) {
        responseData.putInt("status", 1)
        responseData.putString("message", "FingerPrint Scanned Successfully")
      } else {
        errInfo = response.getString("errInfo")
        responseData.putInt("status", 0)
        responseData.putString(
          "message",
          "Make Sure the Device is Connected and OTG Connection is Enabled in your Mobile"
        )
      }

      responseData.putString("errorCode", errorCode)
      responseData.putString("errInfo", errInfo)
      responseData.putString("pidDataJsonString", jsonString)
      responseData.putString("pidDataXML", pidData)
      responseData.putString("rdServicePackage", rdServicePackage)
      promise!!.resolve(responseData)
    } catch (e: JSONException) {
      promise!!.reject("FINGERPRINT_CAPTURE__FAILED", "FingerPrint Capture Failed")
    }
  }

  override fun onRDServiceFaceCaptureResponse(pidData: String) {

    val xmlToJson = XmlToJson.Builder(pidData).build()
    val jsonString = xmlToJson.toString()

    try {
      val obj = JSONObject(jsonString)
      val response = obj.getJSONObject("PidData").getJSONObject("Resp")
      val errorCode = response.getString("errCode")
      var errInfo = ""
      val responseData = createMap()
      if (errorCode.toInt() == 0) {
        responseData.putInt("status", 1)
        responseData.putString("message", "Face Captured Successfully")
      } else {
        errInfo = response.getString("errInfo")
        responseData.putInt("status", 0)
        responseData.putString(
          "message",
          errInfo
        )
      }

      responseData.putString("errorCode", errorCode)
      responseData.putString("errInfo", errInfo)
      responseData.putString("pidDataJsonString", jsonString)
      responseData.putString("pidDataXML", pidData)
      promise!!.resolve(responseData)
    } catch (e: JSONException) {
      promise!!.reject("FACE_CAPTURE_FAILED", "Face Capture Failed")
    }
  }

  override fun onRDServiceDriverNotFound() {
    // Called when no installed driver is found
    val responseData = createMap()
    responseData.putInt("status", -1)
    responseData.putString("message", "Driver Not Found")
    promise!!.resolve(responseData)
  }

  override fun onRDServiceDriverDiscoveryFailed(
    resultCode: Int,
    data: Intent?,
    rdServicePackage: String?,
    reason: String?
  ) {
    // Called when a discovered driver fails to provide a proper status information
    promise!!.reject("DRIVER_DISCOVERY_FAILED", "Driver Discovery Failed")
  }

  override fun onRDServiceCaptureFailed(resultCode: Int, data: Intent?, rdServicePackage: String?) {
    // Called when fingerprint capture fails
    promise!!.reject("FINGERPRINT_CAPTURE__FAILED", "FingerPrint Capture Failed")
  }

  override fun onRDServiceFaceCaptureFailed(msg:String) {
    promise!!.reject("FACE_CAPTURE_FAILED", msg)
  }

  private inner class RDServiceActivityEventListener : BaseActivityEventListener() {
    override fun onActivityResult(
      activity: Activity,
      requestCode: Int,
      resultCode: Int,
      data: Intent?
    ) {
      super.onActivityResult(activity, requestCode, resultCode, data)
      if(data != null){
        rdServiceManager.onActivityResult(requestCode, resultCode, data)
      }

    }
  }

  companion object {
    const val NAME: String = "RDServiceFingerprintScanner"
  }
}
