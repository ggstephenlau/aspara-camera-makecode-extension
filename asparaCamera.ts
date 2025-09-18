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
        ColorTracking
        // GreenRed,
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

    /***********************************************************************************************************************/
    /* Basic Functions                                                                                                     */
    /***********************************************************************************************************************/
    /**
     * Init the asparaCamera library with serial connection
     * @param tx Tx pin; eg: SerialPin.P0
     * @param rx Rx pin; eg: SerialPin.P1
     */
    //% blockId=asparaCamera_init block="asparaCamera init tx %tx rx %rx"
    //% group="Basic" color="#00AAA0" weight=106
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
    //% blockId=asparaCamera_select_mode block="select %func mode"
    //% group="Basic" color="#00AAA0" weight=105
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
            // case ModeEnum.GreenRed:
            //     serial.writeLine("start green red")
            //     break;
        }
    }

    /***********************************************************************************************************************/
    /* Line tracking.                                                                                                     */
    /***********************************************************************************************************************/
    /**
    * Line tracking calibrate
    */
    //% blockId=line_tracking_calibrate block="Line Tracking Calibrate"
    //% group="Line tracking" color="#dc1489" weight=104
    export function LineTrackingCalibrate(): void {
        serial.writeLine("calibrate")
    }

    /**
    * Line tracking set color
    */
    //% blockId=line_tracking_set_color block="Line Tracking Set Color %color"
    //% group="Line tracking" color="#dc1489" weight=103
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
    //% group="Line tracking" color="#dc1489" weight=102
    export function LineTrackingCoordinatesReady(): boolean {
        return newdata;
    }

    /**
    * Line Tracking Read Coordinate X
    */
    //% blockId=line_tracking_read_coordinate_x block="Line Tracking Read Coordinate %coordxy"
    //% group="Line tracking" color="#dc1489" weight=101
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
    * Color tracking calibrate
    */
    //% blockId=color_tracking_calibrate block="Color Tracking Calibrate"
    //% group="Color tracking" color="#dcdc14" weight=204
    export function ColorTrackingCalibrate(): void {
        serial.writeLine("calibrate")
    }

    /**
    * Color tracking set color
    */
    //% blockId=color_tracking_set_color block="Color Tracking Set Color %color"
    //% group="Color tracking" color="#dcdc14" weight=203
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
    //% group="Color tracking" color="#dcdc14" weight=202
    export function ColorTrackingCoordinatesReady(): boolean {
        return newdata;
    }

    /**
    * Color Tracking Read Coordinate X
    */
    //% blockId=color_tracking_read_coordinate_x block="Color Tracking Read Coordinate X"
    //% group="Color tracking" color="#dcdc14" weight=201
    export function ColorTrackingReadCoordinateX(): number {
        let retnum = -1;

        readNewdata = true;
        while(lock){ basic.pause(1); };
        if (!lock) {
            lock = true;
            if (lastResult.length > 0) {
                // Parse the JSON string
                let parsed = JSON.parse(lastResult);
                // Access the y1 property and return it
                if (parsed && parsed.x1 !== undefined) {
                    retnum = parsed.x1;
                }
            }
            lastResult = "";
            newdata = false;
            lock = false;
        }
        readNewdata = false;
        return retnum;
    }

    /**
    * Color Tracking Read Coordinate Y
    */
    //% blockId=color_tracking_read_coordinate_y block="Color Tracking Read Coordinate Y"
    //% group="Color tracking" color="#dcdc14" weight=201
    export function ColorTrackingReadCoordinateY(): number {
        let retnum = -1;

        readNewdata = true;
        while(lock){ basic.pause(1); };
        if (!lock) {
            lock = true;
            if (lastResult.length > 0) {
                // Parse the JSON string
                let parsed = JSON.parse(lastResult);
                // Access the y1 property and return it
                if (parsed && parsed.y1 !== undefined) {
                    retnum = parsed.y1;
                }
            }
            lastResult = "";
            newdata = false;
            lock = false;
        }
        readNewdata = false;
        return retnum;
    }
}

    /***********************************************************************************************************************/
    /* Green/Red                                                                                                           */
    /***********************************************************************************************************************/
    // /**
    // * Init detect Green / Red lettuce
    // */
    // //% blockId=green_red_init block="Initialize Green/Red"
    // //% group="Green Red" color="#a3b032" weight=105
    // export function GreenRedInit(): void {
    //     serial.writeLine("start green red")
    // }

    // /**
    // * Start detect Green / Red lettuce
    // */
    // //% blockId=start_green_red block="Start Green/Red"
    // //% group="Green Red" color="#a3b032" weight=104
    // export function StartGreenRed(): void {
    //     serial.writeLine("detect")
    // }

    // /**
    // * Green / Red result ready
    // */
    // //% blockId=green_red_ready block="Green/Red result ready"
    // //% group="Green Red" color="#a3b032" weight=102
    // export function GreenRedResultReady(): boolean {
    //     return newdata;
    // }

    // /**
    // * Read Green / Red lettuce result
    // */
    // //% blockId=read_green_red_result block="Read Green/Red Result"
    // //% group="Green Red" color="#a3b032" weight=101
    // export function ReadGreenRedResult(): string {
    //     let ret = ""
    //     readNewdata = true;
    //     while(lock){ basic.pause(1); };
    //     if (!lock) {
    //         lock = true;
    //         ret = lastResult
    //         lastResult = ""
    //         newdata = false
    //         lock = false;
    //     }
    //     readNewdata = false;
    //     return ret
    // }
