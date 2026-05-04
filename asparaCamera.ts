//% weight=100
//% block="aspara Camera"
//% icon="\uf030"
//% color="#00AAA0"
namespace asparaCamera {
    let lastResult = "";
    let pingpongResult = "";
    let pingpongPacket = "";
    let tempResult = "";
    let readNewdata:boolean = false;
    let usbSerialLock:boolean = false;
    let lock:boolean = false;
    let newdata:boolean = false;
    let assignedTx: SerialPin = SerialPin.P0;
    let assignedRx: SerialPin = SerialPin.P1;
    let usbSerialFailedCount = 0;

    export enum ModeEnum {
        //% block="None"
        None = 0x0,
        //% block="Line Tracking"
        LineTracking,
        //% block="Color Tracking"
        ColorTracking,
        //% block="Object Detection"
        ObjectDetection,
        //% block="Plant Diagnosis"
        PlantDiagnosis,
        //% block="Green/Red Lettuce Classification"
        GreenRedLettuceClassification,
        //% block="Custom Model"
        CustomModel,
        //% block="Image Classification"
        ImageClassification,
        //% block="Custom Image Classification"
        CustomImageClassification,
        //% block="Face Detection"
        FaceDetection,
        //% block="Facial Expression Detection"
        FacialExpressionDetection,
        //% block="Scan Number"
        ScanNumber,
        //% block="Scan Alphabet"
        ScanAlphabet,
        //% block="Scan QR/Bar Code"
        ScanQrBarCode
    }

    export enum ColorEnum {
        red = 0x00,
        green,
        blue,
        yellow,
        black,
        custom
    }

    export enum LineTrackCoordEnum {
        X1 = 0x00,
        X2,
        Y1,
        Y2
    }

    export enum ColorTrackCoordEnum {
        X = 0x00,
        Y,
        Width,
        Height
    }

    export enum ConfidenceLevelEnum {
        //% block="0.1"
        _0_1 = 1,
        //% block="0.2"
        _0_2 = 2,
        //% block="0.3"
        _0_3 = 3,
        //% block="0.4"
        _0_4 = 4,
        //% block="0.5"
        _0_5 = 5,
        //% block="0.6"
        _0_6 = 6,
        //% block="0.7"
        _0_7 = 7,
        //% block="0.8"
        _0_8 = 8,
        //% block="0.9"
        _0_9 = 9
    }

    export enum LcdViewAngleEnum {
        //% block="0°"
        Angle0 = 0,
        //% block="90°"
        Angle90 = 90,
        //% block="180°"
        Angle180 = 180,
        //% block="270°"
        Angle270 = 270
    }

    export enum CameraRotationAngleEnum {
        //% block="0°"
        Angle0 = 0,
        //% block="90°"
        Angle90 = 90,
        //% block="180°"
        Angle180 = 180,
        //% block="270°"
        Angle270 = 270
    }

    /***********************************************************************************************************************/
    /* Basic Functions                                                                                                     */
    /***********************************************************************************************************************/
    /**
     * Init the asparaCamera library with serial connection
     * @param tx Tx pin; eg: SerialPin.P0
     * @param rx Rx pin; eg: SerialPin.P1
     */
    //% blockId=asparaCamera_init block="asparaCamera init tx %tx rx %rx"
    //% group="Basic" color="#00AAA0" weight=104
    export function asparaCameraInit(tx: SerialPin, rx: SerialPin): void {
        assignedRx = rx;
        assignedTx = tx;
        serial.redirect(assignedTx, assignedRx, BaudRate.BaudRate115200);
        serial.setTxBufferSize(64)
        serial.setRxBufferSize(64)
        serial.readString()
        serial.writeString('\n\n')
        serial.onDataReceived(serial.delimiters(Delimiters.NewLine), () => {
            for(let i=0; i < 10; i++) {
                if (!lock && !readNewdata) {
                    lock = true
                    for(let j=0; j < 200; j++) {
                        if(!usbSerialLock) {
                            break;
                        }
                        basic.pause(1);
                    }
                    if (usbSerialLock) {
                        serial.redirect(assignedTx, assignedRx, BaudRate.BaudRate115200);
                        serial.readBuffer(0);
                        lastResult = "";
                        newdata = false;
                    } else {
                        usbSerialLock = true
                        tempResult = serial.readUntil(serial.delimiters(Delimiters.NewLine));
                        if (tempResult.indexOf("pingpong") >= 0) {
                            pingpongResult = tempResult;
                        } else {
                            lastResult = tempResult;
                        }
                        newdata = true;
                    }
                    usbSerialLock = false
                    lock = false;
                    break;
                }
                basic.pause(1);
            }
        });
    }

