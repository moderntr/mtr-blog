import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { uploadToCloudinary } from '@/lib/cloudinary';

interface ImageUploadProps {
  onUpload: (url: string) => void;
  defaultImage?: string;
  className?: string;
}

export function ImageUpload({ onUpload, defaultImage, className }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(defaultImage);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      setUploading(true);
      const file = acceptedFiles[0];
      const url = await uploadToCloudinary(file);
      setPreview(url);
      onUpload(url);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 1,
  });

  const removeImage = () => {
    setPreview(undefined);
    onUpload('');
  };

  return (
    <div className={className}>
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={removeImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
            hover:border-primary hover:bg-primary/5`}
        >
          <input {...getInputProps()} />
          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {uploading ? 'Uploading...' : 'Drag & drop an image here, or click to select'}
          </p>
        </div>
      )}
    </div>
  );
}