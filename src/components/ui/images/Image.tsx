import React, { useState } from "react";
import { Keyboard, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Modal } from "../modal";
import { cloudinaryUrl } from "../../../lib/utils";
import LoadingCake from "../LoadingCake";
import { ImageOff } from "lucide-react";
import ImageDownloadAndCopy from "./ImageCopyDownload.tsx";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  className?: string;

  // Full url of image.
  images?: string[];

  isCloudinaryUrl?: boolean;
  src?: string;
}

const Image: React.FC<ImageProps> = ({
  className,
  onClick,
  images,
  isCloudinaryUrl = true,
  src,
  ...props
}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!src && !images?.length) return;
    setIsPopupOpen(true);
    setIsImageLoading(true);
    onClick?.(e);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setIsImageLoading(false);
  };

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  const handleImageError = () => {
    setIsImageLoading(false);
  };

  const renderSlider = (imagesArr: string[]) => (
    <Swiper
      modules={[Navigation, Pagination, Keyboard]}
      navigation
      pagination={{ clickable: true }}
      spaceBetween={10}
      slidesPerView={1}
      className="h-full "
      keyboard={true}
    >
      {imagesArr.map((img, idx) => (
        <SwiperSlide key={img + idx}>
          <div className="relative h-full w-full flex items-center justify-center">
            <img
              src={
                isCloudinaryUrl ? cloudinaryUrl(img, { quality: "auto" }) : img
              }
              alt={props.alt || `image-${idx}`}
              className="h-full w-full object-contain animation-zoom-in"
              loading="lazy"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
            <ImageDownloadAndCopy
              key={"imgCopy" + img + idx}
              imageUrlToCopy={
                isCloudinaryUrl
                  ? cloudinaryUrl(img, { quality: "auto", format: "png" })
                  : img
              }
              imageUrlToDownload={img}
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );

  return (
    <>
      <div className="relative cursor-pointer" onClick={handleImageClick}>
        {src ? (
          <img
            className={className}
            src={
              isCloudinaryUrl
                ? cloudinaryUrl(src, { width: 500, quality: "auto" })
                : src
            }
            {...props}
          />
        ) : (
          <ImageOff className="text-gray-400" />
        )}
        {images?.filter((url) => url).length ? (
          <span className="absolute left-1/2 top-1/2 -translate-1/2">
            <span className="bg-white/85 rounded-full w-5 h-5 block inline-flex justify-center items-center">
              {images?.filter((url) => url).length}
            </span>
          </span>
        ) : null}
      </div>
      <Modal
        isFullscreen={true}
        isOpen={isPopupOpen}
        size="lg"
        onClose={handleClosePopup}
      >
        <div className="relative h-full" onClick={(e) => e.stopPropagation()}>
          {images && images.length > 0 ? (
            renderSlider(images)
          ) : (
            <div className="relative h-full w-full flex items-center justify-center">
              {isImageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <LoadingCake />
                </div>
              )}
              <img
                src={
                  isCloudinaryUrl
                    ? cloudinaryUrl(src, { quality: "auto" })
                    : src
                }
                alt={props.alt || "image"}
                className="h-full w-full object-contain animation-zoom-in"
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
              <ImageDownloadAndCopy
                imageUrlToCopy={
                  isCloudinaryUrl
                    ? cloudinaryUrl(src, { quality: "auto", format: "png" })
                    : src
                }
                imageUrlToDownload={src}
              />
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default Image;
