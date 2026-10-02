function generateTimestamp() {
var date = new Date();
var yyyy = date.getFullYear().toString();
var mm = (date.getMonth() + 1).toString().padStart(2, '0');
var dd = date.getDate().toString().padStart(2, '0');
return yyyy + mm + dd;
}

function escapeCSVValue(value) {
if (value === null || value === undefined) {
return '';
}
var stringValue = value.toString();
if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
return '"' + stringValue.replace(/"/g, '""') + '"';
}
return stringValue;
}

function triggerCSVDownload(csvContent, baseFilename) {
var timestamp = generateTimestamp();
var finalFilename = baseFilename;

if (finalFilename.endsWith('.csv')) {
    finalFilename = finalFilename.slice(0, -4) + '_' + timestamp + '.csv';
} else {
    finalFilename = finalFilename + '_' + timestamp + '.csv';
}

var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
var url = URL.createObjectURL(blob);

var link = document.createElement("a");
link.setAttribute("href", url);
link.setAttribute("download", finalFilename);
link.style.display = 'none';

document.body.appendChild(link);
link.click();
document.body.removeChild(link);
}

window.exportJSONToCSV = function(jsonData, filename) {
if (!Array.isArray(jsonData) || jsonData.length === 0) {
console.error("JSON data is empty or invalid.");
return;
}

var csvRows = [];
var headers = Object.keys(jsonData[0]);
csvRows.push(headers.map(escapeCSVValue).join(','));

for (var i = 0; i < jsonData.length; i++) {
    var rowValues = headers.map(function(header) {
        return escapeCSVValue(jsonData[i][header]);
    });
    csvRows.push(rowValues.join(','));
}

triggerCSVDownload(csvRows.join('\n'), filename);
};

window.exportTableToCSV = function(tableId, filename) {
var table = document.getElementById(tableId);
if (!table) {
console.error("Table element not found: " + tableId);
return;
}

var csvRows = [];
var rows = table.querySelectorAll('tr');

for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    var cols = row.querySelectorAll('th, td');
    var rowValues = [];
    
    for (var j = 0; j < cols.length; j++) {
        rowValues.push(escapeCSVValue(cols[j].innerText.trim()));
    }
    
    csvRows.push(rowValues.join(','));
}

triggerCSVDownload(csvRows.join('\n'), filename);
};