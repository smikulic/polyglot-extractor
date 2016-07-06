#!/usr/bin/env node

//----------------------------- Imports & Configs ------------------------------
// Imports
const program = require('commander');
const fs = require('fs');

// Globals
var MAIN_PO_FILE;
const MAIN_PO_FILE_NAME = 'app.po';
const PO_HEADER =
  'msgid ""\n' +
  'msgstr ""\n' +
  'Project-Id-Version:1233\n' +
  'Report-Msgid-Bugs-To:Sinisa Mikulic\n' +
  'Last-Translator:Sinisa Mikulic\n' +
  'Language-Team:Sinisa\n' +
  'Language:en\n' +
  'Plural-Forms:nplurals=2; plural=(n != 1);\n' +
  'MIME-Version:1.0\n' +
  'Content-Type:text/plain; charset=UTF-8\n' +
  'Content-Transfer-Encoding:8bit\n\n';

//----------------------------- Main program -----------------------------------
// Start CLI program with dir as an argument
program.arguments('<dir>').parse(process.argv);

// Check if file already exists
if (fs.existsSync(MAIN_PO_FILE_NAME)) {
  // do nothing if the file exists
} else {
  // Forces creation of an empty file
  MAIN_PO_FILE = fs.closeSync(fs.openSync(MAIN_PO_FILE_NAME, 'w'));

  addPoFileHeader();
  handleExtraction()
}


//----------------------------- Generators -------------------------------------
// Add po file header
function addPoFileHeader() {
  fs.appendFileSync(MAIN_PO_FILE_NAME, PO_HEADER, 'utf8');
}

// Handle Extraction
function handleExtraction () {
  // Handle polyglot extraction for every file in directory
  process.argv.forEach(function (filename, index, array) {
    // escapes configured paths in array (!!! MAYBE A BETTER WAY !!!)
    if (index > 1) {

      handlePolyglotExtraction(filename);

    }
  });
}

// Extract polyglot
function handlePolyglotExtraction (filename) {
  console.log("Update polyglot translation keys: ", filename)
  var text = fs.readFileSync(filename, 'utf8');

  var polyglotStrings = text.match(/polyglot.t\("(.*?)\"/g).map(function (val) {
    return val.replace(/polyglot.t\(/g,'');
  });

  var dataToWrite = generatePoMessage(polyglotStrings, filename);

  fs.appendFileSync(MAIN_PO_FILE_NAME, dataToWrite, 'utf8');
};

// Generate po Message object
function generatePoMessage (polyglotStrings, filename) {
  var poMsgObject = polyglotStrings.map(function (keyword) {
    var messageFileName = '#:' + filename + '\n';
    var messageMsgId = 'msgid ' + keyword + '\n';
    var messageMsgStr = 'msgstr ""\n\n';

    return messageFileName + messageMsgId + messageMsgStr;
  });

  return poMsgObject;
}
