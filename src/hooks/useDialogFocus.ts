import { useEffect, type RefObject } from 'react'

const focusableSelector = [
  'a[href]',
  'button:not(:disabled)',
  'input:not(:disabled):not([type="hidden"])',
  'select:not(:disabled)',
  'textarea:not(:disabled)',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

// Native dialogs also use this Tab loop to avoid focusing browser chrome at an edge.
export function useDialogFocus<T extends HTMLElement>(ref: RefObject<T | null>) {
  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    const previousFocus = document.activeElement
    const nativeDialog = dialog instanceof HTMLDialogElement ? dialog : null

    if (nativeDialog) nativeDialog.showModal()
    else dialog.focus({ preventScroll: true })

    const trapTab = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || event.ctrlKey || event.altKey || event.metaKey) return
      const controls = [...dialog.querySelectorAll<HTMLElement>(focusableSelector)].filter(
        (control) =>
          control.tabIndex >= 0 &&
          control.getClientRects().length > 0 &&
          !control.closest('[inert], [hidden]') &&
          getComputedStyle(control).visibility !== 'hidden',
      )
      const first = controls[0]
      const last = controls.at(-1)
      const active = document.activeElement
      const outsideControls = active === dialog || !dialog.contains(active)
      const target = !first
        ? dialog
        : event.shiftKey && (outsideControls || active === first)
          ? last
          : !event.shiftKey && (outsideControls || active === last)
            ? first
            : null
      if (target) {
        event.preventDefault()
        target.focus({ preventScroll: true })
      }
    }

    dialog.addEventListener('keydown', trapTab)
    return () => {
      dialog.removeEventListener('keydown', trapTab)
      nativeDialog?.close()
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus({ preventScroll: true })
      }
    }
  }, [ref])
}
