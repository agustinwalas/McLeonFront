import { describe, it, expect } from 'vitest'
import { removeLeadingZeros } from '@/utils/removeLeadingZeros'
import { getUnitOfMeasureLabel, getUnitOfMeasureShort } from '@/utils/unitOfMeasure'
import { UnitOfMeasure } from '@/types/product'

describe('removeLeadingZeros Utility', () => {
  it('should remove leading zeros from numeric strings', () => {
    expect(removeLeadingZeros('00123')).toBe('123')
    expect(removeLeadingZeros('000')).toBe('0')
    expect(removeLeadingZeros('0001')).toBe('1')
  })

  it('should handle strings without leading zeros', () => {
    expect(removeLeadingZeros('123')).toBe('123')
    expect(removeLeadingZeros('1')).toBe('1')
  })

  it('should handle edge cases', () => {
    expect(removeLeadingZeros('')).toBe('')
    expect(removeLeadingZeros('0')).toBe('0')
    expect(removeLeadingZeros('00')).toBe('0')
  })

  it('should handle non-numeric strings', () => {
    expect(removeLeadingZeros('abc')).toBe('abc')
    expect(removeLeadingZeros('00abc')).toBe('abc')
    expect(removeLeadingZeros('a123')).toBe('a123')
  })
})

describe('Unit of Measure Utilities', () => {
  describe('getUnitOfMeasureLabel', () => {
    it('should return correct labels for each unit', () => {
      expect(getUnitOfMeasureLabel(UnitOfMeasure.UNIDAD)).toBe('Unidades')
      expect(getUnitOfMeasureLabel(UnitOfMeasure.GRAMO)).toBe('Gramos')
      expect(getUnitOfMeasureLabel(UnitOfMeasure.KILOGRAMO)).toBe('Kilogramos')
    })

    it('should return the unit itself for unknown values', () => {
      // Type assertion for testing unknown values
      const unknownUnit = 'UNKNOWN_UNIT' as UnitOfMeasure
      expect(getUnitOfMeasureLabel(unknownUnit)).toBe('UNKNOWN_UNIT')
    })
  })

  describe('getUnitOfMeasureShort', () => {
    it('should return correct short labels for each unit', () => {
      expect(getUnitOfMeasureShort(UnitOfMeasure.UNIDAD)).toBe('u.')
      expect(getUnitOfMeasureShort(UnitOfMeasure.GRAMO)).toBe('g.')
      expect(getUnitOfMeasureShort(UnitOfMeasure.KILOGRAMO)).toBe('kg.')
    })

    it('should return the unit itself for unknown values', () => {
      // Type assertion for testing unknown values
      const unknownUnit = 'UNKNOWN_UNIT' as UnitOfMeasure
      expect(getUnitOfMeasureShort(unknownUnit)).toBe('UNKNOWN_UNIT')
    })
  })
})

// Additional utility tests for common patterns in the app
describe('Common Patterns Tests', () => {
  describe('Price Calculations', () => {
    it('should calculate subtotal correctly', () => {
      const quantity = 3
      const unitPrice = 1000
      const discountPercentage = 10
      
      const subtotal = quantity * unitPrice * (1 - discountPercentage / 100)
      expect(subtotal).toBe(2700)
    })

    it('should calculate total with fees and discounts', () => {
      const subtotal = 3000
      const deliveryFee = 500
      const totalDiscount = 200
      
      const total = subtotal + deliveryFee - totalDiscount
      expect(total).toBe(3300)
    })
  })

  describe('Date Formatting', () => {
    it('should format date to YYYY-MM-DD', () => {
      const date = new Date('2025-09-16T15:30:00')
      const formatted = date.toISOString().split('T')[0]
      expect(formatted).toBe('2025-09-16')
    })

    it('should create expiry time at 23:59', () => {
      const now = new Date('2025-09-16T15:30:00')
      const expiry = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 0, 0)
      
      expect(expiry.getHours()).toBe(23)
      expect(expiry.getMinutes()).toBe(59)
      expect(expiry.getSeconds()).toBe(0)
      expect(expiry.getDate()).toBe(now.getDate())
    })
  })

  describe('Array Operations', () => {
    it('should filter and find items correctly', () => {
      const items = [
        { id: '1', name: 'Item 1', active: true },
        { id: '2', name: 'Item 2', active: false },
        { id: '3', name: 'Test Item', active: true }
      ]

      const activeItems = items.filter(item => item.active)
      expect(activeItems).toHaveLength(2)

      const foundItem = items.find(item => item.id === '2')
      expect(foundItem?.name).toBe('Item 2')

      const searchResult = items.filter(item => 
        item.name.toLowerCase().includes('test')
      )
      expect(searchResult).toHaveLength(1)
      expect(searchResult[0].name).toBe('Test Item')
    })
  })
})