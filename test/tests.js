let assert = require('assert');
const UrlTools = require('../src/UrlTools');


describe('URL tests', function() {

    const inputId = '123456';
    const utlInput = 'http://www.abc.net.au/';
    const shortenedValue = 'eCc';

    it('encode equals expected', function () {
        assert.equal(UrlTools.encode(inputId), shortenedValue, 'Expect encoded input to match')
    });

    it('decode equals expected', function () {
        assert.equal(UrlTools.decode(shortenedValue), inputId, 'Expect decoded input to match')
    });

});