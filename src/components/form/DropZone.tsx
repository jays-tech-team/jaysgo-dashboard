import { AxiosError } from "axios";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, rectSortingStrategy, SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  CircleSlash,
  CloudUpload,
  GripVertical,
  Link as LinkIcon,
  LoaderCircle,
  Trash2,
} from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Link } from "react-router";
import { toast } from "sonner";
import apiEngine from "../../lib/axios";
import { CloudinaryUploadResponse } from "../../types/Cloudinary.types";
import Button from "../ui/button/Button";
import CloudinaryImagePickerModal from "./CloudinaryImagePickerModal";

import { cn, isVideoUrl } from "../../lib/utils";
import { Modal } from "../ui/modal";

interface SortableImageItemProps {
  id: string;
  url: string;
  index: number;
  onRemove: (index: number) => void;
}

const SortableImageItem: React.FC<SortableImageItemProps> = ({
  id,
  url,
  index,
  onRemove,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    transition: {
      duration: 200,
      easing: "cubic-bezier(0.25, 1, 0.5, 1)",
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: "none" as const,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative group",
        isDragging && "z-10 opacity-90 shadow-lg scale-105"
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className={cn(
          "absolute left-0 top-0 z-10 w-6 h-6 flex items-center justify-center rounded-bl cursor-grab active:cursor-grabbing",
          "bg-slate-700/80 text-white opacity-0 group-hover:opacity-100 transition-opacity",
          isDragging && "opacity-100"
        )}
        aria-label="Drag to reorder"
      >
        <GripVertical className="w-4 h-4" />
      </div>
      <Link to={url} target="_blank" className="block">
        {isVideoUrl(url) ? (
          <video
            src={url}
            className="w-24 h-24 object-cover rounded-md"
            controls
            preload="metadata"
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <img
            src={url}
            alt={`Uploaded ${index + 1}`}
            className="w-24 h-24 object-cover rounded-md"
          />
        )}
      </Link>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          onRemove(index);
        }}
        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
        aria-label="Remove image"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};

interface DropZoneProps {
  /**
   * call back function to get uploaded image URL
   * @param urls
   * @returns
   */
  onChange: (urls: string[]) => void;
  maxFiles?: number;
  acceptedFileTypes?: string[];
  uploadFolder?: string;
  values?: string[];
  allowUploaded?: boolean;
  disabled?: boolean;
  /**
   * The function will call when the uploading status change.
   * @param isUploading boolean
   * @returns void
   */
  onUploading?: (isUploading: boolean) => void;
}

/**
 * A component for drag and drop
 * Default 100 files can upload. if you want to customize it, pass it maxUploadNumber
 *
 */
