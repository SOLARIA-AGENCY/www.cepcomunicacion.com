import { describe, it, expect } from 'vitest'
import { mockCourses, getRandomCourses } from '@/lib/mockCourses'

describe('mockCourses', () => {
  it('has 15 mockup courses', () => {
    expect(mockCourses.length).toBe(15)
  })

  it('all courses have Pexels images', () => {
    mockCourses.forEach((course) => {
      expect(course.featured_image).toContain('pexels.com')
    })
  })

  it('all courses have required fields', () => {
    mockCourses.forEach((course) => {
      expect(course.id).toBeDefined()
      expect(course.title).toBeDefined()
      expect(course.slug).toBeDefined()
      expect(course.short_description).toBeDefined()
      expect(course.duration_hours).toBeGreaterThan(0)
      expect(course.modality).toBeDefined()
      expect(course.course_type).toBeDefined()
      expect(course.price).toBeGreaterThanOrEqual(0)
      expect(course.featured_image).toBeDefined()
      expect(typeof course.active).toBe('boolean')
    })
  })

  it('getRandomCourses returns requested number of courses', () => {
    const courses = getRandomCourses(6)
    expect(courses.length).toBe(6)
  })

  it('getRandomCourses returns different courses on multiple calls', () => {
    const courses1 = getRandomCourses(5)
    const courses2 = getRandomCourses(5)
    // At least one course should be different
    const allSame = courses1.every((c, i) => c.id === courses2[i].id)
    expect(allSame).toBe(false)
  })
})
