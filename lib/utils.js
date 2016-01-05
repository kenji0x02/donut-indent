/**
 * donut-indent
 * Copyright (c) 2016, kenji0x02. (MIT Licensed)
 * https://github.com/kenji0x02/donut-indent
 */
var headingNumber = function(hObject){
  if(hObject !== undefined) {
    return hObject.tagName.replace('H', '') - 0;
  }else {
    return null;
  }
} 

module.exports = {
  headingNumber: headingNumber
}