const DropZone: React.FC<DropZoneProps> = ({
  onChange,
  maxFiles = 5,
  acceptedFileTypes = ["image/jpeg", "image/png", "image/gif"],
  uploadFolder = "uploads",
  values = [],
  allowUploaded = true,
  disabled = false,
  onUploading,
}) => {
  const filteredValues = values.filter((url) => url && !!url.trim());
  const [uploadedImages, setUploadedImages] = useState<string[]>(filteredValues);
  const [imageIds, setImageIds] = useState<string[]>(() =>
    filteredValues.map(() => crypto.randomUUID())
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isCloudinaryModalOpen, setIsCloudinaryModalOpen] = useState(false);
  const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) {
        toast.error(`Please upload a valid image file. Max ${maxFiles} files`);
        return false;
      }

      setIsUploading(true);
      onUploading?.(true);
      try {
        const formData = new FormData();
        acceptedFiles.forEach((file, index) => {
          formData.append("file" + index, file);
        });

        const uploadAPI = await apiEngine.post<CloudinaryUploadResponse>(
          "cloudinary/upload?folder=" + uploadFolder || "",
          formData,
          {
            headers: {
              "Content-Type": "form-data/multipart",
            },
          }
        );

        if (uploadAPI.status != 201) {
          throw new Error(uploadAPI.data?.message || "Upload failed");
        }

        const { data } = await uploadAPI.data;
        const imageUrl = data.images.map((image) => image.secure_url);
        const newIds = imageUrl.map(() => crypto.randomUUID());

        setUploadedImages((prev) => [...prev, ...imageUrl]);
        setImageIds((prev) => [...prev, ...newIds]);
        onChange([...uploadedImages, ...imageUrl]);
      } catch (error) {
        console.error("Error uploading images:", error);
        if (error instanceof AxiosError) {
          console.error(error);
        } else if (error instanceof Error) {
          toast.error(error.message);
        }
      } finally {
        setIsUploading(false);
        onUploading?.(false);
      }
    },
    [onChange, uploadedImages, onUploading, maxFiles, uploadFolder]
  );

  useEffect(() => {
    const urls = values.filter((url) => url && !!url.trim());
    setUploadedImages(urls);
    setImageIds(urls.map(() => crypto.randomUUID()));
  }, [values]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce(
      (acc, type) => ({ ...acc, [type]: [] }),
      {}
    ),
    maxFiles,
    multiple: maxFiles != 1,
  });

  const removeImage = (index: number) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    const newIds = imageIds.filter((_, i) => i !== index);
    setUploadedImages(newImages);
    setImageIds(newIds);
    onChange(newImages);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
        delay: 0,
        tolerance: 5,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = imageIds.indexOf(active.id as string);
    const newIndex = imageIds.indexOf(over.id as string);

    if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
      const reorderedImages = arrayMove(uploadedImages, oldIndex, newIndex);
      const reorderedIds = arrayMove(imageIds, oldIndex, newIndex);
      setUploadedImages(reorderedImages);
      setImageIds(reorderedIds);
      onChange(reorderedImages);
    }
  };

  const openCloudinaryModal = () => {
    setIsCloudinaryModalOpen(true);
  };

  const closeCloudinaryModal = () => {
    setIsCloudinaryModalOpen(false);
  };

  const handleCloudinarySelect = (urls: string[]) => {
    const newImages = [...uploadedImages, ...urls].slice(0, maxFiles);
    const newIds = newImages.map((_, i) =>
      i < imageIds.length ? imageIds[i] : crypto.randomUUID()
    );
    setImageIds(newIds);
    setUploadedImages(newImages);
    onChange(newImages);
    closeCloudinaryModal();
  };

  const openUrlModal = () => {
    // Pre-fill textarea with existing URLs
    setUrlInput(uploadedImages.join("\n"));
    setIsUrlModalOpen(true);
  };

  const validateAndCloseUrlModal = () => {
    // Parse URLs from textarea (one per line)
    const urls = urlInput
      .split("\n")
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    // If no URLs, just close the modal
    if (urls.length === 0) {
      closeUrlModal();
      return;
    }

    // Validate URLs
    const invalidUrls = urls.filter((url) => {
      try {
        new URL(url);
        return false;
      } catch {
        return true;
      }
    });

    if (invalidUrls.length > 0) {
      toast.error(`Invalid URLs found: ${invalidUrls.join(", ")}`);
      return;
    }

    // Check max files limit
    if (urls.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }

    // If validation passes, close modal without saving
    closeUrlModal();
  };

  const closeUrlModal = () => {
    setIsUrlModalOpen(false);
    setUrlInput("");
  };

  const handleUrlSubmit = () => {
    // Parse URLs from textarea (one per line)
    const urls = urlInput
      .split("\n")
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    // Validate URLs
    const invalidUrls = urls.filter((url) => {
      try {
        new URL(url);
        return false;
      } catch {
        return true;
      }
    });

    if (invalidUrls.length > 0) {
      toast.error(`Invalid URLs found: ${invalidUrls.join(", ")}`);
      return;
    }

    // Check max files limit
    if (urls.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }

    setUploadedImages(urls);
    setImageIds(urls.map(() => crypto.randomUUID()));
    onChange(urls);
    closeUrlModal();
    toast.success(`${urls.length} URL(s) added successfully`);
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-4 w-full",
        disabled ? "opacity-50 pointer-events-none" : ""
      )}
    >
      {uploadedImages.length < maxFiles && (
        <div className="flex gap-4">
          <div
            {...getRootProps()}
            className={`p-6 border-2 border-dashed rounded-md w-full text-center cursor-pointer transition-colors
          ${
            isDragActive
              ? "border-brand-400 bg-brand-50"
              : "border-gray-200 hover:border-brand-400"
          }`}
          >
            <input {...getInputProps()} />
            <p className="text-gray-400 text-xs">
              <span>
                {disabled ? (
                  <CircleSlash className="inline-block" />
                ) : (
                  <CloudUpload className="inline-block" />
                )}
              </span>
              <br />
              {isDragActive
                ? "Drop the images here..."
                : "Drag and drop images here, or click to select files"}
            </p>

            {isUploading && (
              <p className="mt-2 text-gray-500 flex items-center gap-2 justify-center">
                <LoaderCircle className="animate-spin inline-block" size={18} />{" "}
                Uploading...
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Button
              hidden={!allowUploaded}
              type="button"
              onClick={openCloudinaryModal}
              size="sm"
              variant="outline"
            >
              Choose from Uploaded
            </Button>
            <Button
              type="button"
              onClick={openUrlModal}
              size="sm"
              variant="outline"
            >
              <LinkIcon className="w-4 h-4 mr-1" />
              Add URLs
            </Button>
          </div>
        </div>
      )}

      {uploadedImages.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={imageIds}
            strategy={rectSortingStrategy}
          >
            <div className="flex flex-wrap gap-4">
              {uploadedImages.map((url, index) => (
                <SortableImageItem
                  key={imageIds[index]}
                  id={imageIds[index]}
                  url={url}
                  index={index}
                  onRemove={removeImage}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Cloudinary Modal */}
      <CloudinaryImagePickerModal
        isOpen={isCloudinaryModalOpen}
        onClose={closeCloudinaryModal}
        onSelect={handleCloudinarySelect}
        maxSelectable={maxFiles - uploadedImages.length}
      />

      {/* URL Input Modal */}
      <Modal
        isOpen={isUrlModalOpen}
        onClose={validateAndCloseUrlModal}
        title="Add Image URLs"
        size="md"
        footer={
          <div className="flex justify-end gap-2 items-center h-full">
            <Button
              type="button"
              onClick={validateAndCloseUrlModal}
              variant="outline"
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleUrlSubmit}>
              Add URLs
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-3">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Enter image URLs, one per line. Maximum {maxFiles} URLs allowed.
          </p>
          <textarea
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg&#10;https://example.com/image3.jpg"
            className="w-full h-64 p-3 border border-gray-300 dark:border-gray-600 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-brand-400 dark:bg-gray-800 dark:text-white"
            autoFocus
          />
          <p className="text-xs text-gray-500">
            Current: {urlInput.split("\n").filter((url) => url.trim()).length}{" "}
            URL(s) | Max: {maxFiles}
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default DropZone;
