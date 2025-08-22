//% weight=100
//% block="asparaCamera"
//% icon="\uf030"
//% color="#00AAA0"
namespace asparaCamera {
    /**
     * Init the asparaCamera library with serial connection
     * @param tx Tx pin; eg: SerialPin.P2
     * @param rx Rx pin; eg: SerialPin.P12 
     */
    //% blockId=asparaCamera_init block="asparaCamera init tx %tx rx %rx"
    //% weight=101 group="Basic"
    export function asparaCameraInit(tx: SerialPin, rx: SerialPin): void {
        serial.redirect(tx, rx, BaudRate.BaudRate115200);
        serial.setTxBufferSize(64)
        serial.setRxBufferSize(64)
        serial.readString()
        serial.writeString('\n\n')
    }
}