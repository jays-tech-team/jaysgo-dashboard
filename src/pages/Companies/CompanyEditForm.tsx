import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Form from "../../components/form/Form";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import Button from "../../components/ui/button/Button";
import Select from "../../components/form/Select";
import FileInput from "../../components/form/input/FileInput";
import { Camera, Building2, ChevronDown, Award, FileText } from "lucide-react";
import { useEffect, useState } from "react";

const cityOptions = [
    { value: "Dubai", label: "Dubai" },
    { value: "Abu Dhabi", label: "Abu Dhabi" },
    { value: "Sharjah", label: "Sharjah" },
    { value: "Ajman", label: "Ajman" },
    { value: "Umm Al Quwain", label: "Umm Al Quwain" },
    { value: "Ras Al Khaimah", label: "Ras Al Khaimah" },
    { value: "Fujairah", label: "Fujairah" },
];

const schema = z.object({
    companyName: z.string().min(1, "Company name is required"),
    tradeLicenseNo: z.string().min(1, "Trade license number is required"),
    trnNo: z.string().min(1, "TRN number is required"),
    contactFirstName: z.string().min(1, "Contact first name is required"),
    contactLastName: z.string().min(1, "Contact last name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(1, "Phone number is required"),
    whatsapp: z.string().min(1, "WhatsApp number is required"),
    city: z.string().min(1, "City is required"),
    address: z.string().min(1, "Full address is required"),
});

export type CompanyFormValues = z.infer<typeof schema>;

export default function CompanyEditForm({
    defaultValues,
    onSubmit: onSubmitProp,
    onCancel,
}: {
    defaultValues?: Partial<CompanyFormValues>;
    onSubmit?: (data: CompanyFormValues) => void;
    onCancel?: () => void;
}) {
    const [whatsappSameAsPhone, setWhatsappSameAsPhone] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<CompanyFormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            companyName: defaultValues?.companyName || "",
            tradeLicenseNo: defaultValues?.tradeLicenseNo || "",
            trnNo: defaultValues?.trnNo || "",
            contactFirstName: defaultValues?.contactFirstName || "",
            contactLastName: defaultValues?.contactLastName || "",
            email: defaultValues?.email || "",
            phone: defaultValues?.phone || "",
            whatsapp: defaultValues?.whatsapp || "",
            city: defaultValues?.city || "",
            address: defaultValues?.address || "",
        },
    });

    const phoneNumber = watch("phone");

    useEffect(() => {
        if (whatsappSameAsPhone) {
            setValue("whatsapp", phoneNumber);
        }
    }, [phoneNumber, whatsappSameAsPhone, setValue]);

    const onSubmit = (data: CompanyFormValues) => {
        if (onSubmitProp) onSubmitProp(data);
    };

    return (
        <Form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8"
        >
            <div className="space-y-6">
                <div className="text-center md:text-left mb-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Company Information</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">Please input company details</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                    <div>
                        <Label htmlFor="companyName">Company Name *</Label>
                        <Input
                            id="companyName"
                            type="text"
                            placeholder="Company Name"
                            register={register("companyName")}
                            error={!!errors.companyName}
                            hint={errors.companyName?.message}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="tradeLicenseNo">Trade License No *</Label>
                        <Input
                            id="tradeLicenseNo"
                            type="text"
                            placeholder="Trade License Number"
                            register={register("tradeLicenseNo")}
                            error={!!errors.tradeLicenseNo}
                            hint={errors.tradeLicenseNo?.message}
                        />
                    </div>
                    <div>
                        <Label htmlFor="trnNo">Tax Registration Number (TRN) *</Label>
                        <Input
                            id="trnNo"
                            type="text"
                            placeholder="TRN Number"
                            register={register("trnNo")}
                            error={!!errors.trnNo}
                            hint={errors.trnNo?.message}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="contactFirstName">Contact First Name *</Label>
                        <Input
                            id="contactFirstName"
                            type="text"
                            placeholder="First Name"
                            register={register("contactFirstName")}
                            error={!!errors.contactFirstName}
                            hint={errors.contactFirstName?.message}
                        />
                    </div>
                    <div>
                        <Label htmlFor="contactLastName">Contact Last Name *</Label>
                        <Input
                            id="contactLastName"
                            type="text"
                            placeholder="Last Name"
                            register={register("contactLastName")}
                            error={!!errors.contactLastName}
                            hint={errors.contactLastName?.message}
                        />
                    </div>
                </div>

                <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="Email Address"
                        register={register("email")}
                        error={!!errors.email}
                        hint={errors.email?.message}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <div className="relative">
                            <div className="absolute left-0 top-0 h-11 flex items-center pl-4 pr-3 border-r border-gray-200 dark:border-gray-700 pointer-events-none z-10 bg-gray-50/50 dark:bg-gray-800/50 rounded-l-xl">
                                <span className="text-lg mr-2">🇦🇪</span>
                                <span className="text-gray-500 text-xs font-semibold">+971</span>
                                <ChevronDown className="size-3 ml-1 text-gray-400" />
                            </div>
                            <Input
                                id="phone"
                                type="text"
                                className="pl-24 h-11 rounded-xl border-gray-200 focus:border-brand-500 focus:ring-brand-500"
                                placeholder="50 000 0000"
                                register={register("phone")}
                                error={!!errors.phone}
                            />
                        </div>
                        {errors.phone && <p className="mt-1.5 text-xs text-error-500 ml-1">{errors.phone.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="whatsapp">WhatsApp Number *</Label>
                        <div className="relative">
                            <div className="absolute left-0 top-0 h-11 flex items-center pl-4 pr-3 border-r border-gray-200 dark:border-gray-700 pointer-events-none z-10 bg-gray-50/50 dark:bg-gray-800/50 rounded-l-xl">
                                <span className="text-lg mr-2">🇦🇪</span>
                                <span className="text-gray-500 text-xs font-semibold">+971</span>
                                <ChevronDown className="size-3 ml-1 text-gray-400" />
                            </div>
                            <Input
                                id="whatsapp"
                                type="text"
                                className="pl-24 h-11 rounded-xl border-gray-200 focus:border-brand-500 focus:ring-brand-500"
                                placeholder="50 000 0000"
                                register={register("whatsapp")}
                                error={!!errors.whatsapp}
                                disabled={whatsappSameAsPhone}
                            />
                        </div>
                        {errors.whatsapp && <p className="mt-1.5 text-xs text-error-500 ml-1">{errors.whatsapp.message}</p>}
                        <div className="mt-3 flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="sameAsPhone"
                                className="size-5 rounded-lg border-gray-300 text-brand-500 focus:ring-brand-500 cursor-pointer transition-all"
                                checked={whatsappSameAsPhone}
                                onChange={(e) => setWhatsappSameAsPhone(e.target.checked)}
                            />
                            <label htmlFor="sameAsPhone" className="text-sm font-medium text-gray-500 dark:text-gray-400 cursor-pointer">
                                Same as above phone number
                            </label>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                    <div>
                        <Label htmlFor="city">Select City *</Label>
                        <Select
                            id="city"
                            options={cityOptions}
                            placeholder="Select City"
                            register={register("city")}
                            className={`h-11 rounded-xl ${errors.city ? "border-error-500" : "border-gray-200"}`}
                        />
                        {errors.city && <p className="text-xs text-error-500 mt-1.5 ml-1">{errors.city.message}</p>}
                    </div>
                </div>

                <div>
                    <Label htmlFor="address">Full Address *</Label>
                    <textarea
                        {...register("address")}
                        id="address"
                        className={`w-full rounded-xl border p-4 shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 ${errors.address ? "border-error-500 focus:border-error-300 focus:ring-error-500/20" : "border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700"}`}
                        rows={3}
                        placeholder="Enter full building and office address"
                    />
                    {errors.address && <p className="text-xs text-error-500 mt-1.5 ml-1">{errors.address.message}</p>}
                </div>
            </div>

            {/* Documents Section */}
            <div className="space-y-8 pt-10 border-t-2 border-gray-100 dark:border-gray-800">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">Documents</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 font-medium">
                        Upload required legal documents for company verification.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                    <div className="group">
                        <Label className="flex items-center gap-2.5 mb-3 font-bold text-gray-700 dark:text-gray-200">
                            <div className="p-2 rounded-lg bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400">
                                <Camera className="size-5" />
                            </div>
                            Company Logo
                        </Label>
                        <div className="relative">
                            <FileInput className="h-40 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-brand-400 dark:hover:border-brand-500 transition-all bg-gray-50/30 dark:bg-gray-800/20 group-hover:bg-brand-50/10" />
                            <div className="absolute inset-x-0 bottom-4 text-center pointer-events-none">
                                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Max 2MB • JPG, PNG</p>
                            </div>
                        </div>
                    </div>

                    <div className="group">
                        <Label className="flex items-center gap-2.5 mb-3 font-bold text-gray-700 dark:text-gray-200">
                            <div className="p-2 rounded-lg bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400">
                                <Building2 className="size-5" />
                            </div>
                            Trade License
                        </Label>
                        <div className="relative">
                            <FileInput className="h-40 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-brand-400 dark:hover:border-brand-500 transition-all bg-gray-50/30 dark:bg-gray-800/20 group-hover:bg-brand-50/10" />
                            <div className="absolute inset-x-0 bottom-4 text-center pointer-events-none">
                                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">PDF, JPG or PNG</p>
                            </div>
                        </div>
                    </div>

                    <div className="group">
                        <Label className="flex items-center gap-2.5 mb-3 font-bold text-gray-700 dark:text-gray-200">
                            <div className="p-2 rounded-lg bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400">
                                <Award className="size-5" />
                            </div>
                            VAT Certificate
                        </Label>
                        <div className="relative">
                            <FileInput className="h-40 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-brand-400 dark:hover:border-brand-500 transition-all bg-gray-50/30 dark:bg-gray-800/20 group-hover:bg-brand-50/10" />
                            <div className="absolute inset-x-0 bottom-4 text-center pointer-events-none">
                                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">PDF, JPG or PNG</p>
                            </div>
                        </div>
                    </div>

                    <div className="group">
                        <Label className="flex items-center gap-2.5 mb-3 font-bold text-gray-700 dark:text-gray-200">
                            <div className="p-2 rounded-lg bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400">
                                <FileText className="size-5" />
                            </div>
                            TRN Document
                        </Label>
                        <div className="relative">
                            <FileInput className="h-40 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-brand-400 dark:hover:border-brand-500 transition-all bg-gray-50/30 dark:bg-gray-800/20 group-hover:bg-brand-50/10" />
                            <div className="absolute inset-x-0 bottom-4 text-center pointer-events-none">
                                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">PDF, JPG or PNG</p>
                            </div>
                        </div>
                    </div>

                    <div className="group">
                        <Label className="flex items-center gap-2.5 mb-3 font-bold text-gray-700 dark:text-gray-200">
                            <div className="p-2 rounded-lg bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400">
                                <FileText className="size-5" />
                            </div>
                            Emirates ID
                        </Label>
                        <div className="relative">
                            <FileInput className="h-40 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-brand-400 dark:hover:border-brand-500 transition-all bg-gray-50/30 dark:bg-gray-800/20 group-hover:bg-brand-50/10" />
                            <div className="absolute inset-x-0 bottom-4 text-center pointer-events-none">
                                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Front and back copy</p>
                            </div>
                        </div>
                    </div>

                    <div className="group">
                        <Label className="flex items-center gap-2.5 mb-3 font-bold text-gray-700 dark:text-gray-200">
                            <div className="p-2 rounded-lg bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400">
                                <FileText className="size-5" />
                            </div>
                            Passport Copy
                        </Label>
                        <div className="relative">
                            <FileInput className="h-40 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-brand-400 dark:hover:border-brand-500 transition-all bg-gray-50/30 dark:bg-gray-800/20 group-hover:bg-brand-50/10" />
                            <div className="absolute inset-x-0 bottom-4 text-center pointer-events-none">
                                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Passport bio page</p>
                            </div>
                        </div>
                    </div>

                    <div className="group">
                        <Label className="flex items-center gap-2.5 mb-3 font-bold text-gray-700 dark:text-gray-200">
                            <div className="p-2 rounded-lg bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400">
                                <Building2 className="size-5" />
                            </div>
                            Company Address Proof
                        </Label>
                        <div className="relative">
                            <FileInput className="h-40 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-brand-400 dark:hover:border-brand-500 transition-all bg-gray-50/30 dark:bg-gray-800/20 group-hover:bg-brand-50/10" />
                            <div className="absolute inset-x-0 bottom-4 text-center pointer-events-none">
                                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Ejari or Utility Bill</p>
                            </div>
                        </div>
                    </div>

                    <div className="group">
                        <Label className="flex items-center gap-2.5 mb-3 font-bold text-gray-700 dark:text-gray-200">
                            <div className="p-2 rounded-lg bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400">
                                <Award className="size-5" />
                            </div>
                            MOA (Memorandum of Association)
                        </Label>
                        <div className="relative">
                            <FileInput className="h-40 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-brand-400 dark:hover:border-brand-500 transition-all bg-gray-50/30 dark:bg-gray-800/20 group-hover:bg-brand-50/10" />
                            <div className="absolute inset-x-0 bottom-4 text-center pointer-events-none">
                                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Official MOA document</p>
                            </div>
                        </div>
                    </div>

                    <div className="group">
                        <Label className="flex items-center gap-2.5 mb-3 font-bold text-gray-700 dark:text-gray-200">
                            <div className="p-2 rounded-lg bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400">
                                <FileText className="size-5" />
                            </div>
                            SLA Document
                        </Label>
                        <div className="relative">
                            <FileInput className="h-40 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-brand-400 dark:hover:border-brand-500 transition-all bg-gray-50/30 dark:bg-gray-800/20 group-hover:bg-brand-50/10" />
                            <div className="absolute inset-x-0 bottom-4 text-center pointer-events-none">
                                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Service Level Agreement</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-10 flex flex-col md:flex-row items-center justify-end gap-3">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    className="w-full md:w-32 h-11 text-base font-medium rounded-xl border-gray-200 dark:border-gray-700"
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full md:w-64 h-11 text-base font-bold bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-lg shadow-brand-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Processing...
                        </>
                    ) : (
                        "Save Company"
                    )}
                </Button>
            </div>
        </Form>
    );
}
