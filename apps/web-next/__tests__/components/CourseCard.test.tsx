import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CourseCard } from '@/components/ui/CourseCard'
import { mockCourses } from '@/lib/mockCourses'

describe('CourseCard', () => {
  const course = mockCourses[0] // Marketing Digital Avanzado

  it('renders course title', () => {
    render(<CourseCard course={course} />)
    expect(screen.getByText(course.title)).toBeDefined()
  })

  it('renders course image from Pexels', () => {
    const { container } = render(<CourseCard course={course} />)
    const img = container.querySelector('img')
    expect(img).toBeDefined()
    expect(img?.src).toContain('pexels.com')
  })

  it('renders INSCRIBIRSE AHORA button with checkout link', () => {
    render(<CourseCard course={course} />)
    const inscribirseButton = screen.getByText('INSCRIBIRSE AHORA')
    expect(inscribirseButton).toBeDefined()
    expect(inscribirseButton.closest('a')?.href).toContain('/checkout')
  })

  it('displays course modality and duration', () => {
    render(<CourseCard course={course} />)
    expect(screen.getByText(/200H/i)).toBeDefined()
  })
})