    /**
    * Select the operation mode of asparaCamera
    */
    //% blockId=asparaCamera_select_mode block="Select Mode %func"
    //% group="Basic" color="#00AAA0" weight=103
    //% func.fieldEditor="gridpicker"
    //% func.fieldOptions.columns=3
    export function selectMode(func: ModeEnum): void {
        switch(func) {
            case ModeEnum.None:
                serial.writeLine("start preview")
                break;
            case ModeEnum.LineTracking:
                serial.writeLine("start line tracking")
                break;
            case ModeEnum.ColorTracking:
                serial.writeLine("start color tracking")
                break;
            case ModeEnum.ObjectDetection:
                serial.writeLine("start object detection")
                break;
            case ModeEnum.PlantDiagnosis:
                serial.writeLine("start leaf diagnosis")
                break;
            case ModeEnum.GreenRedLettuceClassification:
                serial.writeLine("start green red")
                break;
            case ModeEnum.CustomModel:
                serial.writeLine("start custom model")
                break;
            case ModeEnum.ImageClassification:
                serial.writeLine("start classify")
                break;
            case ModeEnum.CustomImageClassification:
                serial.writeLine("start runtime classification")
                break;
            case ModeEnum.FaceDetection:
                serial.writeLine("start detect face")
                break;
            case ModeEnum.FacialExpressionDetection:
                serial.writeLine("start smile")
                break;
            case ModeEnum.ScanNumber:
                serial.writeLine("start scan numbers")
                break;
            case ModeEnum.ScanAlphabet:
                serial.writeLine("start scan alphabet")
                break;
            case ModeEnum.ScanQrBarCode:
                serial.writeLine("start qr bar code")
                break;
        }
    }

