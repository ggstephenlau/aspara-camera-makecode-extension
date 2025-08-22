//% weight=100
//% block="asparaCamera"
//% icon="\uf030"
//% color="#00AAA0"
namespace asparaCamera {
    
    let updateTime = input.runningTime()

    /**
     * Init the asparaCamera library with serial connection
     * @param tx Tx pin; eg: SerialPin.P2
     * @param rx Rx pin; eg: SerialPin.P12 
     */
    //% blockId=asparaCamera_init block="asparaCamera init tx %tx rx %rx"
    //% group="Basic" weight=101 
    export function asparaCameraInit(tx: SerialPin, rx: SerialPin): void {
        serial.redirect(tx, rx, BaudRate.BaudRate115200);
        serial.setTxBufferSize(64)
        serial.setRxBufferSize(64)
        serial.readString()
        serial.writeString('\n\n')
        backgroundUpdateData()
    }

    function backgroundUpdateData(): void {
        control.inBackground(function () {
            while (1) {
                updateTime = input.runningTime()
                let a = serial.readLine()
                if (a.charAt(0) == 'K') {
                    let data = a.split(',')
                    if (data.length == 3) {
                        let x = parseInt(data[0])
                        let y = parseInt(data[1])
                        let z = parseInt(data[2])
                    }
                }
            }
        })
    }

    /**
    * Init detect Green / Red lettuce
    */
    //% blockId=green_red_init block="Initialize Green/Red"
    //% group="Green_Red" weight=103
    export function GreenRedInit(): void {
        serial.writeLine("start green red")
    }

    /**
    * Start detect Green / Red lettuce
    */
    //% blockId=start_green_red block="Start Green/Red"
    //% group="Green_Red" weight=102
    export function StartGreenRed(): void {
        serial.writeLine("detect")
    }

    /**
    * Stop detect Green / Red lettuce
    */
    //% blockId=stop_green_red block="Stop Green/Red"
    //% group="Green_Red" weight=101
    export function StopGreenRed(): void {
        serial.writeLine("stop green red")
    }
}