/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Code generator for the Arduino serial blocks.
 *     Arduino Serial library docs: https://www.arduino.cc/en/Reference/Serial
 *
 * TODO: There are more functions that can be added:
 *       http://arduino.cc/en/Reference/Serial
 */
'use strict';

goog.provide('Blockly.Arduino.serial');

goog.require('Blockly.Arduino');


/**
 * Code generator of block for writing to the serial com.
 * Arduino code: loop { Serial.print(X); }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
Blockly.Arduino['serial_print'] = function(block) {
    var content = Blockly.Arduino.valueToCode(
            block, 'CONTENT', Blockly.Arduino.ORDER_ATOMIC) || '0';

    var code = 'Serial.print(' + content + ');\n';

    return code;
};


Blockly.Arduino['serial_println'] = function(block) {
    var content = Blockly.Arduino.valueToCode(
            block, 'CONTENT', Blockly.Arduino.ORDER_ATOMIC) || '0';

    var code = 'Serial.println(' + content + ');\n';

    return code;
};


Blockly.Arduino['serial_write'] = function(block) {
    var content = Blockly.Arduino.valueToCode(
            block, 'CONTENT', Blockly.Arduino.ORDER_ATOMIC) || '0';

    var code = 'Serial.write(' + content + ');\n';

    return code;
};

/**
 * Code generator for block for setting the serial com speed.
 * Arduino code: setup{ Serial.begin(X); }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code.
 */
Blockly.Arduino['serial_setup'] = function(block) {
    var serialSpeed = block.getFieldValue('SPEED');
    var serialSetupCode = 'Serial.begin(' + serialSpeed + ');';
    Blockly.Arduino.addSetup('serial_serial', serialSetupCode, true);
    var code = '';
    return code;
};