    /**
    * Camera Connected
    */
    //% blockId=camera_connected block="Camera Connected"
    //% group="Basic" color="#00AAA0" weight=102
    export function CameraConnected(): boolean {
        pingpongResult = "";
        let randomNum = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000).toString();
        let pingpongCore = "pingpong" + randomNum;
        pingpongPacket = "'" + pingpongCore + "'";
        serial.writeLine("echo " + pingpongPacket);
        for(let i=0; i < 100; i++) {
            if (pingpongResult.length > 0) {
                if (pingpongResult.indexOf(pingpongCore) >= 0) {
                    return true;
                }
            }
            basic.pause(50);
        }
        return false;
    }

    /**
    * Result Ready
    */
    //% blockId=result_ready block="Result Ready"
    //% group="Basic" color="#00AAA0" weight=101
    export function ResultReady(): boolean {
        return newdata;
    }

    /***********************************************************************************************************************/
    /* Line tracking.                                                                                                      */
    /***********************************************************************************************************************/
    /**
    * Line tracking select color
    */
    //% blockId=line_tracking_select_color block="Line Tracking Select Color"
    //% group="Line tracking" color="#dc1489" weight=203
    export function LineTrackingSelectColor(): void {
        serial.writeLine("calibrate")
    }

    /**
    * Line tracking set color
    */
    //% blockId=line_tracking_set_color block="Line Tracking Set Color %color"
    //% group="Line tracking" color="#dc1489" weight=202
    //% color.fieldEditor="gridpicker"
    //% color.fieldOptions.columns=1
    export function LineTrackingSetColor(color: ColorEnum): void {
        let colortext = "";

        switch(color) {
            case ColorEnum.red:
                colortext = "red";
                break;
            case ColorEnum.green:
                colortext = "green";
                break;
            case ColorEnum.blue:
                colortext = "blue";
                break;
            case ColorEnum.yellow:
                colortext = "yellow";
                break;
            case ColorEnum.black:
                colortext = "black";
                break;
            case ColorEnum.custom:
                colortext = "custom";
                break;
        }
        serial.writeLine("set color " + colortext)
    }

    /**
    * Line Tracking Get Coordinate X
    */
    //% blockId=line_tracking_get_coordinate_x block="Line Tracking Get Coordinate %coordxy"
    //% group="Line tracking" color="#dc1489" weight=201
    //% coordxy.fieldEditor="gridpicker"
    //% coordxy.fieldOptions.columns=1
    export function LineTrackingGetCoordinate(coordxy: LineTrackCoordEnum): number {
        let retnum = -1;

        readNewdata = true;
        while(lock){ basic.pause(1); };
        if (!lock) {
            lock = true;
            if (lastResult.length > 2) {
                // Parse the JSON string
                let parsed = JSON.parse(lastResult);
                switch(coordxy) {
                    case LineTrackCoordEnum.X1:
                        if (parsed && parsed.x1 !== undefined) {
                            retnum = parsed.x1;
                        }
                        break;
                    case LineTrackCoordEnum.X2:
                        if (parsed && parsed.x2 !== undefined) {
                            retnum = parsed.x2;
                        }
                        break;
                    case LineTrackCoordEnum.Y1:
                        if (parsed && parsed.y1 !== undefined) {
                            retnum = parsed.y1;
                        }
                        break;
                    case LineTrackCoordEnum.Y2:
                        if (parsed && parsed.y2 !== undefined) {
                            retnum = parsed.y2;
                        }
                        break;
                }
            }
            lastResult = "";
            newdata = false;
            lock = false;
        }
        readNewdata = false;
        return retnum;
    }

    /***********************************************************************************************************************/
    /* Color tracking.                                                                                                     */
    /***********************************************************************************************************************/
    /**
    * Color tracking select color
    */
    //% blockId=color_tracking_select_color block="Color Tracking Select Color"
    //% group="Color tracking" color="#dcdc14" weight=303
    export function ColorTrackingSelectColor(): void {
        serial.writeLine("calibrate")
    }

    /**
    * Color tracking set color
    */
    //% blockId=color_tracking_set_color block="Color Tracking Set Color %color"
    //% group="Color tracking" color="#dcdc14" weight=302
    //% color.fieldEditor="gridpicker"
    //% color.fieldOptions.columns=1
    export function ColorTrackingSetColor(color: ColorEnum): void {
        let colortext = "";

        switch(color) {
            case ColorEnum.red:
                colortext = "red";
                break;
            case ColorEnum.green:
                colortext = "green";
                break;
            case ColorEnum.blue:
                colortext = "blue";
                break;
            case ColorEnum.yellow:
                colortext = "yellow";
                break;
            case ColorEnum.black:
                colortext = "black";
                break;
            case ColorEnum.custom:
                colortext = "custom";
                break;
        }
        serial.writeLine("set color " + colortext)
    }

    /**
    * Color Tracking Get Coordinate
    */
    //% blockId=color_tracking_get_coordinate block="Color Tracking Get Coordinate %coord"
    //% group="Color tracking" color="#dcdc14" weight=301
    //% coord.fieldEditor="gridpicker"
    //% coord.fieldOptions.columns=1
    export function ColorTrackingGetCoordinate(coord: ColorTrackCoordEnum): number {
        let retnum = -1;

        readNewdata = true;
        while(lock){ basic.pause(1); };
        if (!lock) {
            lock = true;
            if (lastResult.length > 2) {
                // Parse the JSON string
                let parsed = JSON.parse(lastResult);
                switch(coord) {
                    case ColorTrackCoordEnum.X:
                        if (parsed && parsed.x1 !== undefined) {
                            retnum = parsed.x1;
                        }
                        break;
                    case ColorTrackCoordEnum.Y:
                        if (parsed && parsed.y1 !== undefined) {
                            retnum = parsed.y1;
                        }
                        break;
                    case ColorTrackCoordEnum.Width:
                        if (parsed && parsed.width !== undefined) {
                            retnum = parsed.width;
                        }
                        break;
                    case ColorTrackCoordEnum.Height:
                        if (parsed && parsed.height !== undefined) {
                            retnum = parsed.height;
                        }
                        break;
                }
            }
            lastResult = "";
            newdata = false;
            lock = false;
        }
        readNewdata = false;
        return retnum;
    }

    /***********************************************************************************************************************/
    /* Object Detection.                                                                                                   */
    /***********************************************************************************************************************/
    /**
    * Object Detection Get Result
    */
    //% blockId=object_detection_result block="Object Detection Get Result"
    //% group="Object Detection" color="#349b67" weight=401
    export function ObjectDetectionGetResult(): number {
        let ret = 0
        // For this case, don't use the lock mechanism to speed up the response
        let lastResultcpy = lastResult
        ret = parseInt(lastResultcpy.split(" ")[0])
        return ret
    }


    /***********************************************************************************************************************/
    /* Plant Diagnosis.                                                                                                    */
    /***********************************************************************************************************************/
    /**
    * Plant Diagnosis Get Result
    */
    //% blockId=plant_diagnosis_result block="Plant Diagnosis Get Result"
    //% group="Plant Diagnosis" color="#d5122f" weight=501
    export function PlantDiagnosisGetResult(): number {
        let ret = 0
        // For this case, don't use the lock mechanism to speed up the response
        let lastResultcpy = lastResult
        ret = parseInt(lastResultcpy.split(" ")[0])
        return ret
    }

    /***********************************************************************************************************************/
    /* Green/Red Lettuce Classification                                                                                    */
    /***********************************************************************************************************************/
    /**
    * Green/Red Lettuce Classification Get Result
    */
    //% blockId=green_red_result block="Green/Red Lettuce Classification Get Result"
    //% group="Green/Red Lettuce Classification" color="#316240" weight=601
    export function GreenRedLettuceClassificationGetResult(): string {
        let ret = ""
        readNewdata = true;
        while(lock){ basic.pause(1); };
        if (!lock) {
            lock = true;
            ret = lastResult
            lastResult = ""
            newdata = false
            lock = false;
        }
        readNewdata = false;
        return ret
    }

    /***********************************************************************************************************************/
    /* Custom Model                                                                                                        */
    /***********************************************************************************************************************/
    /**
     * Sets the custom model name for the Custom Model.
     * @param model The name of the custom model to set.
     */
    //% blockId=custom_model_set_model block="Set Custom Model Name: %model"
    //% group="Custom Model" color="#205e87" weight=702
    export function CustomModelSetModel(model: string): void {
        serial.writeLine("custom model name:" + model);
    }

    /**
    * Custom Model Get Result
    */
    //% blockId=custom_model_result block="Custom Model Get Result"
    //% group="Custom Model" color="#205e87" weight=701
    export function CustomModelGetResult(): string {
        let ret = ""
        readNewdata = true;
        while(lock){ basic.pause(1); };
        if (!lock) {
            lock = true;
            ret = lastResult
            lastResult = ""
            newdata = false
            lock = false;
        }
        readNewdata = false;
        return ret
    }

    /***********************************************************************************************************************/
    /* Image Classification.                                                                                              */
    /***********************************************************************************************************************/
    /**
    * Image Classification Get Result
    */
    //% blockId=image_classification_result block="Image Classification Get Result"
    //% group="Image Classification" color="#7a53e6" weight=801
    export function ImageClassificationGetResult(): string {
        let ret = ""
        readNewdata = true;
        while(lock){ basic.pause(1); };
        if (!lock) {
            lock = true;
            ret = lastResult
            lastResult = ""
            newdata = false
            lock = false;
        }
        readNewdata = false;
        return ret
    }

    /***********************************************************************************************************************/
    /* Custom Image Classification                                                                                                */
    /***********************************************************************************************************************/
    /**
     * Adds a custom label to an image in the Custom Image Classification.
     * @param label The arbitrary name to associate with the captured image.
     */
    //% blockId=custom_image_classification_add_label block="Capture Image With Label #%label"
    //% group="Custom Image Classification" color="#0c9eed" weight=903
    export function CustomImageClassificationAddLabel(label: string): void {
        serial.writeLine("tag #" + label);
    }

    /**
    * Custom Image Classification clear all labels
    */
    //% blockId=custom_image_classification_clear_all_labels block="Custom Image Classification Clear All Labels"
    //% group="Custom Image Classification" color="#0c9eed" weight=902
    export function CustomImageClassificationClearAllLabel(): void {
        serial.writeLine("tag #reset");
    }

    /**
    * Custom Image Classification Get Result
    */
    //% blockId=custom_image_classification_read_label block="Custom Image Classification Get Result"
    //% group="Custom Image Classification" color="#0c9eed" weight=901
    export function CustomImageClassificationGetResult(): string {
        let ret = ""
        readNewdata = true;
        while(lock){ basic.pause(1); };
        if (!lock) {
            lock = true;
            ret = lastResult
            lastResult = ""
            newdata = false
            lock = false;
        }
        readNewdata = false;
        return ret
    }

    /***********************************************************************************************************************/
    /* Face Detection.                                                                                                     */
    /***********************************************************************************************************************/
    /**
    * Face Detection Get Result
    */
    //% blockId=face_detection_result block="Face Detection Get Result"
    //% group="Face Detection" color="#be17a3" weight=1001
    export function FaceDetectionGetResult(): number {
        let ret = 0
        // For this case, don't use the lock mechanism to speed up the response
        let lastResultcpy = lastResult
        ret = parseInt(lastResultcpy.split(" ")[0])
        return ret
    }

    /***********************************************************************************************************************/
    /* Facial Expression Detection.                                                                                        */
    /***********************************************************************************************************************/
    /**
    * Facial Expression Detection Get Result
    */
    //% blockId=facial_expression_detection_result block="Facial Expression Detection Get Result"
    //% group="Facial Expression Detection" color="#3711df" weight=1101
    export function FacialExpressionDetectionGetResult(): string {
        let ret = ""
        readNewdata = true;
        while(lock){ basic.pause(1); };
        if (!lock) {
            lock = true;
            ret = lastResult
            lastResult = ""
            newdata = false
            lock = false;
        }
        readNewdata = false;
        return ret
    }

    /***********************************************************************************************************************/
    /* Scan Number.                                                                                                        */
    /***********************************************************************************************************************/
    /**
    * Scan Number Get Result
    */
    //% blockId=scan_number_result block="Scan Number Get Result"
    //% group="Scan Number" color="#069992" weight=1201
    export function ScanNumberGetResult(): number {
        let ret = 0
        // For this case, don't use the lock mechanism to speed up the response
        let lastResultcpy = lastResult
        ret = parseInt(lastResultcpy)
        return ret
    }
    
    /***********************************************************************************************************************/
    /* Scan Alphabet.                                                                                                      */
    /***********************************************************************************************************************/
    /**
    * Scan Alphabet Get Result
    */
    //% blockId=scan_alphabet_result block="Scan Alphabet Get Result"
    //% group="Scan Alphabet" color="#763335" weight=1301
    export function ScanAlphabetGetResult(): string {
        // For this case, don't use the lock mechanism to speed up the response
        let lastResultcpy = lastResult
        return lastResultcpy
    }

    /***********************************************************************************************************************/
    /* Scan QR/BarCode.                                                                                                     */
    /***********************************************************************************************************************/
    /**
    * Scan QR/BarCode Get Result
    */
    //% blockId=scan_qr_bar_code_result block="Scan QR/BarCode Get Result"
    //% group="Scan QR/BarCode" color="#095913" weight=1401
    export function ScanQRBarCodeGetResult(): string {
        // For this case, don't use the lock mechanism to speed up the response
        let lastResultcpy = lastResult
        return lastResultcpy
    }

    /***********************************************************************************************************************/
    /* Set LCD View Angle.                                                                                                 */
    /***********************************************************************************************************************/
    /**
    * Set LCD View Angle
    * @param angle Angle to set the LCD view
    */
    //% blockId=set_lcd_view_angle block="Set LCD View Angle %angle"
    //% group="Miscellaneous" color="#0d0476" weight=1508
    //% angle.fieldEditor="gridpicker"
    //% angle.fieldOptions.columns=1
    export function set_lcd_view_angle(angle: LcdViewAngleEnum): void {
        serial.writeLine("lcd_view_angle:" + angle)
    }

    /***********************************************************************************************************************/
    /* Set Camera Rotation Angle.                                                                                                 */
    /***********************************************************************************************************************/
    /**
    * Set Camera Rotation Angle
    * @param angle Angle to rotate the camera
    */
    //% blockId=set_camera_rotation_angle block="Set Camera Rotation Angle %angle"
    //% group="Miscellaneous" color="#0d0476" weight=1507
    //% angle.fieldEditor="gridpicker"
    //% angle.fieldOptions.columns=1
    export function set_camera_rotation_angle(angle: CameraRotationAngleEnum): void {
        serial.writeLine("camera_rotation_angle:" + angle)
    }

    /**
    * Set detection conference level, the higher the value, the more strict the detection will be. Valid value is 0.1-0.9, default is 0.5
    */
    //% blockId=asparaCamera_set_confidence_level block="Set Confidence Level %level"
    //% group="Miscellaneous" color="#0d0476" weight=1506
    //% level.min=0.1 level.max=0.9
    //% level.defl=_0_5
    export function SetConfidenceLevel(level: ConfidenceLevelEnum = ConfidenceLevelEnum._0_5): void {
        let confLevel = "";

        switch(level) {
            case ConfidenceLevelEnum._0_1:
                confLevel = "0.1";
                break;
            case ConfidenceLevelEnum._0_2:
                confLevel = "0.2";
                break;
            case ConfidenceLevelEnum._0_3:
                confLevel = "0.3";
                break;
            case ConfidenceLevelEnum._0_4:
                confLevel = "0.4";
                break;
            case ConfidenceLevelEnum._0_5:
                confLevel = "0.5";
                break;
            case ConfidenceLevelEnum._0_6:
                confLevel = "0.6";
                break;
            case ConfidenceLevelEnum._0_7:
                confLevel = "0.7";
                break;
            case ConfidenceLevelEnum._0_8:
                confLevel = "0.8";
                break;
            case ConfidenceLevelEnum._0_9:
                confLevel = "0.9";
                break;

        }
        serial.writeLine("set confidence level " + confLevel)
    }

    /**
    * Increase detection conference level by 0.1, maximum is 0.9, the higher the value, the more strict the detection will be.
    */
    //% blockId=asparaCamera_increase_confidence_level block="Increase Confidence Level"
    //% group="Miscellaneous" color="#0d0476" weight=1505
    export function IncreaseConfidenceLevel(): void {
         serial.writeLine("increase confidence level")
    }

    /**
    * Decrease detection conference level by 0.1, minimum is 0.1, the lower the value, the less strict the detection will be.
    */
    //% blockId=asparaCamera_decrease_confidence_level block="Decrease Confidence Level"
    //% group="Miscellaneous" color="#0d0476" weight=1504
    export function DecreaseConfidenceLevel(): void {
         serial.writeLine("decrease confidence level")
    }

    /***********************************************************************************************************************/
    /* Take a Photo.                                                                                                     */
    /***********************************************************************************************************************/
    /**
    * Take a Photo
    * @param name Name of the photo file
    */
    //% blockId=take_photo block="Take a Photo with name %name"
    //% group="Miscellaneous" color="#0d0476" weight=1503
    export function asparaCameraTakePhoto(name: string): void {
        serial.writeLine("take photo with name: \"" + name + "\"")
    }

    function usbSendMsg(msg: string): void {
        serial.redirect(SerialPin.USB_TX, SerialPin.USB_RX, BaudRate.BaudRate115200);
        serial.writeLine(msg);
        serial.redirect(assignedTx, assignedRx, BaudRate.BaudRate115200);
        serial.readBuffer(0);
    }

    /***********************************************************************************************************************/
    /* Print to USB Serial.                                                                                                */
    /***********************************************************************************************************************/
    /**
    * Print to USB Serial
    * @param msg message to print to USB Serial
    */
    //% blockId=print_to_usb_serial block="Print to USB Serial %msg"
    //% group="Miscellaneous" color="#0d0476" weight=1502
    export function asparaCameraPrintToUSBSerial(msg: string): void {
        if(!usbSerialLock) {
            usbSerialLock = true
            usbSendMsg(msg)
            usbSerialLock = false
            usbSerialFailedCount = 0
        } else {
            usbSerialFailedCount++
            if (usbSerialFailedCount > 10) {
                usbSendMsg(msg)
                usbSerialLock = false
                usbSerialFailedCount = 0
            }
        }
    }

    /***********************************************************************************************************************/
    /* Set WiFi.                                                                                                           */
    /***********************************************************************************************************************/
    /**
    * Set WiFi SSID and Password
    * @param ssid SSID of the WiFi network
    * @param password Password of the WiFi network
    */
    //% blockId=set_wifi_credentials block="Set WiFi SSID %ssid and Password %password"
    //% group="Miscellaneous" color="#0d0476" weight=1501
    export function set_wifi_credentials(ssid: string, password: string): void {
        serial.writeLine("wifi:[" + ssid + ", " + password + "]")
    }
}
