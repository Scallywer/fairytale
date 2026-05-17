import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react'
import { useRef } from 'react'
import Dialog from '@/components/Dialog'

function Harness({
  open,
  onClose,
  initialFocus,
}: {
  open: boolean
  onClose: () => void
  initialFocus?: boolean
}) {
  const ref = useRef<HTMLButtonElement | null>(null)
  return (
    <>
      <button>outside-before</button>
      <Dialog
        open={open}
        onClose={onClose}
        ariaLabel="Rating dialog"
        initialFocusRef={initialFocus ? ref : undefined}
      >
        <h2>Test dialog</h2>
        <button>first</button>
        <button ref={ref}>chosen-initial</button>
        <button>last</button>
      </Dialog>
      <button>outside-after</button>
    </>
  )
}

describe('Dialog', () => {
  it('renders nothing when closed', () => {
    cleanup()
    render(<Harness open={false} onClose={() => {}} />)
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('renders role=dialog with aria-modal when open', () => {
    cleanup()
    render(<Harness open={true} onClose={() => {}} />)
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAttribute('aria-label', 'Rating dialog')
  })

  it('focuses the initialFocusRef on open', async () => {
    cleanup()
    render(<Harness open={true} onClose={() => {}} initialFocus />)
    await waitFor(() => {
      expect(document.activeElement?.textContent).toBe('chosen-initial')
    })
  })

  it('calls onClose when Escape is pressed', () => {
    cleanup()
    const onClose = vi.fn()
    render(<Harness open={true} onClose={onClose} />)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('calls onClose when the backdrop is clicked', () => {
    cleanup()
    const onClose = vi.fn()
    render(<Harness open={true} onClose={onClose} />)
    const backdrop = document.querySelector('[aria-hidden="true"]') as HTMLElement
    fireEvent.click(backdrop)
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('locks body scroll while open', async () => {
    cleanup()
    document.body.style.overflow = ''
    const { rerender } = render(<Harness open={true} onClose={() => {}} />)
    await waitFor(() => expect(document.body.style.overflow).toBe('hidden'))
    rerender(<Harness open={false} onClose={() => {}} />)
    await waitFor(() => expect(document.body.style.overflow).not.toBe('hidden'))
  })
})
