/**
 * Cloudinary Image Upload Service
 * 
 * Handles image selection and upload to Cloudinary
 */

import * as ImagePicker from 'expo-image-picker';
import { CLOUD_NAME, UPLOAD_PRESET } from '../constants/cloudinary';

export interface UploadResult {
    success: boolean;
    url?: string;
    error?: string;
}

/**
 * Pick an image from the device gallery
 */
export const pickImage = async (): Promise<ImagePicker.ImagePickerAsset | null> => {
    try {
        // Request permissions
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to upload images!');
            return null;
        }

        // Launch image picker
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            return result.assets[0];
        }

        return null;
    } catch (error) {
        console.error('Error picking image:', error);
        return null;
    }
};

/**
 * Upload image to Cloudinary
 */
export const uploadToCloudinary = async (imageUri: string): Promise<UploadResult> => {
    try {
        const formData = new FormData();

        // Handle web platform differently
        if (imageUri.startsWith('blob:') || imageUri.startsWith('data:')) {
            // Web platform - convert blob to base64
            const response = await fetch(imageUri);
            const blob = await response.blob();

            // Convert blob to base64
            const base64 = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });

            formData.append('file', base64);
        } else {
            // Mobile platform - use file URI
            const filename = imageUri.split('/').pop() || 'photo.jpg';
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : 'image/jpeg';

            formData.append('file', {
                uri: imageUri,
                name: filename,
                type,
            } as any);
        }

        formData.append('upload_preset', UPLOAD_PRESET);
        formData.append('cloud_name', CLOUD_NAME);

        // Upload to Cloudinary
        const uploadResponse = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                },
            }
        );

        const data = await uploadResponse.json();

        if (uploadResponse.ok && data.secure_url) {
            return {
                success: true,
                url: data.secure_url,
            };
        } else {
            return {
                success: false,
                error: data.error?.message || 'Upload failed',
            };
        }
    } catch (error) {
        console.error('Upload error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Upload failed',
        };
    }
};

/**
 * Convenience function to pick and upload an image
 */
export const pickAndUploadImage = async (): Promise<UploadResult> => {
    const image = await pickImage();

    if (!image) {
        return {
            success: false,
            error: 'No image selected',
        };
    }

    return await uploadToCloudinary(image.uri);
};
