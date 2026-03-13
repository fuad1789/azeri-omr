"use client";

import { useState, useEffect, useRef } from "react";
import PageHeader from "@/components/ui/PageHeader";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import {
  CheckCircle,
  Calendar,
  Clock,
  Users,
  Phone,
  Mail,
  MapPin,
  Loader2,
  AlertCircle,
  Upload,
  X,
  Image as ImageIcon,
  MessageCircle,
  FileText,
} from "lucide-react";
import Link from "next/link";

interface ExamType {
  _id: string;
  name: string;
  description: string;
  price?: number;
  isActive: boolean;
}

interface Branch {
  _id: string;
  name: string;
  address: string;
  phone: string;
  isActive: boolean;
}

export default function ExamRegistrationPage() {
  const [examTypes, setExamTypes] = useState<ExamType[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loadingExamTypes, setLoadingExamTypes] = useState(true);
  const [loadingBranches, setLoadingBranches] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    examType: "",
    location: "",
    message: "",
    paymentMethod: "whatsapp" as "whatsapp" | "check",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [checkImage, setCheckImage] = useState<File | null>(null);
  const [checkImagePreview, setCheckImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchExamTypes();
    fetchBranches();
  }, []);

  const fetchExamTypes = async () => {
    try {
      setLoadingExamTypes(true);
      const res = await fetch("/api/exam-types");
      const data = await res.json();
      if (data.success) {
        setExamTypes(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch exam types:", err);
    } finally {
      setLoadingExamTypes(false);
    }
  };

  const fetchBranches = async () => {
    try {
      setLoadingBranches(true);
      const res = await fetch("/api/branches");
      const data = await res.json();
      if (data.success) {
        setBranches(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch branches:", err);
    } finally {
      setLoadingBranches(false);
    }
  };

  const examTypeOptions = [
    { value: "", label: "İmtahan növünü seçin" },
    ...examTypes.map((t) => ({ value: t.name, label: t.name })),
  ];

  const locationOptions = [
    { value: "", label: "Filial seçin" },
    ...branches.map((b) => ({ value: b.name, label: b.name })),
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log("Selected file:", file);
    if (file) {
      // Fayl ölçüsünü yoxla (maksimum 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setSubmitError("Şəkil ölçüsü 5MB-dan böyük ola bilməz");
        return;
      }
      
      // FileReader ilə base64 yaradaq (daha etibarlı)
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        console.log("FileReader result:", result);
        setCheckImage(file);
        setCheckImagePreview(result);
      };
      reader.onerror = (err) => {
        console.error("FileReader error:", err);
        setSubmitError("Şəkil oxunarkən xəta baş verdi");
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setCheckImage(null);
    setCheckImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // FormData yarat
      const formDataToSend = new FormData();
      formDataToSend.append("fullName", formData.fullName);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("email", formData.email || "");
      formDataToSend.append("examType", formData.examType);
      formDataToSend.append("location", formData.location);
      formDataToSend.append("message", formData.message || "");
      formDataToSend.append("paymentMethod", formData.paymentMethod);

      // Əgər çək seçilibsə, şəkili əlavə et
      if (formData.paymentMethod === "check") {
        if (!checkImage) {
          setSubmitError("Zəhmət olmasa, çək şəkli yükləyin");
          setIsSubmitting(false);
          return;
        }
        formDataToSend.append("checkImages", checkImage);
      }

      const res = await fetch("/api/exam-registrations", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await res.json();

      if (data.success) {
        setIsSubmitting(false);
        setSubmitted(true);
      } else {
        setSubmitError(data.error || "Qeydiyyat zamanı xəta baş verdi");
        setIsSubmitting(false);
      }
    } catch (err) {
      setSubmitError(
        "Server xətası baş verdi. Zəhmət olmasa yenidən cəhd edin."
      );
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <>
        <PageHeader
          title="Sınaq imtahanına qeydiyyat"
          description="Qeydiyyatınız uğurla tamamlandı"
        />
        <Section>
          <Card className="max-w-2xl mx-auto p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-green-600" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-dark mb-4">
              Təbriklər!
            </h2>
            <p className="text-gray-medium mb-6">
              Sınaq imtahanına qeydiyyatınız uğurla tamamlandı. Qısa müddətdə
              operatorumuz sizinlə əlaqə saxlayacaq.
            </p>
            {formData.paymentMethod === "whatsapp" ? (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                <p className="text-sm text-green-700 mb-3">
                  Ödənişi WhatsApp vasitəsilə təsdiqləmək üçün aşağıdakı nömrəyə yazın:
                </p>
                <a 
                  href="https://wa.me/994123456789" 
                  target="_blank"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp ilə əlaqə
                </a>
              </div>
            ) : (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <p className="text-sm text-blue-700">
                  Çək şəkilləriniz qəbul edildi. Operatorumuz təsdiqləndikdən sonra sizinlə əlaqə saxlayacaq.
                </p>
              </div>
            )}
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/">
                <Button>Ana səhifə</Button>
              </Link>
              <a href="tel:+994123456789">
                <Button variant="outline">Zəng et</Button>
              </a>
            </div>
          </Card>
        </Section>
      </>
    );
  }

  // Seçilmiş imtahan növünün qiymətini tap
  const selectedExamType = examTypes.find(t => t.name === formData.examType);
  const examPrice = selectedExamType?.price || 0;

  return (
    <>
      <PageHeader
        title="Sınaq imtahanına qeydiyyat"
        description="Sınaq imtahanına qeydiyyatdan keçin və özünüzü yoxlayın"
      />

      <Section>
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Məlumat kartları */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="text-purple-600" size={24} />
                <h3 className="font-bold text-gray-dark">İmtahan tarixləri</h3>
              </div>
              <p className="text-sm text-gray-medium">
                Hər həftə sonu (Şənbə və Bazar) saat 11:00-da
              </p>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="text-blue-600" size={24} />
                <h3 className="font-bold text-gray-dark">Müddət</h3>
              </div>
              <p className="text-sm text-gray-medium">
                İmtahan müddəti 3 saatdır (180 dəqiqə)
              </p>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <div className="flex items-center gap-3 mb-3">
                <Users className="text-green-600" size={24} />
                <h3 className="font-bold text-gray-dark">Qrup ölçüsü</h3>
              </div>
              <p className="text-sm text-gray-medium">
                Kiçik qruplar (maksimum 15 nəfər)
              </p>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <div className="flex items-center gap-3 mb-3">
                <MapPin className="text-orange-600" size={24} />
                <h3 className="font-bold text-gray-dark">Filiallar</h3>
              </div>
              <p className="text-sm text-gray-medium">
                {branches.length} filial üzrə seçim imkanı
              </p>
            </Card>

            {examPrice > 0 && (
              <Card className="p-6 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                <div className="flex items-center gap-3 mb-3">
                  <FileText className="text-red-600" size={24} />
                  <h3 className="font-bold text-gray-dark">Ödəniş</h3>
                </div>
                <p className="text-sm text-gray-medium">
                  İmtahan ödənişi: <span className="font-bold text-red-600">{examPrice} AZN</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  (Bir dəfəlik ödəniş)
                </p>
              </Card>
            )}
          </div>

          {/* Qeydiyyat forması */}
          <div className="lg:col-span-2">
            <Card className="p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-dark mb-6">
                Qeydiyyat forması
              </h3>

              {submitError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {submitError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    label="Ad və Soyad"
                    placeholder="Adınızı və soyadınızı daxil edin"
                    value={formData.fullName}
                    onChange={(e: any) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    required
                  />
                  <Input
                    label="Telefon nömrəsi"
                    placeholder="+994 50 123 45 67"
                    value={formData.phone}
                    onChange={(e: any) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    required
                  />
                </div>

                <Input
                  label="E-poçt"
                  type="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={(e: any) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Select
                      label="İmtahan növü"
                      options={loadingExamTypes ? [{ value: "", label: "Yüklənir..." }] : examTypeOptions}
                      value={formData.examType}
                      onChange={(e: any) =>
                        setFormData({ ...formData, examType: e.target.value })
                      }
                      required
                      disabled={loadingExamTypes}
                    />
                    {selectedExamType && selectedExamType.price && selectedExamType.price > 0 && (
                      <div className="mt-2 flex items-center gap-2 text-sm">
                        <span className="font-medium text-green-600">{selectedExamType.price} AZN</span>
                        <span className="text-gray-500">(Bir dəfəlik ödəniş)</span>
                      </div>
                    )}
                  </div>
                  <Select
                    label="Filial"
                    options={loadingBranches ? [{ value: "", label: "Yüklənir..." }] : locationOptions}
                    value={formData.location}
                    onChange={(e: any) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    required
                    disabled={loadingBranches}
                  />
                </div>

                {/* Ödəniş üsulu */}
                <div>
                  <label className="block text-sm font-medium text-gray-dark mb-3">
                    Ödəniş üsulu *
                  </label>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <label
                      className={`relative flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        formData.paymentMethod === "whatsapp"
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="whatsapp"
                        checked={formData.paymentMethod === "whatsapp"}
                        onChange={(e) =>
                          setFormData({ ...formData, paymentMethod: e.target.value as "whatsapp" | "check" })
                        }
                        className="w-4 h-4 text-green-600"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <MessageCircle className="w-5 h-5 text-green-600" />
                          <span className="font-medium text-gray-dark">WhatsApp</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Ödənişi WhatsApp ilə təsdiqlə
                        </p>
                      </div>
                    </label>

                    <label
                      className={`relative flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        formData.paymentMethod === "check"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="check"
                        checked={formData.paymentMethod === "check"}
                        onChange={(e) =>
                          setFormData({ ...formData, paymentMethod: e.target.value as "whatsapp" | "check" })
                        }
                        className="w-4 h-4 text-blue-600"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <span className="font-medium text-gray-dark">Çək</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Çək şəkli yüklə
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Çək şəkli yükləmə */}
                {formData.paymentMethod === "check" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-dark mb-2">
                      Çək şəkli *
                    </label>
                    
                    {/* Şəkil preview */}
                    {checkImagePreview ? (
                      <div className="relative">
                        <div className="relative rounded-xl overflow-hidden border-2 border-blue-500 bg-gray-50 flex items-center justify-center min-h-[200px]">
                          <img
                            src={checkImagePreview}
                            alt="Çək preview"
                            className="max-w-full max-h-48 object-contain"
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg z-10"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 text-center">
                          Fayl: {checkImage?.name}
                        </p>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
                      >
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          Şəkil yükləmək üçün bura klikləyin
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          JPG, PNG (Maksimum 5MB)
                        </p>
                      </div>
                    )}
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      capture="environment"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-dark mb-2">
                    Əlavə qeydləriniz (istəyə bağlı)
                  </label>
                  <textarea
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-transparent resize-none"
                    rows={4}
                    placeholder="Suallarınız və ya xüsusi tələbləriniz..."
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full py-4 text-lg"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 animate-spin" size={20} />
                      Göndərilir...
                    </>
                  ) : (
                    "Qeydiyyatdan keç"
                  )}
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-sm text-gray-500 text-center">
                  və ya{" "}
                  <a
                    href="tel:+994123456789"
                    className="text-brand-red font-medium hover:underline"
                  >
                    +994 12 345 67 89
                  </a>{" "}
                  nömrəsi ilə əlaqə saxlayın
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Əlavə məlumat */}
        <div className="mt-12 grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-brand-red/10 flex items-center justify-center mx-auto mb-4">
              <Phone className="text-brand-red" size={28} />
            </div>
            <h4 className="font-bold text-gray-dark mb-2">Bizimlə əlaqə</h4>
            <p className="text-sm text-gray-medium">
              Suallarınız üçün hər gün 09:00-18:00
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-brand-red/10 flex items-center justify-center mx-auto mb-4">
              <Mail className="text-brand-red" size={28} />
            </div>
            <h4 className="font-bold text-gray-dark mb-2">E-poçt</h4>
            <p className="text-sm text-gray-medium">info@azerikurslari.com</p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-brand-red/10 flex items-center justify-center mx-auto mb-4">
              <MapPin className="text-brand-red" size={28} />
            </div>
            <h4 className="font-bold text-gray-dark mb-2">Mərkəzi ofis</h4>
            <p className="text-sm text-gray-medium">
              Bakı şəhəri, Nizami küçəsi 123
            </p>
          </Card>
        </div>
      </Section>
    </>
  );
}