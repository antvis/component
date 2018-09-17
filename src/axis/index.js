
const Axis = require('./base');
const PolarCircle = require('./polar-circle');
const PolarLine = require('./polar-line');

Axis.Base = Axis;
Axis.Circle = PolarCircle;
Axis.Grid = require('./grid');
Axis.Helix = require('./helix');
Axis.Line = PolarLine;
Axis.PolarCircle = PolarCircle;
Axis.PolarLine = PolarLine;
Axis.Polyline = require('./polyline');

module.exports = Axis;
