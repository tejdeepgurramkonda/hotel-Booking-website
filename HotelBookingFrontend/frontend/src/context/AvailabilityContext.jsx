import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { getAvailability, checkAvailability } from '../api';

const AvailabilityContext = createContext();

export const useAvailability = () => {
  const context = useContext(AvailabilityContext);
  if (!context) {
    throw new Error('useAvailability must be used within AvailabilityProvider');
  }
  return context;
};

export const AvailabilityProvider = ({ children }) => {
  const [availabilityData, setAvailabilityData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch availability for a date range
   * Caches results by hotelId|roomType|dateRange
   */
  const fetchAvailability = useCallback(async (hotelId, roomType, startDate, endDate) => {
    const cacheKey = `${hotelId}|${roomType}|${startDate.toISOString()}|${endDate.toISOString()}`;

    // Return cached data if available
    if (availabilityData[cacheKey]) {
      return availabilityData[cacheKey];
    }

    setLoading(true);
    setError(null);

    try {
      const response = await getAvailability(hotelId, roomType, startDate, endDate);
      const data = response.data || [];

      setAvailabilityData((prev) => ({
        ...prev,
        [cacheKey]: data,
      }));

      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch availability';
      setError(errorMsg);
      console.error('Availability fetch error:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [availabilityData]);

  /**
   * Check if room is available for a specific date range
   * Does not cache - always checks current availability
   */
  const verifyAvailability = useCallback(async (hotelId, roomType, checkIn, checkOut) => {
    try {
      const response = await checkAvailability(hotelId, roomType, checkIn, checkOut);
      return response.data === true; // Boolean response
    } catch (err) {
      console.error('Availability check error:', err);
      return false;
    }
  }, []);

  /**
   * Get available room count for a specific date
   */
  const getAvailableRoomCount = useCallback((hotelId, roomType, date, startDate, endDate) => {
    const cacheKey = `${hotelId}|${roomType}|${startDate.toISOString()}|${endDate.toISOString()}`;
    const data = availabilityData[cacheKey] || [];

    const dateStr = date.toISOString().split('T')[0];
    const availability = data.find((item) => item.date === dateStr);

    return availability ? availability.availableRooms : 0;
  }, [availabilityData]);

  /**
   * Get dates in range where rooms are unavailable
   */
  const getUnavailableDates = useCallback((hotelId, roomType, startDate, endDate) => {
    const cacheKey = `${hotelId}|${roomType}|${startDate.toISOString()}|${endDate.toISOString()}`;
    const data = availabilityData[cacheKey] || [];

    return data
      .filter((item) => item.availableRooms === 0)
      .map((item) => new Date(item.date));
  }, [availabilityData]);

  /**
   * Clear cache for a specific hotel/room-type or all
   */
  const clearCache = useCallback((hotelId, roomType) => {
    if (hotelId && roomType) {
      // Clear specific cache entries
      setAvailabilityData((prev) => {
        const newData = { ...prev };
        Object.keys(newData).forEach((key) => {
          if (key.startsWith(`${hotelId}|${roomType}|`)) {
            delete newData[key];
          }
        });
        return newData;
      });
    } else {
      // Clear all
      setAvailabilityData({});
    }
  }, []);

  const value = useMemo(
    () => ({
      availabilityData,
      loading,
      error,
      fetchAvailability,
      verifyAvailability,
      getAvailableRoomCount,
      getUnavailableDates,
      clearCache,
    }),
    [
      availabilityData,
      loading,
      error,
      fetchAvailability,
      verifyAvailability,
      getAvailableRoomCount,
      getUnavailableDates,
      clearCache,
    ]
  );

  return (
    <AvailabilityContext.Provider value={value}>
      {children}
    </AvailabilityContext.Provider>
  );
};

export default AvailabilityContext;
