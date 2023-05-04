function InputSplitter(input) {
  let inputString = input;
  let digits = inputString.match(/[\d.\d\/]+/g) || "1";
  let letters = inputString.match(/[a-zA-Z]+$/g)[0];

  return [digits[0], letters];
}

function checkDiv(input) {
  let digits = input.split("/");
  if (digits.length > 2) {
    return false;
  }
  return digits;
}

function ConvertHandler() {
  
  this.getNum = function (input) {
    
    let result = InputSplitter(input)[0];
    let nums = checkDiv(result);
    if (!nums) {
      return undefined;
    }
    let num1 = nums[0];
    let num2 = nums[1] || "1";
    
    let initNum = parseFloat(num1) / parseFloat(num2);
    
    if (isNaN(num1) || isNaN(num2)) {
      return undefined;
    }
    
    return initNum;
  };

  this.getUnit = function (input) {
    
    let result = InputSplitter(input);
    if (!result || !result[1]) {
      return undefined;
    }
    
    let unit = result[1]?.toLowerCase();
    
    const metricUnits = {
      km: "km",
      mi: "mi",
      l: "L",
      gal: "gal",
      kg: "kg",
      lbs: "lbs"
    };
    
    return metricUnits[unit] || undefined;
  };

  this.getReturnUnit = function (initUnit) {
    
    let unit = initUnit?.toLowerCase();
    
    const unitConversion = {
      km: "mi",
      mi: "km",
      l: "gal",
      gal: "L",
      kg: "lbs",
      lbs: "kg"
    };
    
    return unitConversion[unit] || undefined;
  };

  this.spellOutUnit = function (initUnit) {
    
    let unit = initUnit?.toLowerCase();
    
    const unitSpelling = {
      km: "kilometers",
      mi: "miles",
      l: "liters",
      gal: "gallons",
      kg: "kilograms",
      lbs: "pounds"
    };
    
    return unitSpelling[unit] || undefined;
  };

  this.convert = function (initNum, initUnit) {
    
    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;
    let unit = initUnit?.toLowerCase();
    let result;

    switch (unit) {
      case "km":
        result = initNum / miToKm;
        break;
      case "mi":
        result = initNum * miToKm;
        break;
      case "l":
        result = initNum / galToL;
        break;
      case "gal":
        result = initNum * galToL;
        break;
      case "kg":
        result = initNum / lbsToKg;
        break;
      case "lbs":
        result = initNum * lbsToKg;
        break;
      default:
        result = undefined;
        break;
    }
    return Number(result?.toFixed(5));
  };

  this.getString = function (initNum, initUnit, returnNum, returnUnit) {
    // let preciseInitNum = parseFloat(initNum.toFixed(5));
    // let preciseReturnNum = parseFloat(returnNum.toFixed(5));

    return `${initNum} ${this.spellOutUnit(
      initUnit
    )} converts to ${returnNum} ${this.spellOutUnit(returnUnit)}`;
  };
}

module.exports = ConvertHandler;
