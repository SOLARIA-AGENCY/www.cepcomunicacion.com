import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import PrivacidadPage from '../../app/legal/privacidad/page'
import TerminosPage from '../../app/legal/terminos/page'
import CookiesPage from '../../app/legal/cookies/page'

describe('Legal Pages', () => {
  describe('Privacy Policy Page', () => {
    it('renders privacy policy title', () => {
      render(<PrivacidadPage />)
      expect(screen.getByText('Política de Privacidad')).toBeInTheDocument()
    })

    it('displays company information', () => {
      render(<PrivacidadPage />)
      expect(screen.getByText(/CEP FORMACIÓN Y COMUNICACIÓN S\.L\./i)).toBeInTheDocument()
    })

    it('shows data subject rights section', () => {
      render(<PrivacidadPage />)
      expect(screen.getByText(/Derechos de los Interesados/i)).toBeInTheDocument()
      expect(screen.getByText(/Acceso/i)).toBeInTheDocument()
      expect(screen.getByText(/Rectificación/i)).toBeInTheDocument()
      expect(screen.getByText(/Supresión/i)).toBeInTheDocument()
    })

    it('includes contact information', () => {
      render(<PrivacidadPage />)
      expect(screen.getByText(/privacidad@cepcomunicacion\.com/i)).toBeInTheDocument()
    })

    it('has back button that calls router.back()', () => {
      const { useRouter } = require('next/navigation')
      const mockRouter = useRouter()
      
      render(<PrivacidadPage />)
      const backButton = screen.getByRole('button', { name: /volver/i })
      
      fireEvent.click(backButton)
      expect(mockRouter.back).toHaveBeenCalled()
    })

    it('shows last updated date', () => {
      render(<PrivacidadPage />)
      const currentDate = new Date().toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
      expect(screen.getByText(new RegExp(currentDate))).toBeInTheDocument()
    })

    it('displays all required RGPD sections', () => {
      render(<PrivacidadPage />)
      
      // Check for required sections
      expect(screen.getByText(/Responsable del Tratamiento/i)).toBeInTheDocument()
      expect(screen.getByText(/Datos Personales que Tratamos/i)).toBeInTheDocument()
      expect(screen.getByText(/Finalidad del Tratamiento/i)).toBeInTheDocument()
      expect(screen.getByText(/Base Legal/i)).toBeInTheDocument()
      expect(screen.getByText(/Conservación de Datos/i)).toBeInTheDocument()
      expect(screen.getByText(/Medidas de Seguridad/i)).toBeInTheDocument()
    })
  })

  describe('Terms & Conditions Page', () => {
    it('renders terms and conditions title', () => {
      render(<TerminosPage />)
      expect(screen.getByText('Términos y Condiciones de Uso')).toBeInTheDocument()
    })

    it('displays 5 user role types', () => {
      render(<TerminosPage />)
      expect(screen.getByText(/Administradores/i)).toBeInTheDocument()
      expect(screen.getByText(/Gestores/i)).toBeInTheDocument()
      expect(screen.getByText(/Marketing/i)).toBeInTheDocument()
      expect(screen.getByText(/Asesores/i)).toBeInTheDocument()
      expect(screen.getByText(/Lectura/i)).toBeInTheDocument()
    })

    it('shows services offered section', () => {
      render(<TerminosPage />)
      expect(screen.getByText(/Servicios Ofrecidos/i)).toBeInTheDocument()
      expect(screen.getByText(/Gestión de cursos/i)).toBeInTheDocument()
    })

    it('includes economic conditions', () => {
      render(<TerminosPage />)
      expect(screen.getByText(/Condiciones Económicas/i)).toBeInTheDocument()
      expect(screen.getByText(/Matrícula y pagos/i)).toBeInTheDocument()
      expect(screen.getByText(/cancelación y reembolsos/i)).toBeInTheDocument()
    })

    it('displays intellectual property section', () => {
      render(<TerminosPage />)
      expect(screen.getByText(/Propiedad Intelectual/i)).toBeInTheDocument()
    })

    it('shows jurisdiction information', () => {
      render(<TerminosPage />)
      expect(screen.getByText(/Santa Cruz de Tenerife/i)).toBeInTheDocument()
    })

    it('has functional back navigation', () => {
      const { useRouter } = require('next/navigation')
      const mockRouter = useRouter()
      
      render(<TerminosPage />)
      const backButton = screen.getByRole('button', { name: /volver/i })
      
      fireEvent.click(backButton)
      expect(mockRouter.back).toHaveBeenCalled()
    })
  })

  describe('Cookie Policy Page', () => {
    it('renders cookie policy title', () => {
      render(<CookiesPage />)
      expect(screen.getByText('Política de Cookies')).toBeInTheDocument()
    })

    it('explains what cookies are', () => {
      render(<CookiesPage />)
      expect(screen.getByText(/¿Qué son las cookies\?/i)).toBeInTheDocument()
    })

    it('displays all cookie types', () => {
      render(<CookiesPage />)
      expect(screen.getByText(/Cookies Técnicas/i)).toBeInTheDocument()
      expect(screen.getByText(/Cookies Analíticas/i)).toBeInTheDocument()
      expect(screen.getByText(/Cookies de Marketing/i)).toBeInTheDocument()
      expect(screen.getByText(/Cookies de Preferencias/i)).toBeInTheDocument()
    })

    it('lists technical cookies with details', () => {
      render(<CookiesPage />)
      expect(screen.getByText(/cep_auth_token/i)).toBeInTheDocument()
      expect(screen.getByText(/cep_user/i)).toBeInTheDocument()
      expect(screen.getByText(/csrf_token/i)).toBeInTheDocument()
    })

    it('shows third-party cookie providers', () => {
      render(<CookiesPage />)
      expect(screen.getByText(/Google Analytics/i)).toBeInTheDocument()
      expect(screen.getByText(/Meta.*Facebook/i)).toBeInTheDocument()
      expect(screen.getByText(/Plausible/i)).toBeInTheDocument()
    })

    it('includes browser management instructions', () => {
      render(<CookiesPage />)
      expect(screen.getByText(/Google Chrome/i)).toBeInTheDocument()
      expect(screen.getByText(/Mozilla Firefox/i)).toBeInTheDocument()
      expect(screen.getByText(/Safari/i)).toBeInTheDocument()
      expect(screen.getByText(/Microsoft Edge/i)).toBeInTheDocument()
    })

    it('displays legal basis for cookies', () => {
      render(<CookiesPage />)
      expect(screen.getByText(/LSSI/i)).toBeInTheDocument()
      expect(screen.getByText(/RGPD/i)).toBeInTheDocument()
    })

    it('has back button functionality', () => {
      const { useRouter } = require('next/navigation')
      const mockRouter = useRouter()
      
      render(<CookiesPage />)
      const backButton = screen.getByRole('button', { name: /volver/i })
      
      fireEvent.click(backButton)
      expect(mockRouter.back).toHaveBeenCalled()
    })

    it('shows cookie duration information', () => {
      render(<CookiesPage />)
      expect(screen.getAllByText(/Duración/i).length).toBeGreaterThan(0)
    })

    it('includes warning about blocking cookies', () => {
      render(<CookiesPage />)
      expect(screen.getByText(/Bloquear todas las cookies puede afectar/i)).toBeInTheDocument()
    })
  })

  describe('Common Legal Page Features', () => {
    it.each([
      ['Privacy', PrivacidadPage],
      ['Terms', TerminosPage],
      ['Cookies', CookiesPage],
    ])('%s page has consistent styling', (name, Component) => {
      const { container } = render(<Component />)
      const mainDiv = container.firstChild
      expect(mainDiv).toHaveClass('max-w-4xl', 'mx-auto', 'space-y-6', 'p-6')
    })

    it.each([
      ['Privacy', PrivacidadPage],
      ['Terms', TerminosPage],
      ['Cookies', CookiesPage],
    ])('%s page displays last update date', (name, Component) => {
      render(<Component />)
      expect(screen.getByText(/Última actualización/i)).toBeInTheDocument()
    })

    it.each([
      ['Privacy', PrivacidadPage],
      ['Terms', TerminosPage],
      ['Cookies', CookiesPage],
    ])('%s page includes contact section', (name, Component) => {
      render(<Component />)
      expect(screen.getByText(/Contacto/i)).toBeInTheDocument()
    })
  })
})
