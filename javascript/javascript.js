// Javascript uploaded to app.

$(document).ready
(
   function ()
   {
      // https://developers.google.com/chart/interactive/docs/gallery/barchart#configuration-options
      google.charts.load('current', {packages: ['corechart', 'bar']});
   }
);

function onClickShowTrend(rowId)
{
   // Collect info from the 2nd, 3rd, and 4th columns.
   const $tr = $('tr[data-rowId=' + rowId + ']');
   const trChildren = $tr.children();
   const td1 = trChildren[1];
   const td2 = trChildren[2];
   const td3 = trChildren[3];
   const td1Value = $(td1).find('div').html();
   const td2Value = $(td2).find('div').html();
   const td3Value = $(td3).find('div').text().replace(' Trend', ''); // Text so as to exclude button HTML.

   // Create search query.
   const advancedSearch = (
      '[[[wpm_material_type]]]="' + td1Value + '" AND ' +
      '[[[wpm_material_name]]]="' + td2Value + '" AND ' +
      '[[[waste_stream]]]="' + td3Value + '"'
   );

   // Put search query in textarea.
   $('textarea[name=advanced-search-where-clause]').val(advancedSearch);

   // Simulate click of search button.
   editableTableSearch.onClickSearchButton();

   return false;
}

function onClickChart()
{
   $('div#chart-container-div').show();
   _generateChartFromCheckedDataRows();
}

function _generateChartFromCheckedDataRows()
{
   var dataRows     = _getChartDataRows();
   var data         = new google.visualization.DataTable();
   var chart        = new google.visualization.LineChart(document.getElementById('chart-div'));
   var chartOptions =
   {
      chartArea: {left: 80, top: 80, width: 500, height: 540},
      height   : 700, // height - 2 * chartArea.top == chartArea.height.
      legend   : {position: 'right'},
      vAxis    : {format: 'short', textPosition: 'out'},
      width    : 1000,
      hAxis    : {maxAlternation: 1, maxTextLines: 3, minTextSpacing: 2, title: '', showTextEvery: Math.round(dataRows.length / 12)}
   };

   data.addColumn('string', 'Date');
   data.addColumn('number', 'Recycled');
   data.addColumn('number', 'Waste to energy');
   data.addColumn('number', 'Export interstate');
   data.addColumn('number', 'Export international');
   data.addColumn('number', 'Disposal');
   data.addColumn('number', 'Recovery Rate');

   data.addRows(dataRows);

   chartOptions.title = 'Recycling Trends';

   chart.draw(data, chartOptions);
}

function _getChartDataRows()
{
   const dataTrs = $('table.editable-table > tbody > tr');

   let dataRows = [];

   for (var i = 0; i < dataTrs.length; ++i)
   {
      const $tr = $(dataTrs[i]);
      const tds = $tr.children();

      const financialYearValue = $(tds[0]).find('div').html();
      const year = financialYearValue.substring(0, 4);

      let dataRow = [year + '-06-30'];

      for (var j = 4; j <= 9; ++j)
      {
         dataRow.push(Number($(tds[j]).find('div').html()));
      }

      dataRows.push(dataRow);
   }

   return dataRows;
/*
   return [
      ['2000-06-30', 1, 2, 3, 4, 5, 6],
      ['2001-06-30', 1, 2, 3, 4, 5, 6],
      ['2002-06-30', 1, 2, 3, 4, 5, 6],
      ['2003-06-30', 1, 2, 3, 4, 5, 6],
      ['2004-06-30', 1, 2, 3, 4, 5, 6],
      ['2005-06-30', 1, 2, 3, 4, 5, 6],
   ];
*/
}
