// Image upload service
// This is a basic implementation that can be extended to work with cloud storage services
// like Cloudinary, AWS S3, Firebase Storage, etc.

export interface UploadResponse {
  url: string;
  publicId?: string;
}

export class ImageUploadService {
  // For now, this converts files to base64 data URLs
  // In production, you'd upload to a cloud service
  static async uploadFile(file: File, onProgress?: (progress: number) => void): Promise<UploadResponse> {
    return new Promise((resolve, reject) => {
      // Validate file
      if (!file.type.startsWith('image/')) {
        reject(new Error('File must be an image'));
        return;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        reject(new Error('File size must be less than 5MB'));
        return;
      }

      const reader = new FileReader();
      
      reader.onload = () => {
        if (onProgress) onProgress(100);
        resolve({
          url: reader.result as string,
          publicId: `local_${Date.now()}_${file.name}`
        });
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      // Simulate progress
      if (onProgress) {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 20;
          onProgress(progress);
          if (progress >= 80) {
            clearInterval(interval);
          }
        }, 100);
      }

      reader.readAsDataURL(file);
    });
  }

  // Example function for cloud upload (to be implemented based on your chosen service)
  static async uploadToCloud(file: File, onProgress?: (progress: number) => void): Promise<UploadResponse> {
    // This would be implemented with your chosen cloud storage service
    // Examples:
    
    // For Cloudinary:
    // const formData = new FormData();
    // formData.append('file', file);
    // formData.append('upload_preset', 'your_preset');
    // 
    // const response = await fetch('https://api.cloudinary.com/v1_1/your_cloud_name/image/upload', {
    //   method: 'POST',
    //   body: formData
    // });
    // 
    // const data = await response.json();
    // return { url: data.secure_url, publicId: data.public_id };

    // For now, fallback to local conversion
    return this.uploadFile(file, onProgress);
  }

  // Validate image file
  static validateImageFile(file: File): { valid: boolean; error?: string } {
    if (!file.type.startsWith('image/')) {
      return { valid: false, error: 'Please select a valid image file' };
    }

    if (file.size > 5 * 1024 * 1024) {
      return { valid: false, error: 'File size must be less than 5MB' };
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Supported formats: JPEG, PNG, GIF, WebP' };
    }

    return { valid: true };
  }

  // Generate thumbnail (optional)
  static async generateThumbnail(file: File, maxWidth: number = 300, maxHeight: number = 300): Promise<string> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and convert to data URL
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };

      img.src = URL.createObjectURL(file);
    });
  }
}

export default ImageUploadService;
