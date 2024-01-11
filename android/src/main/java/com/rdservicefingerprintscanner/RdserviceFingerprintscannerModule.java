package com.rdservicefingerprintscanner;

import android.app.Activity;
import android.content.Intent;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.module.annotations.ReactModule;

import org.json.JSONException;
import org.json.JSONObject;
import fr.arnaudguyon.xmltojsonlib.XmlToJson;

@ReactModule(name = RdserviceFingerprintscannerModule.NAME)
public class RdserviceFingerprintscannerModule extends ReactContextBaseJavaModule implements RDServiceEvents {
  public static final String NAME = "RdserviceFingerprintscanner";
  public Promise promise;
  private RDServiceManager rdServiceManager;
  String servicePackage = "";
  public RdserviceFingerprintscannerModule(ReactApplicationContext reactContext) {
    super(reactContext);
    reactContext.addActivityEventListener(new RDServiceActivityEventListener());
    rdServiceManager = new RDServiceManager.Builder(this).create();
  }

  @Override
  @NonNull
  public String getName() {
    return NAME;
  }


  // Example method
  // See https://reactnative.dev/docs/native-modules-android
  @ReactMethod
  public void getDeviceInfo( Promise promise) {
    this.promise = promise;
    final Activity activity = getCurrentActivity();
    rdServiceManager.discoverRdService(activity);
  }

  @ReactMethod
  public void isDriverFound(String packageName,Promise promise) {
    this.promise = promise;
    final Activity activity = getCurrentActivity();
    rdServiceManager.isDriverFound(packageName,activity);
  }
  @ReactMethod
  public void openFingerPrintScanner(String packageName,String pidOptions,Promise promise) {
    this.promise = promise;
    final Activity activity = getCurrentActivity();
    rdServiceManager.openFingerPrintScanner(packageName,pidOptions,activity);
  }


  @ReactMethod
  public void captureFinger(String pidOptions, Promise promise) {
    this.promise = promise;
    final Activity activity = getCurrentActivity();
    rdServiceManager.captureRdService(servicePackage,pidOptions,activity);
  }


  @Override
  public void onDeviceDriverFound(Boolean isFound) {
    try{
      WritableMap responseData = Arguments.createMap();
      responseData.putBoolean("isDeviceDriverFound",isFound);
      responseData.putInt("status",isFound?1:0);
      responseData.putString("message",isFound?"Device Driver is Discovered":"Device Driver not found");
      promise.resolve(responseData);
    }
    catch (Exception e){
      promise.reject("DRIVER_FOUND_ERROR",e.getMessage());
    }
  }

  @Override
  public void onRDServiceDriverDiscovery(String rdServiceInfo, String rdServicePackage, Boolean isWhitelisted) {
    // Called when an installed driver is discovered
    servicePackage = rdServicePackage;
    XmlToJson xmlToJson = new XmlToJson.Builder(rdServiceInfo).build();
    String jsonString = xmlToJson.toString();
    try{
      JSONObject obj = new JSONObject(jsonString);
      String statusMsg = obj.getJSONObject("RDService").getString("status");
      WritableMap responseData = Arguments.createMap();
      if(statusMsg.equals("READY")){
        responseData.putInt("status",1);
        responseData.putString("message","Device is Ready");
      }
      else {
        responseData.putInt("status",0);
        responseData.putString("message","Make Sure the Device is Connected and OTG Connection is Enabled in your Mobile");
      }
      responseData.putString("rdServiceInfoJsonString", jsonString);
      responseData.putString("rdServiceInfoXML", rdServiceInfo);
      responseData.putString("rdServicePackage", rdServicePackage);
      responseData.putBoolean("isWhitelisted",isWhitelisted);
      promise.resolve(responseData);
    }
    catch(JSONException e){
      promise.reject("DRIVER_DISCOVERY_FAILED","Driver Discovery Failed");
    }


  }

  @Override
  public void onRDServiceCaptureResponse(String pidData, String rdServicePackage) {

    XmlToJson xmlToJson = new XmlToJson.Builder(pidData).build();
    String jsonString = xmlToJson.toString();

    try{
      JSONObject obj = new JSONObject(jsonString);
      JSONObject response =  obj.getJSONObject("PidData").getJSONObject("Resp");
      String errorCode = response.getString("errCode");
      String errInfo = "";
      WritableMap responseData = Arguments.createMap();
      if(Integer.parseInt(errorCode) == 0 ){
        responseData.putInt("status",1);
        responseData.putString("message","FingerPrint Scanned Successfully");
      }
      else {
        errInfo = response.getString("errInfo");
        responseData.putInt("status",0);
        responseData.putString("message","Make Sure the Device is Connected and OTG Connection is Enabled in your Mobile");
      }

      responseData.putString("errorCode",errorCode);
      responseData.putString("errInfo",errInfo);
      responseData.putString("pidDataJsonString", jsonString);
      responseData.putString("pidDataXML", pidData);
      responseData.putString("rdServicePackage", rdServicePackage);
      promise.resolve(responseData);
    }
    catch (JSONException e){
      promise.reject("FINGERPRINT_CAPTURE__FAILED","FingerPrint Capture Failed");
    }
  }

  @Override
  public void onRDServiceDriverNotFound() {
    // Called when no installed driver is found
    WritableMap responseData = Arguments.createMap();
    responseData.putInt("status",-1);
    responseData.putString("message","Driver Not Found");
    promise.resolve(responseData);
  }

  @Override
  public void onRDServiceDriverDiscoveryFailed(int resultCode, Intent data, String rdServicePackage, String reason) {
    // Called when a discovered driver fails to provide a proper status information
    promise.reject("DRIVER_DISCOVERY_FAILED","Driver Discovery Failed");

  }

  @Override
  public void onRDServiceCaptureFailed(int resultCode, Intent data, String rdServicePackage) {
    // Called when fingerprint capture fails
    promise.reject("FINGERPRINT_CAPTURE__FAILED","FingerPrint Capture Failed");
  }

  private class RDServiceActivityEventListener extends BaseActivityEventListener {
    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
      super.onActivityResult(activity, requestCode, resultCode, data);
      rdServiceManager.onActivityResult(requestCode, resultCode, data);
    }
  }
}
