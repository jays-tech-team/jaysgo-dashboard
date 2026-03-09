import { toast } from "sonner";
import Button from "../button/Button";
import { Copy, Download } from "lucide-react";
import { useState } from "react";
import LoadingCircle from "../LoadingCircle";
import { __clog } from "../../../lib/utils";

export default function ImageDownloadAndCopy({
  imageUrlToCopy,
  imageUrlToDownload,
}: {
  imageUrlToCopy?: string;
  imageUrlToDownload?: string;
}) {
  const [loadingDownload, setLoadingDownload] = useState(false);
  const [loadingCopy, setLoadingCopy] = useState(false);
  const handleDownload = async (imgUrl: string) => {
    setLoadingDownload(true);
    try {
      const response = await fetch(imgUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "download";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error("Failed to download image");
    } finally {
      setLoadingDownload(false);
    }
  };

  const handleCopy = async (imgUrl: string) => {
    setLoadingCopy(true);
    try {
      // Try to copy the image itself (as a blob)
      const response = await fetch(imgUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new window.ClipboardItem({ [blob.type]: blob }),
      ]);
      toast.success(
        "The image has been copied to your clipboard. You can simply paste it into an email or WhatsApp message."
      );
    } catch (error) {
      __clog(error);
      await navigator.clipboard.writeText(imgUrl);
      toast.success("Image URL copied to clipboard");
    } finally {
      setLoadingCopy(false);
    }
  };

  return (
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex gap-2">
      {imageUrlToDownload && (
        <Button
          onClick={() => handleDownload(imageUrlToDownload)}
          size="xs"
          variant="outline"
          type="button"
          disabled={loadingDownload}
        >
          {loadingDownload ? <LoadingCircle /> : <Download size={18} />}
        </Button>
      )}
      {imageUrlToCopy && (
        <Button
          onClick={() => handleCopy(imageUrlToCopy)}
          size="xs"
          variant="outline"
          type="button"
          disabled={loadingCopy}
        >
          {loadingCopy ? <LoadingCircle /> : <Copy size={18} />}
        </Button>
      )}
    </div>
  );
}
