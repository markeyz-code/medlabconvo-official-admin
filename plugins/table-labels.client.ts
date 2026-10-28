/**
 * Adds `data-label` to stacked mobile table cells using the table's own
 * header row. This keeps every legacy table readable as a card list on
 * phones without rewriting each module.
 */
export default defineNuxtPlugin(() => {
  let scheduled = false

  const labelTables = () => {
    scheduled = false
    document.querySelectorAll<HTMLTableElement>('table.stack-table').forEach((table) => {
      const headers = Array.from(table.querySelectorAll('thead th')).map((th) =>
        (th.textContent || '').trim(),
      )
      if (!headers.length) return

      table.querySelectorAll('tbody tr').forEach((row) => {
        Array.from(row.children).forEach((cell, index) => {
          if (!(cell instanceof HTMLTableCellElement)) return
          if (!cell.dataset.label && headers[index]) {
            cell.dataset.label = headers[index]
          }
        })
      })
    })
  }

  const schedule = () => {
    if (scheduled) return
    scheduled = true
    window.requestAnimationFrame(labelTables)
  }

  const observer = new MutationObserver(schedule)
  observer.observe(document.body, { childList: true, subtree: true })
  schedule()

  const router = useRouter()
  router.afterEach(() => window.setTimeout(schedule, 60))
})
