import React, { useState } from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import { FileText, Download, Eye, Image, FileBadge, ScrollText, CreditCard, ShieldCheck, FileCheck, Upload } from "lucide-react";
import { Modal } from "../../../components/ui/modal";
import { publicPath } from "../../../lib/utils";

interface DocumentItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  status: "verified" | "pending" | "missing";
  lastUpdated?: string;
  previewUrl?: string;
}

const documentItems: DocumentItem[] = [
  { id: "logo", name: "Company Logo", icon: <Image className="size-6" />, status: "verified", lastUpdated: "2024-03-01", previewUrl: publicPath("/images/documents/company_logo.png") },
  { id: "eid-front", name: "Emirates ID - Front", icon: <CreditCard className="size-6" />, status: "verified", lastUpdated: "2024-02-15", previewUrl: publicPath("/images/documents/emirates_id_front.png") },
  { id: "eid-back", name: "Emirates ID - Back", icon: <CreditCard className="size-6" />, status: "verified", lastUpdated: "2024-02-15", previewUrl: publicPath("/images/documents/emirates_id_back.png") },
  { id: "passport", name: "Passport Copy", icon: <FileBadge className="size-6" />, status: "verified", lastUpdated: "2024-02-15", previewUrl: publicPath("/images/documents/passport.png") },
  { id: "address", name: "Company Address Proof", icon: <ShieldCheck className="size-6" />, status: "verified", lastUpdated: "2024-03-10", previewUrl: publicPath("/images/documents/address_proof.png") },
  { id: "license", name: "Trade License", icon: <FileCheck className="size-6" />, status: "verified", lastUpdated: "2024-01-20", previewUrl: publicPath("/images/documents/trade_license.png") },
  { id: "vat", name: "VAT Certificate", icon: <ScrollText className="size-6" />, status: "verified", lastUpdated: "2024-01-20", previewUrl: publicPath("/images/documents/vat_certificate.png") },
  { id: "trn", name: "TRN Number", icon: <FileText className="size-6" />, status: "missing" },
  { id: "moa", name: "MOA (Memorandum of Association)", icon: <ScrollText className="size-6" />, status: "verified", lastUpdated: "2024-01-15", previewUrl: publicPath("/images/documents/moa.png") },
  { id: "sla", name: "SLA Document", icon: <FileText className="size-6" />, status: "missing" },
];

const DocCard: React.FC<{ doc: DocumentItem; onView: (doc: DocumentItem) => void; onUpload: (doc: DocumentItem) => void }> = ({ doc, onView, onUpload }) => {
  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 bg-white dark:bg-gray-900 group hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-xl bg-brand-50 dark:bg-brand-500/10 text-brand-500">
          {doc.icon}
        </div>
        <div className="flex items-center gap-2">
          {doc.status !== "missing" && (
            <>
              <button
                onClick={() => onView(doc)}
                className="p-2 text-gray-400 hover:text-brand-500 dark:text-gray-500 dark:hover:text-brand-400 transition-colors"
              >
                <Eye className="size-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-brand-500 dark:text-gray-500 dark:hover:text-brand-400 transition-colors">
                <Download className="size-5" />
              </button>
            </>
          )}
          {doc.status === "missing" && (
            <button
              onClick={() => onUpload(doc)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
            >
              <Upload className="size-4" /> Add
            </button>
          )}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-1">{doc.name}</h3>
        <div className="flex items-center justify-between mt-4">
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${doc.status === "verified"
            ? "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400"
            : doc.status === "pending"
              ? "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
              : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
            }`}>
            {doc.status === "missing" ? "Not Added" : doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
          </span>
          {doc.lastUpdated && (
            <span className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold">
              Updated: {doc.lastUpdated}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default function CompanyDocuments() {
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleView = (doc: DocumentItem) => {
    setSelectedDoc(doc);
    setIsModalOpen(true);
  };

  const handleUpload = () => {
    // Standard upload logic
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedDoc(null);
  };

  return (
    <>
      <ComponentCard
        title="Company Documents"
        desc="Access all legal and operational documents for this company."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {documentItems.map((doc) => (
            <DocCard
              key={doc.id}
              doc={doc}
              onView={handleView}
              onUpload={handleUpload}
            />
          ))}
        </div>
      </ComponentCard>

      <Modal
        isOpen={isModalOpen}
        onClose={handleClose}
        size="sm"
        title={selectedDoc?.name || "Document View"}
      >
        <div className="flex flex-col items-center justify-center p-4">
          {selectedDoc?.previewUrl ? (
            <img
              src={selectedDoc.previewUrl}
              alt={selectedDoc.name}
              className="max-w-full rounded-xl shadow-lg"
            />
          ) : (
            <div className="w-full h-80 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
              <FileText className="size-16 text-gray-300 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 font-medium tracking-tight">Preview not available.</p>
              <button className="mt-6 flex items-center gap-2 px-6 py-3 bg-brand-500 text-white rounded-xl font-bold hover:bg-brand-600 transition-colors shadow-lg shadow-brand-500/20">
                <Download className="size-5" /> Download to View
              </button>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
