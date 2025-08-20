import { useState, useEffect } from "react";

interface ImageUploadProps {
  onUpload: (url: string) => void;
  initialImage?: string;
}

export function ImageUploadInput({ onUpload, initialImage }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(initialImage || null);

  useEffect(() => {
    if (initialImage) {
      setPreview(initialImage);
    }
  }, [initialImage]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "GatoJapones");
    formData.append("folder", "GatoJapones");

    const res = await fetch("https://api.cloudinary.com/v1_1/dkhbhau0a/image/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setPreview(data.secure_url);
    onUpload(data.secure_url);
  };

  return (
    <div className="flex items-center justify-center p-1 border-2 border-dashed rounded-md hover:border-gray-600 duration-200 ease-in-out">
      <input style={{ width: '140px' }} type="file" accept="image/*" onChange={handleFileChange} />
      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="mt-2 rounded-md w-32 h-auto"
        />
      )}
    </div>
  );
}
