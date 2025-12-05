'use client'

import { useState } from 'react'

export default function CheckoutPage() {
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    email: '',
    phone: '',
    dni: '',
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    acceptTerms: false,
    acceptPrivacy: false
  })

  const [processing, setProcessing] = useState(false)

  // Datos del curso mockup (normalmente vendrían de URL params o context)
  const course = {
    name: 'Marketing Digital Avanzado',
    modality: 'Presencial',
    duration: '200 horas',
    startDate: '15 de febrero 2025',
    price: 1299.00,
    campus: 'Santa Cruz de Tenerife - Centro'
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setProcessing(true)
    // Simulación de procesamiento
    setTimeout(() => {
      alert('¡Pago procesado con éxito! (Simulación)')
      setProcessing(false)
    }, 2000)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <a href="/cursos" className="inline-flex items-center text-[#F2014B] hover:underline mb-4">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver a cursos
          </a>
          <h1 className="text-3xl font-bold text-gray-900">Finalizar Inscripción</h1>
          <p className="text-gray-600 mt-1">Complete los datos para proceder con el pago</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Payment Form - 2 columns */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
            {/* Datos Personales */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-[#F2014B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Datos del Estudiante
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo *</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F2014B] focus:border-transparent"
                    placeholder="Juan Pérez García"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">DNI / NIE *</label>
                  <input
                    type="text"
                    name="dni"
                    required
                    value={formData.dni}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F2014B] focus:border-transparent"
                    placeholder="12345678A"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F2014B] focus:border-transparent"
                    placeholder="juan@ejemplo.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F2014B] focus:border-transparent"
                    placeholder="+34 600 000 000"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dirección *</label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F2014B] focus:border-transparent"
                    placeholder="Calle Principal 123"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F2014B] focus:border-transparent"
                    placeholder="Santa Cruz de Tenerife"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Código Postal *</label>
                  <input
                    type="text"
                    name="postalCode"
                    required
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F2014B] focus:border-transparent"
                    placeholder="38001"
                  />
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-[#F2014B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Información de Pago
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Número de Tarjeta *</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="cardNumber"
                      required
                      maxLength={19}
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F2014B] focus:border-transparent font-mono"
                      placeholder="1234 5678 9012 3456"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
                      <svg className="h-8" viewBox="0 0 48 32" fill="none">
                        <rect width="48" height="32" rx="4" fill="#1434CB"/>
                        <circle cx="18" cy="16" r="8" fill="#EB001B"/>
                        <circle cx="30" cy="16" r="8" fill="#F79E1B"/>
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Titular *</label>
                  <input
                    type="text"
                    name="cardName"
                    required
                    value={formData.cardName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F2014B] focus:border-transparent uppercase"
                    placeholder="JUAN PEREZ GARCIA"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Expiración *</label>
                    <input
                      type="text"
                      name="expiryDate"
                      required
                      maxLength={5}
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F2014B] focus:border-transparent font-mono"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVV *</label>
                    <input
                      type="text"
                      name="cvv"
                      required
                      maxLength={4}
                      value={formData.cvv}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F2014B] focus:border-transparent font-mono"
                      placeholder="123"
                    />
                  </div>
                </div>

                {/* Security Badge */}
                <div className="bg-gray-50 rounded-lg p-4 flex items-center gap-3 mt-4">
                  <svg className="w-6 h-6 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <div className="text-sm">
                    <p className="font-semibold text-gray-900">Pago 100% seguro</p>
                    <p className="text-gray-600">Tus datos están protegidos con encriptación SSL</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    required
                    checked={formData.acceptTerms}
                    onChange={handleInputChange}
                    className="mt-1 rounded border-gray-300 text-[#F2014B] focus:ring-[#F2014B]"
                  />
                  <span className="text-sm text-gray-700">
                    Acepto los{' '}
                    <a href="/aviso-legal" className="text-[#F2014B] hover:underline">
                      términos y condiciones
                    </a>{' '}
                    de la matrícula y el{' '}
                    <a href="/politica-privacidad" className="text-[#F2014B] hover:underline">
                      reglamento del centro
                    </a>
                    . *
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="acceptPrivacy"
                    required
                    checked={formData.acceptPrivacy}
                    onChange={handleInputChange}
                    className="mt-1 rounded border-gray-300 text-[#F2014B] focus:ring-[#F2014B]"
                  />
                  <span className="text-sm text-gray-700">
                    He leído y acepto la{' '}
                    <a href="/politica-privacidad" className="text-[#F2014B] hover:underline">
                      política de privacidad
                    </a>{' '}
                    y el tratamiento de mis datos personales. *
                  </span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={processing || !formData.acceptTerms || !formData.acceptPrivacy}
              className={`w-full py-4 rounded-lg font-semibold text-lg transition-colors ${
                processing || !formData.acceptTerms || !formData.acceptPrivacy
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#F2014B] hover:bg-[#d01040] text-white'
              }`}
            >
              {processing ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Procesando pago...
                </span>
              ) : (
                `Pagar €${course.price.toFixed(2)}`
              )}
            </button>
          </form>

          {/* Order Summary - 1 column */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h3 className="text-lg font-semibold mb-4">Resumen del Pedido</h3>

              <div className="space-y-3 pb-4 border-b">
                <div>
                  <p className="font-semibold text-gray-900">{course.name}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="inline-flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {course.modality}
                    </span>
                  </p>
                </div>
              </div>

              <div className="py-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Duración</span>
                  <span className="font-medium">{course.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Inicio</span>
                  <span className="font-medium">{course.startDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sede</span>
                  <span className="font-medium text-right">{course.campus}</span>
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">€{course.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">IVA (21%)</span>
                  <span className="font-medium">€{(course.price * 0.21).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total</span>
                  <span className="text-[#F2014B]">€{(course.price * 1.21).toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 bg-blue-50 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-sm">
                    <p className="font-semibold text-blue-900 mb-1">Garantía de satisfacción</p>
                    <p className="text-blue-800">Devolución del 100% en los primeros 14 días si no estás satisfecho</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Trust Indicators */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <div className="grid gap-6 md:grid-cols-3 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Pago Seguro</h4>
              <p className="text-sm text-gray-600">Encriptación SSL de 256 bits</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Datos Protegidos</h4>
              <p className="text-sm text-gray-600">Cumplimiento RGPD completo</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Soporte 24/7</h4>
              <p className="text-sm text-gray-600">Atención personalizada siempre</p>
            </div>
          </div>
        </div>

        {/* Demo Notice */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Vista preliminar de pago • No se procesarán cargos reales</p>
        </div>
      </div>
    </div>
  )
}
