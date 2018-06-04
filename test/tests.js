let assert = require('assert');
const UrlTools = require('../src/server/UrlTools');


describe('URL tests', function () {

    const inputIdA = 123456;
    const shortenedValueA = 'eCc';

    const inputIdB = '0123456';

    const utlInput = 'http://www.abc.net.au/';

    it('correctly encodes expected', function () {
        assert.strictEqual(UrlTools.encode(inputIdA), shortenedValueA, 'Expect encoded input to match ' + shortenedValueA)
    });

    it('correctly encodes expected', function () {
        assert.strictEqual(UrlTools.encode(10000), 'BKL', 'Expect encoded input to match BKL')
    });
    it('correctly encodes expected', function () {
        assert.strictEqual(UrlTools.encode(10001), 'BKw', 'Expect encoded input to match BKw')
    });
    it('correctly encodes expected', function () {
        assert.strictEqual(UrlTools.encode(10002), 'BKT', 'Expect encoded input to match BKT')
    });
    it('correctly encodes expected', function () {
        assert.strictEqual(UrlTools.encode(10003), 'BKy', 'Expect encoded input to match BKy')
    });
    it('correctly encodes expected', function () {
        assert.strictEqual(UrlTools.encode(10004), 'BKX', 'Expect encoded input to match BKX')
    });

    it('correctly decodes expected', function () {
        assert.strictEqual(UrlTools.decode(shortenedValueA), inputIdA, 'Expect decoded input to match ' + inputIdA)
    });

    it('correctly encodes expected', function () {
        assert.strictEqual(UrlTools.encode(inputIdB), shortenedValueA, 'Expect encoded input to match ' + shortenedValueA)
    });

    it('correctly decode expected', function () {
        assert.notStrictEqual(UrlTools.decode(shortenedValueA), inputIdB, 'Expect decoded input not to match ' + inputIdA)
    });

    it('decodes value as a number', function () {
        assert.strictEqual(typeof UrlTools.decode(shortenedValueA), "number", 'Expect type to match')
    });


});