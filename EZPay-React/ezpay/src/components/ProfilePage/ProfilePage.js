import React from 'react';
import ProfileUpdate from '../components/ProfileUpdate';

const ProfilePage = () => {
    const handleProfileUpdate = async (formData) => {
        try {
            const response = await fetch('http://localhost:8094/customers/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                Swal.fire({
                    title: 'Update Success!',
                    text: 'Profile Changes saved.',
                    icon: 'success',
                    confirmButtonText: 'Okay',
                  });
                //alert('Profile updated successfully');
            } else {
                Swal.fire({
                    title: 'Update Failed!',
                    text: 'Changes not Saved',
                    icon: 'warning',
                    confirmButtonText: 'Okay',
                  });
                //alert('Failed to update profile');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <h1>Update Profile</h1>
            <ProfileUpdate onSubmit={handleProfileUpdate} />
        </div>
    );
};

export default ProfilePage;
