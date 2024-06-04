import React from 'react';

interface PasswordFieldsProps {
	oldPassword: string;
	newPassword: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PasswordFields: React.FC<PasswordFieldsProps> = ({ oldPassword, newPassword, onChange }) => {
	return (
		<>
			<div className="mb-4">
				<label className="block font-semibold mb-2">Old Password:</label>
				<input
					type="password"
					className="border border-gray-300 px-4 py-2 w-full rounded-md text-black"
					value={oldPassword}
					onChange={onChange}
					name="oldPassword"
					required
				/>
			</div>
			<div className="mb-4">
				<label className="block font-semibold mb-2">New Password:</label>
				<input
					type="password"
					className="border border-gray-300 px-4 py-2 w-full rounded-md text-black"
					value={newPassword}
					onChange={onChange}
					name="newPassword"
					required
				/>
			</div>
		</>
	);
};

export default PasswordFields;
