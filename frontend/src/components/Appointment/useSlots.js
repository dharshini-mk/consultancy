"use client"

import { useState, useCallback } from "react"
import axios from "axios"
import { showError } from "../../utils/notifications"

/**
 * Custom hook for managing appointment slots
 */
const useSlots = () => {
  const [availableSlots, setAvailableSlots] = useState([])
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)

  /**
   * Fetch available slots for a specific date and service
   * @param {String} date - Selected date
   * @param {String} service - Selected service
   */
  const fetchAvailableSlots = useCallback(async (date, service) => {
    if (!date || !service) return

    setIsLoadingSlots(true)

    try {
      const response = await axios.get("/api/appointments/available-slots", {
        params: { date, service },
      })

      setAvailableSlots(response.data)
    } catch (error) {
      console.error("Error fetching slots:", error)
      showError("Failed to load available time slots")
      setAvailableSlots([])
    } finally {
      setIsLoadingSlots(false)
    }
  }, [])

  return {
    availableSlots,
    fetchAvailableSlots,
    isLoadingSlots,
  }
}

export default useSlots
