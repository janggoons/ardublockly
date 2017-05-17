/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Blocks for Arduino Tone generation
 *     The Arduino function syntax can be found at
 *     https://www.arduino.cc/en/Reference/tone
 *
 */
'use strict';

goog.provide('Blockly.Blocks.tone');

goog.require('Blockly.Blocks');
goog.require('Blockly.Types');

/** Common HSV hue for all blocks in this category. */
Blockly.Blocks.tone.HUE = 250;

Blockly.Blocks['io_tone'] = {
    init: function() {
        this.jsonInit(
            {
                "type": "io_tone",
                "message0": Blockly.Msg.ARD_SETTONE,
                "args0": [
                    {
                        "type": "field_dropdown",
                        "name": "TONEPIN",
                        "options": Blockly.Arduino.Boards.selected.digitalPins
                    },
                    {
                        "type": "input_value",
                        "name": "FREQUENCY",
                        "check": Blockly.Types.NUMBER.output
                    }
                ],
                "previousStatement": null,
                "nextStatement": null,
                "inputsInline": true,
                "colour": Blockly.Blocks.tone.HUE,
                "tooltip": Blockly.Msg.ARD_TONE_TIP,
                "helpUrl": 'http://arduino.cc/en/Reference/tone'
            }
        );
    },
    updateFields : function() {
        Blockly.Arduino.Boards.refreshBlockFieldDropdown(
            this, 'PIN', 'digitalPins');
    }
};

Blockly.Blocks['io_tone_duration'] = {
    init: function() {
        this.jsonInit(
            {
                "type": "io_tone_duration",
                "message0": Blockly.Msg.ARD_SETTONE_DURATION,
                "args0": [
                    {
                        "type": "field_dropdown",
                        "name": "TONEPIN",
                        "options": Blockly.Arduino.Boards.selected.digitalPins
                    },
                    {
                        "type": "input_value",
                        "name": "FREQUENCY",
                        "check": Blockly.Types.NUMBER.output
                    },
                    {
                        "type": "input_value",
                        "name": "DURATION",
                        "check": Blockly.Types.NUMBER.output
                    }
                ],
                "previousStatement": null,
                "nextStatement": null,
                "inputsInline": true,
                "colour": Blockly.Blocks.tone.HUE,
                "tooltip": Blockly.Msg.ARD_TONE_TIP,
                "helpUrl": 'http://arduino.cc/en/Reference/tone'
            }
        );
    },
    updateFields : function() {
        Blockly.Arduino.Boards.refreshBlockFieldDropdown(
            this, 'PIN', 'digitalPins');
    }
};

// Blockly.Blocks['io_tone'] = {
//   init: function() {
//     this.appendDummyInput()
//         .appendField(Blockly.Msg.ARD_SETTONE)
//         .appendField(new Blockly.FieldDropdown(
//             Blockly.Arduino.Boards.selected.digitalPins), "TONEPIN");
//     this.appendValueInput("FREQUENCY")
//         .setCheck(Blockly.Types.NUMBER.checkList)
//         .appendField(Blockly.Msg.ARD_TONEFREQ);
//     this.setInputsInline(true);
//     this.setPreviousStatement(true);
//     this.setNextStatement(true);
//     this.setColour(Blockly.Blocks.tone.HUE);
//     this.setTooltip(Blockly.Msg.ARD_TONE_TIP);
//     this.setHelpUrl('https://www.arduino.cc/en/Reference/tone');
//   },
//   onchange: function() {
//     var freq = Blockly.Arduino.valueToCode(this, "FREQUENCY", Blockly.Arduino.ORDER_ATOMIC)
//     if (freq < 31 || freq > 65535) {
//       this.setWarningText(Blockly.Msg.ARD_TONE_WARNING, 'io_tone');
//     } else {
//       this.setWarningText(null, 'io_tone');
//     }
//   },
//   /** @return {!string} The type of input value for the block, an integer. */
//   getBlockType: function() {
//     return Blockly.Types.NUMBER;
//   }
// };

Blockly.Blocks['io_notone'] = {
    init: function() {
        this.jsonInit(
            {
                "type": "io_notone",
                "message0": Blockly.Msg.ARD_NOTONE,
                "args0": [
                    {
                        "type": "field_dropdown",
                        "name": "TONEPIN",
                        "options": Blockly.Arduino.Boards.selected.digitalPins
                    }
                ],
                "previousStatement": null,
                "nextStatement": null,
                "inputsInline": true,
                "colour": Blockly.Blocks.tone.HUE,
                "tooltip": Blockly.Msg.ARD_NOTONE_TIP,
                "helpUrl": 'http://arduino.cc/en/Reference/noTone'
            }
        );
    },
    getBlockType: function() {
        return Blockly.Types.NUMBER;
    }
};

// Blockly.Blocks['io_notone'] = {
//     init: function() {
//         this.appendDummyInput()
//             .appendField(Blockly.Msg.ARD_NOTONE)
//             .appendField(new Blockly.FieldDropdown(
//                 Blockly.Arduino.Boards.selected.digitalPins), "TONEPIN");
//         this.setPreviousStatement(true);
//         this.setNextStatement(true);
//         this.setColour(Blockly.Blocks.tone.HUE);
//         this.setTooltip(Blockly.Msg.ARD_NOTONE_TIP);
//         this.setHelpUrl('https://www.arduino.cc/en/Reference/noTone');
//     },
//     /** @return {!string} The type of input value for the block, an integer. */
//     getBlockType: function() {
//         return Blockly.Types.NUMBER;
//     }
// };
