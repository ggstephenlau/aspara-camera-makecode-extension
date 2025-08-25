//% weight=100
//% block="asparaCamera"
//% icon="\uf030"
//% color="#00AAA0"
namespace asparaCamera {
    
    let updateTime = input.runningTime()
    let lastResult = ""
    let newdata:boolean = false;

    /**
     * Init the asparaCamera library with serial connection
     * @param tx Tx pin; eg: SerialPin.P0
     * @param rx Rx pin; eg: SerialPin.P1
     */
    //% blockId=asparaCamera_init block="asparaCamera init tx %tx rx %rx"
    //% group="Basic" weight=106
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

    /**
    * Init detect Green / Red lettuce
    */
    //% blockId=green_red_init block="Initialize Green/Red"
    //% group="Green_Red" weight=105
    export function GreenRedInit(): void {
        serial.writeLine("start green red")
    }

    /**
    * Start detect Green / Red lettuce
    */
    //% blockId=start_green_red block="Start Green/Red"
    //% group="Green_Red" weight=104
    export function StartGreenRed(): void {
        serial.writeLine("detect")
    }

    /**
    * Stop detect Green / Red lettuce
    */
    //% blockId=stop_green_red block="Stop Green/Red"
    //% group="Green_Red" weight=103
    export function StopGreenRed(): void {
        serial.writeLine("stop green red")
    }

    /**
    * Green / Red result ready
    */
    //% blockId=green_red_ready block="Green/Red result ready"
    //% group="Green_Red" weight=102
    export function GreenRedResultReady(): boolean {
        return newdata;
    }

    /**
    * Read Green / Red lettuce result
    */
    //% blockId=read_green_red_result block="Read Green/Red"
    //% group="Green_Red" weight=101
    export function ReadGreenRedResult(): string {
        let ret = lastResult
        lastResult = ""
        newdata = false
        return ret
    }
}