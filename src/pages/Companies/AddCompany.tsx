import { useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import CompanyEditForm from "./CompanyEditForm";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export default function AddCompany() {
    const navigate = useNavigate();

    const handleSubmit = () => {
        // Submit data to API in future
        toast.success("Company registered successfully!");
        navigate("/admin/companies");
    };

    const handleCancel = () => {
        navigate("/admin/companies");
    };

    return (
        <>
            <PageMeta
                title="Add New Company"
                description="Register a new delivery partner company."
            />
            <div className="mb-10">
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleCancel}
                        className="group flex items-center justify-center size-10 text-gray-400 hover:text-brand-500 hover:border-brand-200 transition-all border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900 shadow-sm hover:shadow-md"
                        title="Back to Companies"
                    >
                        <ArrowLeft className="size-5 group-hover:-translate-x-0.5 transition-transform" />
                    </button>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                            Add New Delivery Company
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">
                            Register a new external delivery partner to your network
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl">
                <ComponentCard>
                    <CompanyEditForm
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                    />
                </ComponentCard>
            </div>
        </>
    );
}
