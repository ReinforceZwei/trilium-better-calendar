calendar('#rf-calendar', {async onclick(date){
    console.log(date)
    let d = await api.getDayNote(date)
    api.activateNote(d.noteId);
}})

let rootNoteId = 'hE1GZ8Qp5d1y'

let now = new Date()
let nowDay = String(now.getDate()).padStart(2, '0');
let nowYear = now.getFullYear()
let nowMonth = (now.getMonth() + 1).toString().padStart(2, '0')
let nextMonth = ((now.getMonth() + 2) % 12).toString().padStart(2, '0')
let today = nowYear + '-' + nowMonth + '-' + nowDay;
let resultIds = []

let displayMonth = (new Date(nowYear, nowMonth-1)).toLocaleString('en-us', { month: 'long' });
let displayMonthNext = (new Date(nowYear, nextMonth-1)).toLocaleString('en-us', { month: 'long' });
api.$container.find('#title').text(`Showing ${displayMonth} and ${displayMonthNext}`)

let q1 = `#monthNote="${nowYear}-${nowMonth}" AND note.ancestors.noteId=${rootNoteId}`
let q2 = `#monthNote="${nowYear}-${nextMonth}" AND note.ancestors.noteId=${rootNoteId}`

let r1 = await api.searchForNotes(q1)
let r2 = await api.searchForNotes(q2)

if (r1){
    r1.forEach(e => {resultIds.push(...e.children)})
}
if (r2){
    r2.forEach(e => {resultIds.push(...e.children)})
}
console.log(resultIds)

let notes = await api.getNotes(resultIds)
let el = api.$container.find('#content')
for (let n of notes){
    let date = (await n.getOwnedLabelValue('dateNote'))
    if (date < today) continue
    let content = (await n.getNoteComplement()).content
    if (!content.trim()) continue
    
    if (date == today) date += ' (Today)'
    
    let card = $(`<div class="rf-card"><h5 class="rf-card-title">${date}</h5><div class="rf-card-content">${content}</div></div>`)
    card.on('click', () => {
        api.activateNote(n.noteId);
    })
    el.append(card)
}
