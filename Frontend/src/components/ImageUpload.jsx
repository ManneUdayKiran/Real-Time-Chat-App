import React, { useState } from 'react';
import { Upload, Button, message, Image } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

const ImageUpload = ({ onUploadSuccess }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleBeforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('Only image files are allowed!');
      return false;
    }

    const reader = new FileReader();
    reader.onload = (e) => setPreviewUrl(e.target.result);
    reader.readAsDataURL(file);
    setFile(file);

    return false; // prevent default upload
  };

  const handleUpload = async () => {
    if (!file) return message.warning('No image selected');
    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploading(true);
      const res = await axios.post('https://real-time-chat-app-tgy9.onrender.com/api/uploads', formData);
      message.success('Upload successful!');
      onUploadSuccess(res.data.url); // send image URL to parent
      setFile(null);
      setPreviewUrl(null);
    } catch (err) {
      message.error('Upload failed');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setPreviewUrl(null);
  };

  return (
    <div style={{ textAlign: 'center', margin: '1rem 0' }}>
      <Upload
        beforeUpload={handleBeforeUpload}
        showUploadList={false}
        accept="image/*"
      >
        <Button icon={<UploadOutlined />}>Choose Image</Button>
      </Upload>

      {previewUrl && (
        <div style={{ marginTop: 16 }}>
          <Image src={previewUrl} alt="Preview" width={200} />
          <div style={{ marginTop: 8 }}>
            <Button
              type="primary"
              onClick={handleUpload}
              loading={uploading}
              style={{ marginRight: 8 }}
            >
              Upload
            </Button>
            <Button icon={<DeleteOutlined />} onClick={handleClear}>
              Clear
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
