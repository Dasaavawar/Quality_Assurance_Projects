const chai = require('chai');
let assert = chai.assert;

const ConvertHandler = require('../controllers/convertHandler.js');
let convertHandler = new ConvertHandler();

suite('Unit Tests', function(){
    
  test('convertHandler should correctly read a whole number input', function() {
    assert.equal(12, convertHandler.getNum('12mi'))
  });
    
  test('convertHandler should correctly read a decimal number input', function() {
    assert.equal(12.4, convertHandler.getNum('12.4kg'))
  });
    
  test('convertHandler should correctly read a fractional input', function() {
    assert.equal(0.75, convertHandler.getNum('3/4l'))
  });
  
  test('convertHandler should correctly read a fractional input with a decimal', function() {
    assert.equal(2.5, convertHandler.getNum('5.0/2km'))
  });
  
  test('convertHandler should correctly return an error on a double-fraction (i.e. 3/2/3)', function() {
    assert.equal(undefined, convertHandler.getNum('3/2/3gal'))
  });
  
  test('convertHandler should correctly default to a numerical input of 1 when no numerical input is provided', function() {
    assert.equal(1, convertHandler.getNum('mi'))
  });
  
  test('convertHandler should correctly read each valid input unit', function() {
    assert.equal('km', convertHandler.getUnit('12km'))
    assert.equal('mi', convertHandler.getUnit('22mi'))
    assert.equal('L', convertHandler.getUnit('32l'))
    assert.equal('gal', convertHandler.getUnit('42gal'))
    assert.equal('kg', convertHandler.getUnit('52kg'))
    assert.equal('lbs', convertHandler.getUnit('62lbs'))
  });
  
  test('convertHandler should return an error for an invalid input unit', function() {
    assert.equal(undefined, convertHandler.getUnit('12mu'))
  });
  
  test('convertHandler should return the correct return unit for each valid input unit', function() {
    assert.equal('mi', convertHandler.getReturnUnit('km'))
    assert.equal('km', convertHandler.getReturnUnit('mi'))
    assert.equal('gal', convertHandler.getReturnUnit('l'))
    assert.equal('L', convertHandler.getReturnUnit('gal'))
    assert.equal('lbs', convertHandler.getReturnUnit('kg'))
    assert.equal('kg', convertHandler.getReturnUnit('lbs'))
  });

  test('convertHandler should correctly return the spelled-out string unit for each valid input unit', function() {
    assert.equal('kilometers', convertHandler.spellOutUnit('km'))
    assert.equal('miles', convertHandler.spellOutUnit('mi'))
    assert.equal('liters', convertHandler.spellOutUnit('l'))
    assert.equal('gallons', convertHandler.spellOutUnit('gal'))
    assert.equal('kilograms', convertHandler.spellOutUnit('kg'))
    assert.equal('pounds', convertHandler.spellOutUnit('lbs'))
  });
  
  test('convertHandler should correctly convert gal to L', function() {
    assert.equal(45.42492, convertHandler.convert(12, 'gal'))
  });

  test('convertHandler should correctly convert L to gal', function() {
    assert.equal(5.81179, convertHandler.convert(22, 'L'))
  });

  test('convertHandler should correctly convert mi to km', function() {
    assert.equal(51.49888, convertHandler.convert(32, 'mi'))
  });

  test('convertHandler should correctly convert km to mi', function() {
    assert.equal(26.09765, convertHandler.convert(42, 'km'))
  });
    
  test('convertHandler should correctly convert lbs to kg', function() {
    assert.equal(114.64047, convertHandler.convert(52, 'kg'))
  });
    
  test('convertHandler should correctly convert kg to lbs', function() {
    assert.equal(28.1227, convertHandler.convert(62, 'lbs'))
  });
  
});