import React, { useState, FormEvent } from 'react';
import LocationSearch from './LocationSearch';
import { FavoriteFacility, HomeAddress, User } from '../../models/user.model';

export interface Location {
	place_id: string;
	display_name: string;
	lat: string;
	lon: string;
}

interface ProfileFormProps {
	user: User | null;
	onUpdate: (formData: FormData) => void;
	onDelete: () => void;
}

interface FormData {
	email: string;
	favoriteFacilityAddress: FavoriteFacility | null;
	homeAddress: HomeAddress | null;
	oldPassword: string;
	newPassword: string;
}


const ProfileForm: React.FC<ProfileFormProps> = ({ user, onUpdate, onDelete }) => {
	const generateFavoriteFacilityAddress = () => {
		const { properties } = user?.favoriteFacility || {};
		const { bezeichnung, strasse, plz, ort } = properties || {};
		const addressParts = [bezeichnung, strasse, plz, ort].filter(Boolean);
		return addressParts.length ? addressParts.join(', ') : '';
	};
	const [formData, setFormData] = useState<FormData>({
		email: user?.email || '',
		favoriteFacilityAddress: user?.favoriteFacility || null,
		homeAddress: user?.homeAddress || null,
		oldPassword: '',
		newPassword: '',
	});

	const [showPasswordFields, setShowPasswordFields] = useState(false);

	const handleHomeLocationSelect = (selectedLocation: Location) => {
		setFormData((prevData) => ({
			...prevData,
			homeAddress: {
				name: selectedLocation.display_name,
				placeId: selectedLocation.place_id,
				coordinates: [Number(selectedLocation.lat), Number(selectedLocation.lon)],
			},
		}));
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		onUpdate(formData);
	};

	return (
		<form onSubmit={handleSubmit} className="flex flex-col min-h-full p-6 sm:p-8 md:px-[10rem] md:py-8 lg:px-[20rem] lg:py-10 xl:py-12 xl:px-[30rem] text-white animate-gradient-x">
			<h1 className="text-3xl font-bold mb-4">User Profile</h1>
			<div className="mb-4">
				<label className="block font-semibold mb-2">Email:</label>
				<input
					type="text"
					className="border border-gray-300 px-4 py-2 w-full rounded-md text-black"
					value={formData.email}
					readOnly={true}
					onChange={handleChange}
					name="email"
				/>
			</div>
			{user?.favoriteFacility && (
				<div className="mb-4">
					<label className="block font-semibold mb-2">Favorite Facility Address:</label>
					<input
						type="text"
						className="border border-gray-300 px-4 py-2 w-full rounded-md text-black"
						value={generateFavoriteFacilityAddress() || ''}
						readOnly={false}
						onChange={handleChange}
						name="favoriteFacilityAddress"
					/>
				</div>
			)}
			{formData.homeAddress?.name && (
				<div className="mb-4">
					<label className="block font-semibold mb-2">Home Address:</label>
					<LocationSearch inputValue={formData.homeAddress?.name} onSelect={handleHomeLocationSelect} />
				</div>
			)}
			{showPasswordFields && (
				<>
					<div className="mb-4">
						<label className="block font-semibold mb-2">Old Password:</label>
						<input
							type="password"
							className="border border-gray-300 px-4 py-2 w-full rounded-md text-black"
							value={formData.oldPassword}
							onChange={handleChange}
							name="oldPassword"
							required
						/>
					</div>
					<div className="mb-4">
						<label className="block font-semibold mb-2">New Password:</label>
						<input
							type="password"
							className="border border-gray-300 px-4 py-2 w-full rounded-md text-black"
							value={formData.newPassword}
							onChange={handleChange}
							name="newPassword"
							required
						/>
					</div>
				</>
			)}
			<label className="relative inline-flex items-center cursor-pointer mb-4">
				<input
					type="checkbox"
					className="sr-only peer"
					checked={showPasswordFields}
					onChange={() => setShowPasswordFields(!showPasswordFields)}
				/>
				<div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 transition-all duration-300"></div>
				<span className="ml-3 text-sm font-medium text-white-900">
					{showPasswordFields ? 'Hide Password Fields' : 'Change Password'}
				</span>
			</label>
			<div className="flex space-x-4">
				<button
					type="submit"
					className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-700 hover:text-gray-300 active:bg-gray-600 active:shadow-inner"
				>
					Update
				</button>
				<button
					type="button"
					className="bg-red-500 text-white px-4 py-2 rounded-md ml-4 hover:bg-red-700 hover:text-gray-200 active:bg-red-800 active:shadow-inner"
					onClick={onDelete}
				>
					Delete Profile
				</button>
			</div>
		</form>
	);
};

export default ProfileForm;
