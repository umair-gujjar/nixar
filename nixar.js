// Generated by LiveScript 1.3.1
(function(){
  module.exports = function(cmd){
    process.title = cmd;
    return require('xonom').service('start', function(){}).run(function(){
      return require('colors');
    }).service('p', function(){
      return require('prelude-ls');
    }).service('repo', function(){
      return {
        commands: []
      };
    }).service('parser', function(p){
      return {
        numbers: function(mask, last){
          var index, transform;
          if ((mask != null ? mask : "") === "") {
            return [0];
          }
          index = function(str){
            return function(it){
              return it - 1;
            }(
            parseInt(
            str));
          };
          transform = function(str){
            var getInt, args, res;
            getInt = function(str){
              switch (false) {
              case str !== 'first':
                return 0;
              case str !== 'last':
                return last;
              default:
                return index(str);
              }
            };
            args = p.map(function(it){
              return getInt(it);
            })(
            p.split('-')(
            str));
            res = (function(){
              var i$, to$, results$ = [];
              switch (false) {
              case !(args.length < 2):
                return getInt(str);
              default:
                for (i$ = args[0], to$ = args[1]; i$ <= to$; ++i$) {
                  results$.push(i$);
                }
                return results$;
              }
            }());
            return res;
          };
          return p.flatten(
          p.map(transform)(
          p.split(/[ ]+/)(
          mask)));
        }
      };
    }).service('cat', function(){
      return {
        compile: function(){
          var fs, moment, nsh, hl, parser, highlight, es, pictureTube;
          fs = require('fs');
          moment = require('moment');
          nsh = require('node-syntaxhighlighter');
          hl = require('highlight').Highlight;
          parser = require('html-to-json');
          highlight = function(code, type, callback){
            var language, process, replacer;
            language = nsh.getLanguage(type, false);
            if (language != null) {
              process = function(item){
                var type, children, ref$, ref1$, ref2$, ref3$, ref4$, data;
                type = item.attribs ? item.attribs['class'] : 'text';
                children = function(color){
                  var content, lines;
                  content = item.children.map(process);
                  lines = color != null ? content.map(function(it){
                    return it[color];
                  }) : content;
                  if (lines[0] === null) {
                    return null;
                  } else {
                    return lines.join("");
                  }
                };
                switch (type != null && ((ref$ = type.match(/^[a-z]+/)) != null && ref$[0])) {
                case 'text':
                  if (item.data !== " " && ((ref1$ = item.parent) != null ? (ref2$ = ref1$.attribs) != null ? (ref3$ = ref2$['class']) != null ? (ref4$ = ref3$.match(/^[a-z]+/)) != null ? ref4$[0] : void 8 : void 8 : void 8 : void 8) === 'line') {
                    return null;
                  }
                  return item.data;
                case 'gutter':
                  return children('blue');
                case 'code':
                  return children('green');
                case 'keyword':
                  return children('green');
                case 'plain':
                  return children();
                case 'line':
                  data = children();
                  if (data !== null) {
                    return data + '\n';
                  } else {
                    return "";
                  }
                  break;
                case '':
                  return children();
                default:
                  return children('yellow');
                }
              };
              return parser.parse(nsh.highlight(code, language), function(err, data){
                var res;
                res = process(data.root()[0]);
                return callback(res.substr(0, res.lastIndexOf('\n')));
              });
            } else {
              replacer = function(str){
                var type, value;
                type = str.match('class="([a-z]+)"')[1];
                value = str.match(">([^<]+)<")[1];
                switch (type) {
                case 'keyword':
                  return value.green;
                case 'string':
                  return value.yellow;
                case 'number':
                  return value.magenta;
                default:
                  return value;
                }
              };
              return callback(hl(code).replace(/<\/?[a-z]+[^>]*>[^<]+<\/[^>]+>/g, replacer));
            }
          };
          es = require('event-stream');
          pictureTube = require('picture-tube');
          return function(mask, input, callback){
            var path, extension, ref$, lines, stats, size, colored, arr, res, tube, print, end;
            path = process.cwd() + '/' + input;
            extension = (ref$ = path.match(/[a-z]+$/)) != null ? ref$[0] : void 8;
            lines = function(){
              return fs.readFileSync(input).toString('utf8').split(/\n/);
            };
            if (!fs.existsSync(path)) {
              callback(["file '" + path + "' not exists"]);
              return;
            }
            stats = fs.lstatSync(path);
            if (!stats.isFile()) {
              return callback(["'" + path + "' is not a file"]);
            } else if ((mask != null ? mask : "") !== "") {
              return callback((function(){
                switch (mask) {
                case 'lines':
                  return lines().map(function(it){
                    return (input + " ").yellow + it;
                  });
                case 'modified':
                  return [(input + " ").yellow + moment(moment()).diff(stats['mtime'], 'seconds').toString() + ' seconds ago'.gray + ' ' + stats['mtime']];
                case 'created':
                  return [(input + " ").yellow + moment(moment()).diff(stats['ctime'], 'seconds').toString() + ' seconds ago'.gray + ' ' + stats['ctime']];
                case 'size':
                  size = parseInt(stats['size']);
                  colored = function(num, w){
                    if (num > 0) {
                      return num + " " + w;
                    } else {
                      return (num + " " + w).gray;
                    }
                  };
                  arr = [(input + "").yellow, colored(size, "b"), "/".gray, colored(Math.round(size / 1024), 'kb'), "/".gray, colored(Math.round(size / Math.pow(1024, 2)), 'mb'), "/".gray, colored(Math.round(size / Math.pow(1024, 3)), 'gb')];
                  return [arr.join(' ')];
                default:
                  return 'mask is not supported';
                }
              }()));
            } else if (extension !== 'png') {
              return highlight(lines().join("\n"), extension, function(data){
                return callback([data]);
              });
            } else {
              res = [];
              tube = new pictureTube();
              print = function(data){
                return res.push(data.toString());
              };
              end = function(){
                callback([res.join('')]);
                return res.length = 0;
              };
              return fs.createReadStream(input).pipe(tube).pipe(es.through(print, end));
            }
          };
        }
      };
    }).run(__dirname + "/compiled-commands/*.js").run(function(repo, p){
      var jargs, argv, lines, print, printLines, commands, build, nothingLines, lineLines, lineLine, linesLines, linesLine, readline, rl;
      jargs = require('yargs').completion('completion', function(current, argv){
        return ['foo', 'bar'];
      }).argv;
      argv = jargs._.join(' ');
      lines = [];
      print = function(res){
        if (res != null) {
          return console.log(res);
        }
      };
      printLines = function(items){
        return items != null ? items.forEach(print) : void 8;
      };
      commands = repo.commands;
      p.each(bind$(commands, 'push'))(
      p.flatten(
      p.map(function(com){
        return com.aliases.map(function(it){
          return {
            name: it,
            compile: com.compile,
            input: com.input,
            output: com.output
          };
        });
      })(
      p.filter(function(it){
        return it.aliases != null && it.enabled;
      })(
      commands))));
      build = function(type){
        return p.pairsToObj(
        p.map(function(it){
          return [it.name, it.compile()];
        })(
        p.filter(function(it){
          return it.input + "-" + it.output === type;
        })(
        p.filter(function(it){
          return it.enabled;
        })(
        commands))));
      };
      nothingLines = build('nothing-lines');
      lineLines = build('line-lines');
      lineLine = build('line-line');
      linesLines = build('lines-lines');
      linesLine = build('lines-line');
      if (nothingLines[cmd] != null) {
        if (typeof nothingLines[cmd] == 'function') {
          nothingLines[cmd](null, argv, printLines);
        }
        return;
      }
      readline = require('readline');
      rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
      });
      rl.on('line', function(line){
        if (lineLines[cmd] != null || lineLine[cmd] != null) {
          if (typeof lineLines[cmd] == 'function') {
            lineLines[cmd](argv, line, printLines);
          }
          return print(typeof lineLine[cmd] == 'function' ? lineLine[cmd](argv, line) : void 8);
        } else {
          return lines.push(line);
        }
      });
      return rl.on('close', function(){
        var ref$, res;
        if (typeof linesLines[cmd] == 'function') {
          if ((ref$ = linesLines[cmd](argv, lines)) != null) {
            ref$.forEach(print);
          }
        }
        res = typeof linesLine[cmd] == 'function' ? linesLine[cmd](argv, lines) : void 8;
        if (res != null) {
          return print(res);
        }
      });
    });
  };
  function bind$(obj, key, target){
    return function(){ return (target || obj)[key].apply(obj, arguments) };
  }
}).call(this);
