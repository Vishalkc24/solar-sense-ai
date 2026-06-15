import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MapPin, Sun, Zap, Settings, Search, X } from 'lucide-react';
import { searchLocation, LocationResult, formatLocationName } from '../services/geocodingService';
import LocationPickerMap from './LocationPickerMap';

interface InputFormProps {
  onSubmit: (data: {
    latitude: number;
    longitude: number;
    capacityKw: number;
    efficiency: number;
    performanceRatio: number;
    monthlyBill: number;
  }) => void;
  isLoading: boolean;
}

const BANGALORE_LAT = 12.9716;
const BANGALORE_LNG = 77.5946;

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    latitude: BANGALORE_LAT.toString(),
    longitude: BANGALORE_LNG.toString(),
    capacityKw: '10',
    efficiency: '20',
    performanceRatio: '80',
    monthlyBill: '5000',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string | null>('Bangalore, Karnataka, India');
  const searchRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const performSearch = useCallback(async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchLocation(query);
      setSearchResults(results);
      setShowResults(true);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (value.length >= 2) {
      setIsSearching(true);
      searchTimeoutRef.current = setTimeout(() => {
        performSearch(value);
      }, 300);
    } else {
      setSearchResults([]);
      setShowResults(false);
      setIsSearching(false);
    }
  };

  const handleSelectLocation = (location: LocationResult) => {
    setFormData(prev => ({
      ...prev,
      latitude: location.latitude.toString(),
      longitude: location.longitude.toString(),
    }));
    setSelectedLocation(formatLocationName(location.displayName, 35));
    setSearchQuery('');
    setShowResults(false);
    setSearchResults([]);
  };

  const handleMapLocationChange = (lat: number, lng: number) => {
    setFormData(prev => ({
      ...prev,
      latitude: lat.toFixed(6),
      longitude: lng.toFixed(6),
    }));
    setSelectedLocation('Custom location');
  };

  const clearLocation = () => {
    setSelectedLocation(null);
    setSearchQuery('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'latitude' || name === 'longitude') {
      setSelectedLocation(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
      capacityKw: parseFloat(formData.capacityKw),
      efficiency: parseFloat(formData.efficiency),
      performanceRatio: parseFloat(formData.performanceRatio),
      monthlyBill: parseFloat(formData.monthlyBill),
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
          <Settings className="w-4 h-4 text-white" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-gray-900">System Configuration</h2>
          <p className="text-gray-500 text-xs">Set your solar installation details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative" ref={searchRef}>
          <label className="flex items-center gap-1 text-xs font-medium text-gray-600 mb-1">
            <Search className="w-3 h-3" />
            Search Location
          </label>
          {selectedLocation ? (
            <div className="flex items-center gap-2 p-2 bg-emerald-50 border border-emerald-200 rounded-lg">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span className="text-gray-900 text-xs flex-1 truncate">{selectedLocation}</span>
              <button
                type="button"
                onClick={clearLocation}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => searchQuery.length >= 2 && searchResults.length > 0 && setShowResults(true)}
                placeholder="e.g., ISKCON Bangalore..."
                className="w-full px-3 py-2 pr-8 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                {isSearching ? (
                  <div className="w-3 h-3 border-2 border-gray-300 border-t-emerald-500 rounded-full animate-spin" />
                ) : (
                  <Search className="w-3 h-3 text-gray-400" />
                )}
              </div>

              {showResults && searchResults.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
                  {searchResults.map((result, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSelectLocation(result)}
                      className="w-full px-3 py-2 text-left hover:bg-emerald-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                        <div className="min-w-0 text-left">
                          <p className="text-gray-900 text-xs font-medium">{result.name}</p>
                          <p className="text-gray-500 text-xs truncate">{result.displayName}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">Or click on map to select location</label>
          <LocationPickerMap
            latitude={parseFloat(formData.latitude) || BANGALORE_LAT}
            longitude={parseFloat(formData.longitude) || BANGALORE_LNG}
            onLocationChange={handleMapLocationChange}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              Latitude
            </label>
            <input
              type="number"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              step="any"
              className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              Longitude
            </label>
            <input
              type="number"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              step="any"
              className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              required
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
            <Sun className="w-3 h-3" />
            Solar Panel Capacity (kW)
          </label>
          <input
            type="number"
            name="capacityKw"
            value={formData.capacityKw}
            onChange={handleChange}
            min="0.1"
            step="0.1"
            className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Panel Efficiency (%)
            </label>
            <input
              type="number"
              name="efficiency"
              value={formData.efficiency}
              onChange={handleChange}
              min="1"
              max="100"
              className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Performance Ratio (%)
            </label>
            <input
              type="number"
              name="performanceRatio"
              value={formData.performanceRatio}
              onChange={handleChange}
              min="1"
              max="100"
              className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              required
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
            <Zap className="w-3 h-3" />
            Monthly Electricity Bill (₹)
          </label>
          <input
            type="number"
            name="monthlyBill"
            value={formData.monthlyBill}
            onChange={handleChange}
            min="0"
            step="100"
            className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold rounded-lg transition-all transform hover:scale-[1.01] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 text-sm"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sun className="w-4 h-4" />
              Generate Forecast
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default InputForm;
