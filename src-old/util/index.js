import * as baseUtil from '@alipay/zm-h5-util';
import './bootstrap';
import ajax from './ajax';

const util = {
  ...baseUtil,
  ajax
};

window.util = util;
export default util;
