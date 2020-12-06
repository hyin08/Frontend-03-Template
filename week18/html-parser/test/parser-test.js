var assert = require('assert');

import { parseHTML } from '../src/parser';

describe('parse html: ', function() {
    it('<a></a>', function () {
        let tree = parseHTML('<a></a>');
        assert.strictEqual(tree.children[0].tagName, 'a');
        assert.strictEqual(tree.children[0].children.length, 0);
    });

    it('<a href="//time.geekbang.org"></a>', function () {
        let tree = parseHTML('<a href="//time.geekbang.org"></a>');
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].children.length, 0);
    });
    it('<a href></a>', function () {
        let tree = parseHTML('<a href></a>');
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].children.length, 0);
    });
    it('<a href id></a>', function () {
        let tree = parseHTML('<a href id></a>');
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].children.length, 0);
    });
    it('<a href="abc" id></a>', function () {
        let tree = parseHTML('<a href="abc" id></a>');
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].children.length, 0);
    });
    it('<a href=\'abc\' id></a>', function () {
        let tree = parseHTML('<a href=\'abc\' id></a>');
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].children.length, 0);
    });
    it('<a id=abc></a>', function () {
        let tree = parseHTML('<a id=abc></a>');
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].children.length, 0);
    });
    it('<a id=abc />', function () {
        let tree = parseHTML('<a id=abc />');
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].children.length, 0);
    });
    it('<a />', function () {
        let tree = parseHTML('<a />');
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].children.length, 0);
    });
    it('<a/>', function () {
        let tree = parseHTML('<a/>');
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].children.length, 0);
    });
    it('<A /> upper case', function () {
        let tree = parseHTML('<A />');
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].children.length, 0);
    });
    it('<>', function () {
        let tree = parseHTML('<>');
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].type, "text");
    });
    it('<div>test</div>', function () {
        let tree = parseHTML('<div>test</div>');
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].children.length, 1);
    });
    it('<div>test</p>', function () {
        assert.throws(() => parseHTML('<div>test</p>'), Error, "Tag start end doesn't match");
    });
    it(`compute css`, function () {
        let tree = parseHTML(`<head><style>
    #container {
        width:500px;
    }</style></head><body>
        <div id="container"></div>
    </body>`);
        assert.strictEqual(tree.children.length, 2);
        assert.strictEqual(tree.children[0].children.length, 1);
    });
    it(`compute css 2`, function () {
        let tree = parseHTML(`<head><style>
    div {
        width:500px;
    }</style></head><body>
        <div id="container"></div>
    </body>`);
        assert.strictEqual(tree.children.length, 2);
        assert.strictEqual(tree.children[0].children.length, 1);
    });
    it(`compute css 3`, function () {
        let tree = parseHTML(`<head><style>
    .a {
        width:500px;
    }
    .b {
        height: 100px;
    }</style></head><body>
        <div class="a b"></div>
    </body>`);
        assert.strictEqual(tree.children.length, 2);
        assert.strictEqual(tree.children[0].children.length, 1);
    });
})
