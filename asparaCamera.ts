//% weight=100
//% block="asparaCamera"
//% icon="\uf030"
//% color="#00AAA0"
namespace asparaCamera {
    let lastResult = ""
    let readNewdata:boolean = false;
    let lock:boolean = false
    let newdata:boolean = false;

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
        //% block="Object Classification"
        ObjectClassification,
        //% block="Image Classification"
        ImageClassification,
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

    /***********************************************************************************************************************/
    /* Basic Functions                                                                                                     */
    /***********************************************************************************************************************/
    /**
     * Init the asparaCamera library with serial connection
     * @param tx Tx pin; eg: SerialPin.P0
     * @param rx Rx pin; eg: SerialPin.P1
     */
    //% blockId=asparaCamera_init block="asparaCamera init tx %tx rx %rx"
    //% group="Basic" color="#00AAA0" weight=103
    export function asparaCameraInit(tx: SerialPin, rx: SerialPin): void {
        serial.redirect(tx, rx, BaudRate.BaudRate115200);
        serial.setTxBufferSize(64)
        serial.setRxBufferSize(64)
        serial.readString()
        serial.writeString('\n\n')
        serial.onDataReceived(serial.delimiters(Delimiters.NewLine), () => {
            for(let i=0; i < 10; i++) {
                if (!lock && !readNewdata) {
                    lock = true
                    lastResult = serial.readUntil(serial.delimiters(Delimiters.NewLine));
                    newdata = true;
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
    //% group="Basic" color="#00AAA0" weight=102
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
            case ModeEnum.ObjectClassification:
                serial.writeLine("start classify")
                break;
            case ModeEnum.ImageClassification:
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
            if (lastResult.length > 0) {
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
            if (lastResult.length > 0) {
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
    /* Object Classification.                                                                                              */
    /***********************************************************************************************************************/
    /**
    * Object Classification Get Result
    */
    //% blockId=object_classification_result block="Object Classification Get Result"
    //% group="Object Classification" color="#7a53e6" weight=701
    export function ObjectClassificationGetResult(): string {
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
    /* Image Classification                                                                                                */
    /***********************************************************************************************************************/
    /**
     * Adds a custom label to an image in the Image Classification.
     * @param label The arbitrary name to associate with the captured image.
     */
    //% blockId=image_classification_add_label block="Capture Image With Label #%label"
    //% group="Image Classification" color="#0c9eed" weight=803
    export function ImageClassificationAddLabel(label: string): void {
        serial.writeLine("tag #" + label);
    }

    /**
    * Image classification clear all labels
    */
    //% blockId=image_classification_clear_all_labels block="Image Classification Clear All Labels"
    //% group="Image Classification" color="#0c9eed" weight=802
    export function ImageClassificationClearAllLabel(): void {
        serial.writeLine("tag #reset");
    }

    /**
    * Image classification Get Result
    */
    //% blockId=image_classification_read_label block="Image Classification Get Result"
    //% group="Image Classification" color="#0c9eed" weight=801
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
    /* Face Detection.                                                                                                     */
    /***********************************************************************************************************************/
    /**
    * Face Detection Get Result
    */
    //% blockId=face_detection_result block="Face Detection Get Result"
    //% group="Face Detection" color="#be17a3" weight=901
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
    //% group="Facial Expression Detection" color="#3711df" weight=1001
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
    //% group="Scan Number" color="#069992" weight=1101
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
    //% group="Scan Alphabet" color="#763335" weight=1201
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
    //% group="Scan QR/BarCode" color="#063a0d" weight=1301
    export function ScanQRBarCodeGetResult(): string {
        // For this case, don't use the lock mechanism to speed up the response
        let lastResultcpy = lastResult
        return lastResultcpy
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
    //% group="Set WiFi Credentials" color="#0d0476" weight=1301
    export function set_wifi_credentials(ssid: string, password: string): void {
        serial.writeLine("wifi:[" + ssid + ", " + password + "]")
    }
}
