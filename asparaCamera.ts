//% weight=100
//% block="asparaCamera"
//% icon="\uf030"
//% color="#00AAA0"
namespace asparaCamera {
    let lastResult = ""
    let readNewdata:boolean = false;
    let lock:boolean = false
    let newdata:boolean = false;

    export enum FullFunction {
        //% block="none mode"
        NoneMode = 0x0,
        //% block="Green/Red"
        GreenRed = 0x1,
        //% block="Color Tracking"
        ColorTracking = 0x2,
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
    * Set the function of asparaCamera
    */
    //% blockId=asparaCamera_switch_function block="switch function %func"
    //% group="Basic" color="#00AAA0" weight=105
    //% func.fieldEditor="gridpicker"
    //% func.fieldOptions.columns=3
    export function switchFunction(func: FullFunction): void {
        switch(func) {
            case FullFunction.NoneMode:
                break;
            case FullFunction.GreenRed:
                serial.writeLine("start green red")
                break;
            case FullFunction.ColorTracking:
                serial.writeLine("start color tracking")
                break;
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

    /**
    * Stop detect Green / Red lettuce
    */
    //% blockId=stop_green_red block="Stop Green/Red"
    //% group="Green Red" color="#a3b032" weight=103
    export function StopGreenRed(): void {
        serial.writeLine("stop green red")
    }

    /**
    * Green / Red result ready
    */
    //% blockId=green_red_ready block="Green/Red result ready"
    //% group="Green Red" color="#a3b032" weight=102
    export function GreenRedResultReady(): boolean {
        return newdata;
    }

    /**
    * Read Green / Red lettuce result
    */
    //% blockId=read_green_red_result block="Read Green/Red Result"
    //% group="Green Red" color="#a3b032" weight=101
    export function ReadGreenRedResult(): string {
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

    // /***********************************************************************************************************************/
    // /* Color calibration                                                                                                   */
    // /***********************************************************************************************************************/
    // /**
    // * Init color calibration
    // */
    // //% blockId=color_calibration_init block="Initialize Color Calibration"
    // //% group="Color calibration" color="#b03290" weight=105
    // export function ColorCalibrationInit(): void {
    //     serial.writeLine("start color calibration")
    // }

    // /**
    // * Stop color calibration
    // */
    // //% blockId=stop_color_calibration block="Stop Color Calibration"
    // //% group="Color calibration" color="#b03290" weight=103
    // export function StopColorCalibration(): void {
    //     serial.writeLine("stop color calibration")
    //     serial.writeLine("stop color calibration")
    //     lastResult = ""
    //     newdata = false
    // }

    // /**
    // * Pick color
    // */
    // //% blockId=pick_color block="Pick Color"
    // //% group="Color calibration" color="#b03290" weight=102
    // export function PickColor(): void {
    //     serial.writeLine("pick color")
    // }

    /***********************************************************************************************************************/
    /* Color tracking.                                                                                                     */
    /***********************************************************************************************************************/
    // /**
    // * Init color tracking
    // */
    // //% blockId=color_tracking_init block="Initialize Color Tracking"
    // //% group="Color tracking" color="#dcdc14" weight=105
    // export function ColorTrackingInit(): void {
    //     serial.writeLine("start color tracking")
    // }

    /**
    * Stop color tracking
    */
    //% blockId=stop_color_tracking block="Stop Color Tracking"
    //% group="Color tracking" color="#dcdc14" weight=104
    export function StopColorTracking(): void {
        serial.writeLine("stop color tracking")
        lastResult = ""
        newdata = false
    }

    // /**
    // * Get coordinates
    // */
    // //% blockId=get_coordinates block="Get Coordinates"
    // //% group="Color tracking" color="#dcdc14" weight=103
    // export function GetCoordinates(): void {
    //     serial.writeLine("get coordinates")
    // }

    /**
    * Coordinates ready
    */
    //% blockId=coordinates_ready block="Coordinates ready"
    //% group="Color tracking" color="#dcdc14" weight=102
    export function CoordinatesReady(): boolean {
        return newdata;
    }

    /**
    * Read Coordinate X
    */
    //% blockId=read_coordinate_x block="Read Coordinate X"
    //% group="Color tracking" color="#dcdc14" weight=101
    export function ReadCoordinateX(): number {
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
    * Read Coordinate Y
    */
    //% blockId=read_coordinate_y block="Read Coordinate Y"
    //% group="Color tracking" color="#dcdc14" weight=101
    export function ReadCoordinateY(): number {
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
