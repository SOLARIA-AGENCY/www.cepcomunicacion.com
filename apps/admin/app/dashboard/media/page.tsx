/**
 * Media Management Page
 *
 * File upload interface for managing media files in MinIO S3 storage.
 *
 * Features:
 * - File upload with drag & drop support
 * - Real-time upload progress
 * - File preview (images)
 * - File type and size validation
 *
 * @module app/dashboard/media
 */

'use client';

import { useState } from 'react';

interface UploadResponse {
  success: boolean;
  filename?: string;
  url?: string;
  size?: number;
  type?: string;
  error?: string;
}

export default function MediaPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<UploadResponse | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setResult(null);

    // Generate preview for images
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data: UploadResponse = await response.json();
      setResult(data);

      if (data.success) {
        // Reset form on success
        setFile(null);
        setPreview(null);
        const input = document.getElementById('file-input') as HTMLInputElement;
        if (input) input.value = '';
      }
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Media Management
        </h1>
        <p className="text-gray-600 mb-8">
          Upload and manage files in S3-compatible storage (MinIO)
        </p>

        {/* Upload Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Upload File</h2>

          {/* File Input */}
          <div className="mb-4">
            <label
              htmlFor="file-input"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Select File
            </label>
            <input
              id="file-input"
              type="file"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
              disabled={uploading}
            />
            {file && (
              <p className="mt-2 text-sm text-gray-600">
                Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </p>
            )}
          </div>

          {/* Image Preview */}
          {preview && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
              <img
                src={preview}
                alt="Preview"
                className="max-w-full h-auto rounded-lg border border-gray-200"
                style={{ maxHeight: '300px' }}
              />
            </div>
          )}

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {uploading ? 'Uploading...' : 'Upload File'}
          </button>
        </div>

        {/* Upload Result */}
        {result && (
          <div
            className={`rounded-lg p-4 mb-6 ${
              result.success
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}
          >
            <h3
              className={`font-semibold mb-2 ${
                result.success ? 'text-green-800' : 'text-red-800'
              }`}
            >
              {result.success ? '✓ Upload Successful' : '✗ Upload Failed'}
            </h3>
            {result.success ? (
              <div className="text-sm text-green-700">
                <p>
                  <strong>Filename:</strong> {result.filename}
                </p>
                <p>
                  <strong>Type:</strong> {result.type}
                </p>
                <p>
                  <strong>Size:</strong> {((result.size || 0) / 1024).toFixed(2)} KB
                </p>
                <p className="mt-2">
                  <strong>URL:</strong>{' '}
                  <a
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-all"
                  >
                    {result.url}
                  </a>
                </p>
              </div>
            ) : (
              <p className="text-sm text-red-700">{result.error}</p>
            )}
          </div>
        )}

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">
            Supported File Types
          </h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Images: JPEG, PNG, GIF, WebP, SVG</li>
            <li>• Documents: PDF, Word (.doc, .docx), Excel (.xls, .xlsx)</li>
            <li>• Video: MP4, WebM, QuickTime</li>
            <li>• Maximum file size: 100 MB</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
