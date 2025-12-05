import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HeroCarouselSimple } from '@/components/ui/HeroCarouselSimple'

describe('HeroCarouselSimple', () => {
  it('renders carousel container', () => {
    render(<HeroCarouselSimple />)
    const carousel = screen.getByRole('generic')
    expect(carousel).toBeDefined()
  })

  it('renders without text overlays', () => {
    const { container } = render(<HeroCarouselSimple />)
    // Verify no h1 or h2 inside carousel (clean images only)
    const headings = container.querySelectorAll('h1, h2')
    expect(headings.length).toBe(0)
  })

  it('has navigation controls', () => {
    const { container } = render(<HeroCarouselSimple />)
    const buttons = container.querySelectorAll('button')
    expect(buttons.length).toBeGreaterThan(0) // Has navigation dots and/or arrows
  })
})
