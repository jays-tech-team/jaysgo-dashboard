import ComponentCard from "../../../components/common/ComponentCard";
import Button from "../../../components/ui/button/Button";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";

export default function CompanySettings() {
    return (
        <div className="space-y-6">
            <ComponentCard title="General Settings" desc="Update company name and operational status.">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label>Display Name</Label>
                        <Input value="Logistics Express" onChange={() => { }} />
                    </div>
                    <div>
                        <Label>Notification Email</Label>
                        <Input value="ops@logistic-express.ae" onChange={() => { }} />
                    </div>
                </div>
                <div className="mt-8 flex justify-end">
                    <Button>Save Settings</Button>
                </div>
            </ComponentCard>

            <ComponentCard title="Operational Controls" desc="Manage service areas and active window.">
                <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <div>
                            <p className="font-bold text-gray-900 dark:text-white">Accepting Orders</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Temporarily stop receiving new orders from superadmin.</p>
                        </div>
                        <div className="relative inline-flex items-center cursor-pointer">
                            <div className="w-11 h-6 bg-brand-600 rounded-full"></div>
                            <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform translate-x-5"></div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <div>
                            <p className="font-bold text-gray-900 dark:text-white">Auto-Assignment</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Automatically assign orders to available company drivers.</p>
                        </div>
                        <div className="relative inline-flex items-center cursor-pointer">
                            <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                            <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform"></div>
                        </div>
                    </div>
                </div>
            </ComponentCard>
        </div>
    );
}
