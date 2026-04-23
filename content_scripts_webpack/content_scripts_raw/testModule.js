/*
 * Copyright 2026 Andrew Detering, Kelowna Ngoyi, James Whaley
 *
 * This file is part of SecondGlance.
 *
 * SecondGlance is free software: you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by the Free
 * Software Foundation, either version 3 of the License, or (at your option)
 * any later version.
 *
 * SecondGlance is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
 * more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with SecondGlance. If not, see <https://www.gnu.org/licenses/>.
 */

// UNUSED. Module for testing.
// Code by James Whaley

class TestModule extends Module
{
    constructor()
    {
        super();

        this.options = {

            testThingOne : {
                type : "select",
                optionOne : true,
                optionTwo : false
            },

            testThingTwo : {
                type : "select",
                optionOne : 1,
                optionTwo : 2,
                optionThree : 3
            },

            testThingThree : {
                type : "text"
            }
        }
    }

    scanPage()
    {
        console.log("Settings keys: " + Object.keys(this.settings).toString() + "\n"
                    + "Settings values: " + Object.values(this.settings).toString() + "\n");
    }
}
