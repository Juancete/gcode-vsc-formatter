# GCode-Formatter README

This is a formatter for G-Code language.

[![Build Status](https://travis-ci.org/Juancete/gcode-vsc-formatter.svg?branch=master)](https://travis-ci.org/Juancete/gcode-vsc-formatter)[![GitHub](https://flat.badgen.net/github/release/Juancete/gcode-vsc-formatter)](https://github.com/Juancete/gcode-vsc-formatter)
[![VS Code Marketplace](https://vsmarketplacebadge.apphb.com/version/Juancete.gcode-formatter.svg) ![Downloads](https://vsmarketplacebadge.apphb.com/downloads-short/Juancete.gcode-formatter.svg) ![Installs](https://vsmarketplacebadge.apphb.com/installs-short/Juancete.gcode-formatter.svg)](https://marketplace.visualstudio.com/items?itemName=Juancete.gcode-formatter)[![License: MPL 2.0](https://img.shields.io/badge/License-MPL%202.0-brightgreen.svg)](https://opensource.org/licenses/MPL-2.0)

## Features

The G-code formatter separates the G, M, S, X, Y and Z commands, transforms the text to uppercase, separates the lines by semicolons, removes semicolons at the end of each line and finally (but not least) format each operation with at least two digits (For example G1 -> G01).

![feature G-Code](images/example.gif)