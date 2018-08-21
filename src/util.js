/**
 * @fileOverview The util method based on the lodash.
 * @author dxq613@gmail.com
 */
const G = require('@antv/g/lib');
const Utils = require('@antv/util/lib');

const CommonUtil = G.CommonUtil;

const Util = CommonUtil.assign({
  DomUtil: G.DomUtil,
  MatrixUtil: G.MatrixUtil,
  PathUtil: G.PathUtil,
  isFinite,
  isNaN
}, Utils, CommonUtil);

module.exports = Util;
