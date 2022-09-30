function calendar(el, options = {}){
    calendarInjectStyle()
    
    let now = new Date()
    let today = now.getFullYear() + '-' + (now.getMonth() + 1).toString().padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0')
    // Month is zero based
    let month = options.month ? options.month - 1 : now.getMonth()
    let displayMonth = (month + 1).toString().padStart(2, '0')
    let year  = options.year || now.getFullYear()
    let theDate = new Date(year, month)
    // 0 is Sun ... 6 is Sat
    let firstday = theDate.getDay()
    let dayInMonth = 32 - new Date(year, month, 32).getDate()

    let dateOnClick = options.onclick ? options.onclick : undefined

    let cal = $(el)
    let table = $('<table></table>')
    table.addClass('cal-table')
    table.attr('data-cal-year', year)
    table.attr('data-cal-month', displayMonth)
    cal.append(table)

    // Year and month header
    let captionEl = $('<caption></caption>')
    let yearHeader = $('<div></div>')
    yearHeader.addClass('cal-caption')
    captionEl.append(yearHeader)
    table.append(captionEl)

    let previousBtn = $('<a>&larr;</a>')
    previousBtn.on('click', () => {
        calendarDestory(el)
        let n = month
        let y = year
        if (n < 1){
            n = 12
            y--
        }
        calendar(el, {year: y, month: n, onclick: dateOnClick})
    })
    yearHeader.append(previousBtn)

    let monthName = theDate.toLocaleString('default', { month: 'long' });
    yearHeader.append(`<span>${monthName} ${year}</span>`)

    let nextBtn = $('<a>&rarr;</a>')
    nextBtn.on('click', () => {
        calendarDestory(el)
        let n = month + 2
        let y = year
        if (n > 12){
            n = 1
            y++
        }
        calendar(el, {year: y, month: n, onclick: dateOnClick})
    })
    yearHeader.append(nextBtn)

    // Week header
    let weekHeader = options.weekHeader || ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    let weekTr = $('<tr></tr>')
    weekTr.addClass('cal-week-header')
    table.append(weekTr)
    weekHeader.forEach((week, i) => {
        let td = $('<th></th>')
        weekTr.append(td)
        td.text(week)

        if (i === 0){
            td.addClass('cal-holiday')
        }
    })
    // let dayWrapper = $('<div></div>')
    // table.append(dayWrapper)
    // date counter
    let theDay = 1
    for (let row = 0; row < 6; row++){
        let rowEl = $('<tr></tr>')
        rowEl.addClass('cal-date-row')
        table.append(rowEl)

        for (let column = 0; column < 7; column++){
            if (theDay > dayInMonth) {
                break
            }
            let td = $('<td></td>')
            td.addClass('cal-date-box')
            rowEl.append(td)

            if (row === 0 && column < firstday){
                // day for previous month
            }else{
                let paddedDay = theDay.toString().padStart(2, '0')
                let fullDate = `${year}-${displayMonth}-${paddedDay}`
                if (fullDate == today) td.addClass('cal-today')
                td.attr('data-cal-date', fullDate)
                td.append(`<div class="cal-date-number">${theDay}</div>`)
                theDay++

                if (column === 0){
                    // Sunday in red color
                    td.addClass('cal-holiday')
                }
            }
        }
    }
    if (dateOnClick !== undefined){
        $('.cal-date-box[data-cal-date]').on('click', e => {
            dateOnClick($(e.currentTarget).attr('data-cal-date'))
        })
    }
}

function calendarDestory(el) {
    $(el).empty()
}

function calendarGetYear(el) {
    return $(el).find('.cal-table').attr('data-cal-year')
}

function calendarGetMonth(el) {
    return $(el).find('.cal-table').attr('data-cal-month')
}

function calendarInjectStyle() {
    // Check if injected before
    if ($('style[data-cal-style]').length) return

    let style = `
    <style data-cal-style>

    .cal-table, .cal-table caption {
        table-layout: fixed;
        /* aspect-ratio: 4 / 3; */
        background-color: rgb(36, 36, 36);
        color: aliceblue;
        padding: 5px;
        font-size: 120%;
    }
    
    .cal-table .cal-caption {
        display: flex;
        justify-content: space-between;
        padding: 7px;
    }
    
    .cal-table caption a {
        cursor: pointer;
    }
    
    .cal-table td {
        padding: 0.4rem 0;
        margin: 0;
        width: 14%;
    }
    
    .cal-table td:hover {
        background-color: rgb(227, 227, 227);
        color: rgb(43, 43, 43);
        cursor: pointer;
    }
    
    .cal-table .cal-today {
        background-color: rgb(227, 227, 227);
        color: rgb(43, 43, 43);
    }
    
    .cal-table .cal-date-number {
        text-align: center;
    }
    
    .cal-week-header {
        text-align: center;
        height: 20px;
    }
    
    .cal-holiday {
        color: red;
    }
    
    </style>
    `
    $('head').append(style)
}