import React, { useState, useRef, useEffect } from "react";
import anime from "animejs";
import { Upload, Button, message, Image, Tooltip, Modal } from "antd";
import {
  PictureOutlined,
  DeleteOutlined,
  SendOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import axios from "axios";

const ImageUpload = ({ onUploadSuccess }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const previewRef = useRef(null);

  useEffect(() => {
    if (previewUrl && previewRef.current) {
      anime({
        targets: previewRef.current,
        scale: [0.8, 1],
        opacity: [0, 1],
        duration: 300,
        easing: "easeOutExpo",
      });
    }
  }, [previewUrl]);

  const handleBeforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("Only image files are allowed!");
      return false;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target.result);
      setModalVisible(true);
    };
    reader.readAsDataURL(file);
    setFile(file);

    return false;
  };

  const handleUpload = async () => {
    if (!file) return message.warning("No image selected");
    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/uploads`,
        formData
      );
      message.success("Image sent successfully!");
      onUploadSuccess(res.data.url);
      handleClear();
    } catch (err) {
      message.error("Upload failed");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
    if (previewRef.current) {
      anime({
        targets: previewRef.current,
        scale: [1, 0.8],
        opacity: [1, 0],
        duration: 200,
        easing: "easeInExpo",
        complete: () => {
          setFile(null);
          setPreviewUrl(null);
          setModalVisible(false);
        },
      });
    } else {
      setFile(null);
      setPreviewUrl(null);
      setModalVisible(false);
    }
  };

  return (
    <>
      <Upload
        beforeUpload={handleBeforeUpload}
        showUploadList={false}
        accept="image/*"
      >
        <Tooltip title="Send Image">
          <Button
            type="text"
            icon={
              <PictureOutlined style={{ fontSize: 22, color: "#6366f1" }} />
            }
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s ease",
            }}
          />
        </Tooltip>
      </Upload>

      <Modal
        open={modalVisible}
        onCancel={handleClear}
        footer={null}
        centered
        closable={false}
        width={400}
        styles={{
          content: {
            borderRadius: 20,
            padding: 0,
            overflow: "hidden",
          },
        }}
      >
        <div
          ref={previewRef}
          style={{
            background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
            padding: 24,
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <span
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: "#1e293b",
              }}
            >
              Send Image
            </span>
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={handleClear}
              style={{ color: "#64748b" }}
            />
          </div>

          {/* Preview */}
          {previewUrl && (
            <div
              style={{
                borderRadius: 16,
                overflow: "hidden",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
                marginBottom: 20,
              }}
            >
              <Image
                src={previewUrl}
                alt="Preview"
                width="100%"
                style={{ display: "block" }}
                preview={false}
              />
            </div>
          )}

          {/* Actions */}
          <div
            style={{
              display: "flex",
              gap: 12,
            }}
          >
            <Button
              icon={<DeleteOutlined />}
              onClick={handleClear}
              style={{
                flex: 1,
                height: 44,
                borderRadius: 12,
                fontWeight: 500,
              }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleUpload}
              loading={uploading}
              style={{
                flex: 2,
                height: 44,
                borderRadius: 12,
                fontWeight: 500,
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                border: "none",
                boxShadow: "0 4px 16px rgba(99, 102, 241, 0.4)",
              }}
            >
              Send
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ImageUpload;
