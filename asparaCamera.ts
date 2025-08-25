//% weight=100
//% block="asparaCamera"
//% icon="\uf030"
//% color="#00AAA0"
namespace asparaCamera {
    
    let updateTime = input.runningTime()
    let lastResult = ""
    let newdata:boolean = false;

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
            lastResult = serial.readUntil(serial.delimiters(Delimiters.NewLine));
            newdata = true;
        });
    }

    /***********************************************************************************************************************/
    /* Green/Red                                                                                                           */
    /***********************************************************************************************************************/
    /**
    * Init detect Green / Red lettuce
    */
    //% blockId=green_red_init block="Initialize Green/Red"
    //% group="Green Red" color="#a3b032" weight=105
    export function GreenRedInit(): void {
        serial.writeLine("start green red")
    }

    /**
    * Start detect Green / Red lettuce
    */
    //% blockId=start_green_red block="Start Green/Red"
    //% group="Green Red" color="#a3b032" weight=104
    export function StartGreenRed(): void {
        serial.writeLine("detect")
    }

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
        let ret = lastResult
        lastResult = ""
        newdata = false
        return ret
    }

    /***********************************************************************************************************************/
    /* Color calibration                                                                                                   */
    /***********************************************************************************************************************/
    /**
    * Init color calibration
    */
    //% blockId=color_calibration_init block="Initialize Color Calibration"
    //% group="Color calibration" color="#b03290" weight=105
    export function ColorCalibrationInit(): void {
        serial.writeLine("start color calibration")
    }

    /**
    * Stop color calibration
    */
    //% blockId=stop_color_calibration block="Stop Color Calibration"
    //% group="Color calibration" color="#b03290" weight=103
    export function StopColorCalibration(): void {
        serial.writeLine("stop color calibration")
        serial.writeLine("stop color calibration")
        lastResult = ""
        newdata = false
    }

    /**
    * Pick color
    */
    //% blockId=pick_color block="Pick Color"
    //% group="Color calibration" color="#b03290" weight=102
    export function PickColor(): void {
        serial.writeLine("pick color")
    }
}