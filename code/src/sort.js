// 1

function ExportToTable() {  
     var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xlsx|.xls)$/;  
     /*Checks whether the file is a valid excel file*/  
     if (regex.test($("#excelfile").val().toLowerCase())) {  
         var xlsxflag = false; /*Flag for checking whether excel is .xls format or .xlsx format*/  
         if ($("#excelfile").val().toLowerCase().indexOf(".xlsx") > 0) {  
             xlsxflag = true;  
         }  
         /*Checks whether the browser supports HTML5*/  
         if (typeof (FileReader) != "undefined") {  
             var reader = new FileReader();  
             reader.onload = function (e) {  
                 var data = e.target.result;  
                 /*Converts the excel data in to object*/  
                 if (xlsxflag) {  
                     var workbook = XLSX.read(data, { type: 'binary' });  
                 }  
                 else {  
                     var workbook = XLS.read(data, { type: 'binary' });  
                 }  
                 /*Gets all the sheetnames of excel in to a variable*/  
                 var sheet_name_list = workbook.SheetNames;  
  
                 var cnt = 0; /*This is used for restricting the script to consider only first sheet of excel*/  
                 sheet_name_list.forEach(function (y) { /*Iterate through all sheets*/  
                     /*Convert the cell value to Json*/  
                     if (xlsxflag) {  
                         var exceljson = XLSX.utils.sheet_to_json(workbook.Sheets[y]);  
                     }  
                     else {  
                         var exceljson = XLS.utils.sheet_to_row_object_array(workbook.Sheets[y]);  
                     }  
                     if (exceljson.length > 0 && cnt == 0) {  
                         BindTable(exceljson, '#exceltable');  
                         cnt++;  
                     }  
                 });  
                 $('#exceltable').show();  
             }  
             if (xlsxflag) {/*If excel file is .xlsx extension than creates a Array Buffer from excel*/  
                 reader.readAsArrayBuffer($("#excelfile")[0].files[0]);  
             }  
             else {  
                 reader.readAsBinaryString($("#excelfile")[0].files[0]);  
             }  
         }  
         else {  
             alert("Sorry! Your browser does not support HTML5!");  
         }  
     }  
     else {  
         alert("Please upload a valid Excel file!");  
     }  
 } 











// 2


function BindTable(jsondata, tableid) {/*Function used to convert the JSON array to Html Table*/  
     var columns = BindTableHeader(jsondata, tableid); /*Gets all the column headings of Excel*/  
     for (var i = 0; i < jsondata.length; i++) {  
         var row$ = $('<tr/>');  
         for (var colIndex = 0; colIndex < columns.length; colIndex++) {  
             var cellValue = jsondata[i][columns[colIndex]];  
             if (cellValue == null)  
                 cellValue = "";  
             row$.append($('<td/>').html(cellValue));  
         }  
         $(tableid).append(row$);  
     }  
 }  
 function BindTableHeader(jsondata, tableid) {/*Function used to get all column names from JSON and bind the html table header*/  
     var columnSet = [];  
     var headerTr$ = $('<tr/>');  
     for (var i = 0; i < jsondata.length; i++) {  
         var rowHash = jsondata[i];  
         for (var key in rowHash) {  
             if (rowHash.hasOwnProperty(key)) {  
                 if ($.inArray(key, columnSet) == -1) {/*Adding each unique column names to a variable array*/  
                     columnSet.push(key);  
                     headerTr$.append($('<th/>').html(key));  
                 }  
             }  
         }  
     }  
     $(tableid).append(headerTr$);  
     return columnSet;  
 } 



// refresh
$(document).ready(function(){
    $("#refresh").click(function(){
        location.reload(true);
    });
});





// sorter

function sortTable(n) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("exceltable");
  switching = true;
  //Set the sorting direction to ascending:
  dir = "asc"; 
  /*Make a loop that will continue until
  no switching has been done:*/
  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    rows = table.getElementsByTagName("TR");
    /*Loop through all table rows (except the
    first, which contains table headers):*/
    for (i = 1; i < (rows.length - 1); i++) {
      //start by saying there should be no switching:
      shouldSwitch = false;
      /*Get the two elements you want to compare,
      one from current row and one from the next:*/
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      /*check if the two rows should switch place,
      based on the direction, asc or desc:*/
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          //if so, mark as a switch and break the loop:
          shouldSwitch= true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          //if so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /*If a switch has been marked, make the switch
      and mark that a switch has been done:*/
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      //Each time a switch is done, increase this count by 1:
      switchcount ++;      
    } else {
      /*If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again.*/
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}


// search

function tableSearch() {
    var phrase = document.getElementById('search-text');
    var table = document.getElementById('exceltable');
    var regPhrase = new RegExp(phrase.value, 'i');
    var flag = false;
    for (var i = 1; i < table.rows.length; i++) {
        flag = false;
        for (var j = table.rows[i].cells.length - 1; j >= 0; j--) {
            flag = regPhrase.test(table.rows[i].cells[j].innerHTML);
            if (flag) break;
        }
        if (flag) {
            table.rows[i].style.display = "";
        } else {
            table.rows[i].style.display = "none";
        }

    }
}