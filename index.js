/*jslint node:true, nomen:true, unparam:true*/

(function () {

    'use strict';

    var _ = require('underscore'),
        through2 = require('through2'),
        fs = require('fs'),
        cheerio = require('cheerio'),
        gutil = require('gulp-util'),
        path = require('path'),
        async = require('async'),
        favicons = require('favicons');

    module.exports = function (params) {

        function updateDocument(document, code, callback) {
            var options = { encoding: 'utf8' };
            async.waterfall([
                function (callback) {
                    fs.readFile(document, options, function (error, data) {
                        return callback(error, data);
                    });
                },
                function (data, callback) {
                    var $ = cheerio.load(data, { decodeEntities: false }),
                        target = $('head').length > 0 ? $('head') : $.root();
                    target.append(code.join('\n'));
                    return callback(null, $.html());
                },
                function (html, callback) {
                    fs.writeFile(document, html, options, function (error) {
                        return callback(error);
                    });
                }
            ], function (error) {
                return callback(error);
            });
        }

        return through2.obj(function (file, encoding, callback) {

            var self = this, documents, $;

            if (file.isNull()) {
                callback(null, file);
                return;
            }

            if (file.isStream()) {
                callback(new gutil.PluginError('gulp-favicons', 'Streaming not supported'));
                return;
            }

            favicons(file.contents, params, function (error, response) {

                _.each(response.images, function (image) {
                    self.push(new gutil.File({
                        path: image.name,
                        contents: image.contents
                    }));
                });

                _.each(response.files, function (file) {
                    self.push(new gutil.File({
                        path: file.name,
                        contents: new Buffer(file.contents)
                    }));
                });

                if (params.html) {
                    documents = (typeof params.html === 'object' ? params.html : [params.html]);
                    async.each(documents, function (document) {
                        var filepath = path.join(__dirname, document);
                        updateDocument(filepath, response.html, function (error) {
                            return callback(error);
                        })
                    }, function (error2) {
                        return callback(error || error2);
                    });
                } else {
                    return callback(error);
                }
            });

        });

    };

}());
