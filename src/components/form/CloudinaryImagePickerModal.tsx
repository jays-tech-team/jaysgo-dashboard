import React, { useEffect, useState } from "react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import apiEngine from "../../lib/axios";
import { toast } from "sonner";
import { cloudinaryUrl } from "../../lib/utils";
import { ApiResponse } from "../../types/General.api.types";

export type CloudinaryImage = {
  secure_url: string;
  filename: string;
  public_id: string;
};

interface CloudinaryImagePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (urls: string[]) => void;
  maxSelectable: number;
}

const CloudinaryImagePickerModal: React.FC<CloudinaryImagePickerModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  maxSelectable,
}) => {
  const [cloudinaryImages, setCloudinaryImages] = useState<CloudinaryImage[]>(
    []
  );
  const [cloudinaryLoading, setCloudinaryLoading] = useState(false);
  const [cloudinaryError, setCloudinaryError] = useState<string | null>(null);
  const [cloudinarySelected, setCloudinarySelected] = useState<string[]>([]);
  const [cloudinaryNextCursor, setCloudinaryNextCursor] = useState<
    string | null
  >(null);
  const [cloudinaryHasMore, setCloudinaryHasMore] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setCloudinaryImages([]);
      setCloudinarySelected([]);
      setCloudinaryNextCursor(null);
      setCloudinaryHasMore(true);
      fetchCloudinaryImages();
    }
  }, [isOpen]);

  const fetchCloudinaryImages = async (nextCursor?: string) => {
    setCloudinaryLoading(true);
    setCloudinaryError(null);
    try {
      const params: Record<string, string> = {};
      if (nextCursor) params.nextCursor = nextCursor;
      const res = await apiEngine.get<
        ApiResponse<{
          items: CloudinaryImage[];
          meta: {
            nextCursor: string;
          };
        }>
      >("cloudinary", { params });
      const imagesArr = (res.data.data.items || []).map((img) => ({
        secure_url: img.secure_url,
        filename: img.filename,
        public_id: img.public_id,
      }));
      setCloudinaryImages((prev) => [...prev, ...imagesArr]);

      setCloudinaryNextCursor(res.data.data.meta?.nextCursor);
      setCloudinaryHasMore(!!res.data.data.meta?.nextCursor);
    } catch (err) {
      if (err instanceof Error)
        setCloudinaryError(err?.message || "Failed to fetch images");
    } finally {
      setCloudinaryLoading(false);
    }
  };

  const handleCloudinarySelect = (url: string) => {
    const alreadySelected = cloudinarySelected.includes(url);
    if (alreadySelected) {
      setCloudinarySelected(cloudinarySelected.filter((u) => u !== url));
    } else if (cloudinarySelected.length < maxSelectable) {
      setCloudinarySelected([...cloudinarySelected, url]);
    } else {
      toast.info(`You can select up to ${maxSelectable} images.`);
    }
  };

  const handleCloudinaryConfirm = () => {
    onSelect(cloudinarySelected);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title="Choose from Cloudinary"
      footer={
        <div className="flex justify-end gap-2">
          {cloudinaryHasMore && !cloudinaryLoading && (
            <Button
              type="button"
              onClick={() =>
                fetchCloudinaryImages(cloudinaryNextCursor || undefined)
              }
              size="sm"
            >
              Load More
            </Button>
          )}
          <Button type="button" variant="outline" onClick={onClose} size="sm">
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleCloudinaryConfirm}
            size="sm"
            disabled={cloudinarySelected.length === 0}
          >
            Add Selected
          </Button>
        </div>
      }
    >
      <div className="min-h-[300px] h-full">
        {cloudinaryError && (
          <div className="text-red-500 mb-2">{cloudinaryError}</div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-4 h-full overflow-y-auto">
          {cloudinaryImages.map((img) => (
            <div
              key={img.public_id}
              className={`relative border rounded-md cursor-pointer group ${
                cloudinarySelected.includes(img.secure_url)
                  ? "border-brand-500 ring-2 ring-brand-400"
                  : "border-gray-200"
              }`}
              onClick={() => handleCloudinarySelect(img.secure_url)}
              title={img.filename}
            >
              <img
                src={cloudinaryUrl(img.secure_url)}
                alt={img.filename}
                className="w-full h-32 object-cover rounded-md"
              />
              {cloudinarySelected.includes(img.secure_url) && (
                <span className="absolute top-2 right-2 bg-brand-500 text-white rounded-full px-2 py-1 text-xs">
                  Selected
                </span>
              )}
              <span className="absolute bottom-2 left-2 bg-black/60 text-white text-xs rounded px-1 py-0.5 max-w-[90%] truncate">
                {img.filename}
              </span>
            </div>
          ))}
        </div>
        {cloudinaryLoading && (
          <div className="text-center py-4">Loading...</div>
        )}
      </div>
    </Modal>
  );
};

export default CloudinaryImagePickerModal;
