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
        Preview = 0x0,
        LineTracking,
        ColorTracking,
        GreenRedLettuce,
        ImageClassification
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
    //% group="Basic" color="#00AAA0" weight=102
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
    //% blockId=asparaCamera_select_mode block="select mode %func"
    //% group="Basic" color="#00AAA0" weight=101
    //% func.fieldEditor="gridpicker"
    //% func.fieldOptions.columns=3
    export function selectMode(func: ModeEnum): void {
        switch(func) {
            case ModeEnum.Preview:
                serial.writeLine("start preview")
                break;
            case ModeEnum.LineTracking:
                serial.writeLine("start line tracking")
                break;
            case ModeEnum.ColorTracking:
                serial.writeLine("start color tracking")
                break;
            case ModeEnum.GreenRedLettuce:
                serial.writeLine("start green red")
                break;
            case ModeEnum.ImageClassification:
                serial.writeLine("start runtime classification")
                break;
        }
    }

    /***********************************************************************************************************************/
    /* Line tracking.                                                                                                     */
    /***********************************************************************************************************************/
    /**
    * Line tracking select color
    */
    //% blockId=line_tracking_select_color block="Line Tracking Select Color"
    //% group="Line tracking" color="#dc1489" weight=204
    export function LineTrackingSelectColor(): void {
        serial.writeLine("calibrate")
    }

    /**
    * Line tracking set color
    */
    //% blockId=line_tracking_set_color block="Line Tracking Set Color %color"
    //% group="Line tracking" color="#dc1489" weight=203
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
    * Line Tracking Coordinates ready
    */
    //% blockId=line_tracking_coordinates_ready block="Line Tracking Coordinates ready"
    //% group="Line tracking" color="#dc1489" weight=202
    export function LineTrackingCoordinatesReady(): boolean {
        return newdata;
    }

    /**
    * Line Tracking Read Coordinate X
    */
    //% blockId=line_tracking_read_coordinate_x block="Line Tracking Read Coordinate %coordxy"
    //% group="Line tracking" color="#dc1489" weight=201
    //% coordxy.fieldEditor="gridpicker"
    //% coordxy.fieldOptions.columns=1
    export function LineTrackingReadCoordinate(coordxy: LineTrackCoordEnum): number {
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
    //% group="Color tracking" color="#dcdc14" weight=304
    export function ColorTrackingSelectColor(): void {
        serial.writeLine("calibrate")
    }

    /**
    * Color tracking set color
    */
    //% blockId=color_tracking_set_color block="Color Tracking Set Color %color"
    //% group="Color tracking" color="#dcdc14" weight=303
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
    * Color Tracking Coordinates ready
    */
    //% blockId=color_tracking_coordinates_ready block="Color Tracking Coordinates ready"
    //% group="Color tracking" color="#dcdc14" weight=302
    export function ColorTrackingCoordinatesReady(): boolean {
        return newdata;
    }

    /**
    * Color Tracking Read Coordinate
    */
    //% blockId=color_tracking_read_coordinate block="Color Tracking Read Coordinate %coord"
    //% group="Color tracking" color="#dcdc14" weight=301
    //% coord.fieldEditor="gridpicker"
    //% coord.fieldOptions.columns=1
    export function ColorTrackingReadCoordinate(coord: ColorTrackCoordEnum): number {
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
    /* Green/Red Lettuce                                                                                                   */
    /***********************************************************************************************************************/
    /**
    * Green/Red Lettuce result ready
    */
    //% blockId=green_red_ready block="Green/Red Lettuce result ready"
    //% group="Green Red Lettuce" color="#316240" weight=402
    export function GreenRedLettuceResultReady(): boolean {
        return newdata;
    }

    /**
    * Read Green/Red Lettuce result
    */
    //% blockId=green_red_result block="Read Green/Red Lettuce result"
    //% group="Green Red Lettuce" color="#316240" weight=401
    export function ReadGreenRedLettuceResult(): string {
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
    //% blockId=image_classification_add_label block="Image classification add label #%label"
    //% group="Image Classification" color="#0c9eed" weight=504
    export function ImageClassificationAddLabel(label: string): void {
        serial.writeLine("tag #" + label);
    }

    /**
    * Image reset all labels
    */
    //% blockId=image_classification_reset_all_labels block="Image Classification reset all labels"
    //% group="Image Classification" color="#0c9eed" weight=503
    export function ImageClassificationResetAllLabel(): void {
        serial.writeLine("tag #reset");
    }

    /**
    * Image classification label ready
    */
    //% blockId=image_classification_label_ready block="Image Classification label ready"
    //% group="Image Classification" color="#0c9eed" weight=502
    export function ImageClassificationLabelReady(): boolean {
        return newdata;
    }

    /**
    * Read Image classification label
    */
    //% blockId=image_classification_read_label block="Image Classification read label"
    //% group="Image Classification" color="#0c9eed" weight=501
    export function ImageClassificationReadLabel(): string {
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
}
