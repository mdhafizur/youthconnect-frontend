// components/LocationSearch.tsx

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export interface Location {
	place_id: string;
	display_name: string;
	lat: string;
	lon: string;
}

interface LocationSearchProps {
	onSelect: (location: Location) => void;
	inputValue?: string;
	debounceTime?: number;
}

const LocationSearch: React.FC<LocationSearchProps> = ({ onSelect, inputValue, debounceTime = 300 }) => {
	const [query, setQuery] = useState<string>(inputValue || '');
	const [locations, setLocations] = useState<Location[]>([]);
	const [showDropdown, setShowDropdown] = useState<boolean>(false);
	const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		if (inputValue) {
			setQuery(inputValue);
		}
	}, [inputValue]);

	useEffect(() => {
		if (query.trim() === '') {
			setLocations([]);
			return;
		}

		const fetchLocations = async () => {
			try {
				const response = await axios.get(
					`https://nominatim.openstreetmap.org/search?q=${query}&format=json`
				);
				setLocations(response.data);
			} catch (error) {
				console.error('Error fetching locations:', error);
				setLocations([]);
			}
		};

		// Clear the previous debounce timeout
		if (debounceTimeoutRef.current) {
			clearTimeout(debounceTimeoutRef.current);
		}

		// Set a new debounce timeout
		debounceTimeoutRef.current = setTimeout(() => {
			fetchLocations();
		}, debounceTime);

		return () => {
			// Cleanup: Clear the timeout when component unmounts or when query changes
			if (debounceTimeoutRef.current) {
				clearTimeout(debounceTimeoutRef.current);
			}
		};
	}, [query, debounceTime]);

	const handleSelect = (selectedLocation: Location) => {
		onSelect(selectedLocation);
		// Clear the query and suggestions after selection
		setQuery(selectedLocation.display_name);
		setLocations([]);
		// Close the dropdown after selection
		setShowDropdown(false);
	};

	return (
		<div className="relative w-full">
			<input
				type="text"
				value={query}
				onChange={(e) => {
					setQuery(e.target.value);
					setShowDropdown(true);
				}}
				placeholder="Enter location..."
				className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500 text-black"
			/>
			{showDropdown &&  (
				<div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg text-black">
					{locations.length > 0 ? (
						<ul>
							{locations.map((location) => (
								<li
									key={location.place_id}
									onClick={() => handleSelect(location)}
									className="px-4 py-2 cursor-pointer hover:bg-gray-100"
								>
									{location.display_name}
								</li>
							))}
						</ul>
					) : (
						<p className="p-2">No locations found</p>
					)}
				</div>
			)}
		</div>
	);
};

export default LocationSearch;
