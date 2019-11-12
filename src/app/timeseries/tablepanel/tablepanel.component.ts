import { Component, OnInit } from '@angular/core'
import { TsComponentsDataShareService } from '../../services/ts-components-data-share.service'

import * as jQuery from 'jquery' // para DataTable
import 'datatables.net'
import 'datatables.net-dt'

import '../../../../node_modules/datatables.net-dt/css/jquery.dataTables.css'

declare var $: any

@Component({
  selector: 'app-tablepanel',
  templateUrl: './tablepanel.component.html',
  styleUrls: ['./tablepanel.component.css']
})
export class TablepanelComponent implements OnInit {
  ctrlData: any
  nrow: number = 1 // table

  constructor (private shareData: TsComponentsDataShareService) {}

  ngOnInit () {
    this.shareData.tableData.subscribe((data: any) => {
      if (data.has_chart === true) {
        this.populateTable(data)
      }
    })

    //----- functions to table, remove and edit row
    let table: any = jQuery('#tableSample').DataTable()
    $('#tableSample').on('click', 'tr', function () {
      $(this).toggleClass('selected')
    })

    $('#deleteRow').click(function () {
      table
        .rows('.selected')
        .remove()
        .draw(false)
    })

    $('#clearTable').click(function () {
      table.clear().draw()
    })

    // $('#tableSample').on( 'click', 'tbody tr', function () {
    //   $(this).edit('selected');
    // } );

    //------------------
    // TABLE add samples
    //------------------

    // remove row of table
    $('#tableSample').on('click', 'button[type="button"]', function () {
      //'input[type="button"]'
      $(this)
        .closest('tr')
        .remove()
    })
    $('p button[type="button"]').click(function () {
      $('#tableSample').append(
        '<tr><td></td><td><input type="button" value="Delete" /></td></tr>'
      )
    })

    // SAVE table in file
    // source: https://stackoverflow.com/questions/40428850/how-to-export-data-from-table-to-csv-file-using-jquery
    $('#saveCSV').click(function () {
      let titles: any = []
      let data: any = []
      /*Get the table headers, this will be CSV headers
      The count of headers will be CSV string separator */
      $('.tableSample th').each(function () {
        titles.push($(this).text())
      })
      //titles = titles.slice(0,-1); // remove last column
      // Get the actual data, this will contain all the data, in 1 array
      $('.tableSample td').each(function () {
        data.push($(this).text())
      })
      // Convert our data to CSV string
      var CSVString = prepCSVRow(titles, titles.length, '')
      CSVString = prepCSVRow(data, titles.length, CSVString)
      // Make CSV downloadable
      let downloadLink = document.createElement('a')
      let blob = new Blob(['\ufeff', CSVString])
      let url = URL.createObjectURL(blob)
      downloadLink.href = url
      downloadLink.download = 'samples.csv'
      // Actually download CSV
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
    })
    /*
     * Convert data array to CSV string
     * @param arr {Array} - the actual data
     * @param columnCount {Number} - the amount to split the data into columns
     * @param initial {String} - initial string to append to CSV string
     * return {String} - ready CSV string
     */
    function prepCSVRow (arr: any, columnCount: any, initial: any) {
      let row = '' // this will hold data
      let delimeter = ',' // data slice separator, in excel it's `;`, in usual CSv it's `,`
      let newLine = '\r\n' // newline separator for CSV row
      /*
       * Convert [1,2,3,4] into [[1,2], [3,4]] while count is 2
       * @param _arr {Array} - the actual array to split
       * @param _count {Number} - the amount to split
       * return {Array} - splitted array
       */
      function splitArray (_arr: any, _count: any) {
        let splitted: any = []
        let result: any = []
        _arr.forEach(function (item: any, idx: any) {
          if ((idx + 1) % _count === 0) {
            splitted.push(item)
            result.push(splitted)
            splitted = []
          } else {
            splitted.push(item)
          }
        })
        return result
      }
      let plainArr = splitArray(arr, columnCount)
      // don't know how to explain this
      // you just have to like follow the code
      // and you understand, it's pretty simple
      // it converts `['a', 'b', 'c']` to `a,b,c` string
      plainArr.forEach(function (arrItem: any) {
        arrItem.forEach(function (item: any, idx: any) {
          row += item + (idx + 1 === arrItem.length ? '' : delimeter)
        })
        row += newLine
      })
      return initial + row
    }
  }

  populateTable (data: any) {
    let self = this
    let table: any = jQuery('#tableSample').DataTable()
    $(function () {
      // table.row.add([ self.nrow , data.longitude, data.latitude, data.start_date, data.end_date, "No label" ]).draw();
      table.row
        .add([
          self.nrow,
          data.longitude,
          data.latitude,
          data.start_date,
          data.end_date,
          'No label'
        ])
        .draw()
      self.nrow += 1
    })
  }
}
