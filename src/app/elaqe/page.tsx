"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/ui/PageHeader";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  MessageCircle,
  CheckCircle,
  Send,
  FileText,
} from "lucide-react";

interface Branch {
  _id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  mapUrl: string;
  displayOrder: number;
  isActive: boolean;
}

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const res = await fetch("/api/branches");
      const data = await res.json();
      if (data.success) {
        setBranches(data.data);
      }
    } catch (error) {
      console.error("Filiallar alınmadı:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", message: "" });
    }, 5000);
  };

  return (
    <>
      <PageHeader
        title="Əlaqə"
        description="Bizimlə əlaqə saxlayın və suallarınızı verin"
      />

      <Section>
        {/* Filiallar */}
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-2 border-brand-red border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-gray-500 mt-2">Filiallar yüklənir...</p>
          </div>
        ) : branches.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Filial tapılmadı</div>
        ) : (
          <div className="space-y-8 mb-12">
            {branches.map((branch) => (
              <Card key={branch._id} className="p-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Sol tərəf - Məlumat */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-dark">
                      "{branch.name}" filialı
                    </h3>

                    <div className="space-y-3">
                      {branch.phone && (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                            <Phone className="w-5 h-5 text-brand-red" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Telefon</p>
                            <p className="font-medium text-gray-900">
                              {branch.phone}
                            </p>
                          </div>
                        </div>
                      )}

                      {branch.email && (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                            <Mail className="w-5 h-5 text-brand-red" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              Elektron poçt
                            </p>
                            <p className="font-medium text-gray-900">
                              {branch.email}
                            </p>
                          </div>
                        </div>
                      )}

                      {branch.address && (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-brand-red" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Ünvan</p>
                            <p className="font-medium text-gray-900">
                              {branch.address}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Sağ tərəf - Xəritə */}
                  {branch.mapUrl ? (
                    <div className="h-64 lg:h-auto rounded-xl overflow-hidden bg-gray-100">
                      <iframe
                        src={branch.mapUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen={false}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="h-64 lg:h-auto rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
                      <MapPin className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Əlaqə Formu */}
        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          <div>
            <h2 className="text-2xl font-bold text-gray-dark mb-6">
              Mesaj göndərin
            </h2>

            <Card className="p-6">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <CheckCircle className="text-green-600" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-dark mb-2">
                    Mesajınız göndərildi!
                  </h3>
                  <p className="text-gray-medium">
                    Tezliklə sizinlə əlaqə saxlanılacaq.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input
                    label="Ad Soyad"
                    placeholder="Adınız və soyadınız"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />

                  <Input
                    label="E-mail"
                    type="email"
                    placeholder="email@example.com"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />

                  <Textarea
                    label="Mesaj"
                    placeholder="Mesajınızı buraya yazın..."
                    rows={6}
                    required
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                  />

                  <Button type="submit" size="lg" className="w-full">
                    <Send className="w-5 h-5 mr-2" />
                    Göndər
                  </Button>
                </form>
              )}
            </Card>
          </div>

          {/* Digər əlaqə vasitələri */}
          <div>
            <h2 className="text-2xl font-bold text-gray-dark mb-6">
              Digər əlaqə vasitələri
            </h2>

            <div className="space-y-4">
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                    <Globe className="w-6 h-6 text-brand-red" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-dark mb-1">
                      Vebsayt
                    </h3>
                    <a
                      href="https://www.azeri.edu.az"
                      className="text-brand-red hover:underline"
                    >
                      www.azeri.edu.az
                    </a>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-dark mb-1">
                      WhatsApp
                    </h3>
                    <a
                      href="https://wa.me/994554440662"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:underline font-medium"
                    >
                      +994 55 444 06 62
                    </a>
                    <p className="text-sm text-gray-500 mt-1">
                      Bizimlə WhatsApp üzərindən əlaqə saxlayın
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
