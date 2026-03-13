"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Search,
  Filter,
  Tag,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Phone,
  Mail,
  MapPin,
  BookOpen,
  Download,
  RefreshCw,
  AlertCircle,
  Plus,
  Edit,
  ChevronLeft,
  ChevronRight,
  Building,
  MessageCircle,
  FileText,
  Image as ImageIcon,
  Eye,
  SortAsc,
  SortDesc,
  X,
  ChevronDown,
  ZoomIn,
} from "lucide-react";
import Link from "next/link";

interface Registration {
  _id: string;
  fullName: string;
  phone: string;
  email?: string;
  examType: string;
  location: string;
  message?: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  paymentMethod?: "whatsapp" | "check";
  checkImages?: string[];
  createdAt: string;
  updatedAt: string;
}

interface ExamType {
  _id: string;
  name: string;
  description: string;
  price?: number;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
}

interface Branch {
  _id: string;
  name: string;
  address: string;
  phone: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}

const statusConfig = {
  pending: {
    label: "Gözləyir",
    color: "bg-amber-100 text-amber-700 border-amber-200",
    icon: Clock,
  },
  confirmed: {
    label: "Təsdiqləndi",
    color: "bg-green-100 text-green-700 border-green-200",
    icon: CheckCircle,
  },
  cancelled: {
    label: "Ləğv edildi",
    color: "bg-red-100 text-red-700 border-red-200",
    icon: XCircle,
  },
  completed: {
    label: "Tamamlandı",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    icon: CheckCircle,
  },
};

const paymentMethodConfig = {
  whatsapp: {
    label: "WhatsApp",
    color: "bg-green-100 text-green-700",
    icon: MessageCircle,
  },
  check: {
    label: "Çək",
    color: "bg-blue-100 text-blue-700",
    icon: FileText,
  },
};

type ActiveTab = "registrations" | "examTypes" | "branches";

const ITEMS_PER_PAGE = 20;

export default function RegistrationsPage() {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const [activeTab, setActiveTab] = useState<ActiveTab>("registrations");

  // Registration state
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: ITEMS_PER_PAGE,
    totalPages: 0,
    hasMore: false,
  });

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [examTypeFilter, setExamTypeFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    cancelled: 0,
    completed: 0,
  });

  // Check image modal state
  const [showCheckImageModal, setShowCheckImageModal] = useState(false);
  const [selectedRegistration, setSelectedRegistration] =
    useState<Registration | null>(null);

  // Image preview modal
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState("");

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPagination((prev) => ({ ...prev, page: 1 }));
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Exam types state
  const [examTypes, setExamTypes] = useState<ExamType[]>([]);
  const [loadingExamTypes, setLoadingExamTypes] = useState(false);
  const [examTypeSearch, setExamTypeSearch] = useState("");
  const [showExamTypeModal, setShowExamTypeModal] = useState(false);
  const [editingExamType, setEditingExamType] = useState<ExamType | null>(null);
  const [examTypeForm, setExamTypeForm] = useState({
    name: "",
    description: "",
    price: 0,
    isActive: true,
  });

  // Branches state
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loadingBranches, setLoadingBranches] = useState(false);
  const [branchSearch, setBranchSearch] = useState("");
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [branchForm, setBranchForm] = useState({
    name: "",
    address: "",
    phone: "",
    isActive: true,
  });

  // Fetch data with pagination
  const fetchRegistrations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        sortBy,
        sortOrder,
        status: statusFilter,
        examType: examTypeFilter,
        location: locationFilter,
        ...(debouncedSearch && { search: debouncedSearch }),
      });

      const res = await fetch(`/api/exam-registrations?${params}`);
      const data = await res.json();

      if (data.success) {
        setRegistrations(data.data);
        setPagination(data.pagination);
        calculateStats(data.data, data.pagination.total);
      } else {
        setError(data.error || "Məlumatlar yüklənərkən xəta baş verdi");
      }
    } catch (err) {
      setError("Server xətası baş verdi");
    } finally {
      setLoading(false);
    }
  }, [
    pagination.page,
    pagination.limit,
    sortBy,
    sortOrder,
    statusFilter,
    examTypeFilter,
    locationFilter,
    debouncedSearch,
  ]);

  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      router.push("/login");
    } else if (sessionStatus === "authenticated") {
      fetchRegistrations();
      fetchExamTypes();
      fetchBranches();
    }
  }, [sessionStatus, router, fetchRegistrations]);

  const fetchExamTypes = async () => {
    try {
      setLoadingExamTypes(true);
      const res = await fetch("/api/exam-types?admin=true");
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
      const res = await fetch("/api/branches?admin=true");
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

  const calculateStats = (data: Registration[], total: number) => {
    // Stats üçün bütün məlumatları istifadə edirik (server-dən gələn total)
    setStats({
      total,
      pending: data.filter((r) => r.status === "pending").length,
      confirmed: data.filter((r) => r.status === "confirmed").length,
      cancelled: data.filter((r) => r.status === "cancelled").length,
      completed: data.filter((r) => r.status === "completed").length,
    });
  };

  const updateStatus = async (
    id: string,
    newStatus: "pending" | "confirmed" | "cancelled" | "completed",
  ) => {
    try {
      setUpdatingId(id);
      const res = await fetch("/api/exam-registrations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      const data = await res.json();
      if (data.success) {
        setRegistrations((prev) =>
          prev.map((r) => (r._id === id ? { ...r, status: newStatus } : r)),
        );
      }
    } catch (err) {
      console.error("Status update error:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteRegistration = async (id: string) => {
    if (!confirm("Bu qeydiyyatı silmək istədiyinizə əminsiniz?")) return;

    try {
      const res = await fetch(`/api/exam-registrations?id=${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success) {
        setRegistrations((prev) => prev.filter((r) => r._id !== id));
        fetchRegistrations();
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // Pagination handlers
  const goToPage = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const nextPage = () => {
    if (pagination.hasMore) {
      setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const prevPage = () => {
    if (pagination.page > 1) {
      setPagination((prev) => ({ ...prev, page: prev.page - 1 }));
    }
  };

  // Sort handler
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  // Exam type handlers
  const handleExamTypeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const url = editingExamType
        ? `/api/exam-types?id=${editingExamType._id}`
        : "/api/exam-types";

      const method = editingExamType ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(examTypeForm),
      });

      const data = await res.json();

      if (data.success) {
        fetchExamTypes();
        setShowExamTypeModal(false);
        setEditingExamType(null);
        setExamTypeForm({
          name: "",
          description: "",
          price: 0,
          isActive: true,
        });
      } else {
        setError(data.error || "Əməliyyat zamanı xəta baş verdi");
      }
    } catch (err) {
      setError("Server xətası baş verdi");
    }
  };

  const handleEditExamType = (type: ExamType) => {
    setEditingExamType(type);
    setExamTypeForm({
      name: type.name,
      description: type.description || "",
      price: type.price || 0,
      isActive: type.isActive,
    });
    setShowExamTypeModal(true);
  };

  const handleDeleteExamType = async (id: string) => {
    if (!confirm("Bu imtahan növünü silmək istədiyinizə əminsiniz?")) return;

    try {
      const res = await fetch(`/api/exam-types?id=${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success) {
        fetchExamTypes();
      }
    } catch (err) {
      setError("Silinərkən xəta baş verdi");
    }
  };

  const handleToggleExamTypeActive = async (
    id: string,
    currentStatus: boolean,
  ) => {
    try {
      const res = await fetch(`/api/exam-types?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      const data = await res.json();
      if (data.success) {
        fetchExamTypes();
      }
    } catch (err) {
      setError("Status dəyişdirilərkən xəta baş verdi");
    }
  };

  // Branch handlers
  const handleBranchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const url = editingBranch
        ? `/api/branches?id=${editingBranch._id}`
        : "/api/branches";

      const method = editingBranch ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(branchForm),
      });

      const data = await res.json();

      if (data.success) {
        fetchBranches();
        setShowBranchModal(false);
        setEditingBranch(null);
        setBranchForm({ name: "", address: "", phone: "", isActive: true });
      } else {
        setError(data.error || "Əməliyyat zamanı xəta baş verdi");
      }
    } catch (err) {
      setError("Server xətası baş verdi");
    }
  };

  const handleEditBranch = (branch: Branch) => {
    setEditingBranch(branch);
    setBranchForm({
      name: branch.name,
      address: branch.address,
      phone: branch.phone,
      isActive: branch.isActive,
    });
    setShowBranchModal(true);
  };

  const handleDeleteBranch = async (id: string) => {
    if (!confirm("Bu filialı silmək istədiyinizə əminsiniz?")) return;

    try {
      const res = await fetch(`/api/branches?id=${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success) {
        fetchBranches();
      }
    } catch (err) {
      setError("Silinərkən xəta baş verdi");
    }
  };

  const handleToggleBranchActive = async (
    id: string,
    currentStatus: boolean,
  ) => {
    try {
      const res = await fetch(`/api/branches?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      const data = await res.json();
      if (data.success) {
        fetchBranches();
      }
    } catch (err) {
      setError("Status dəyişdirilərkən xəta baş verdi");
    }
  };

  const filteredExamTypes = examTypes.filter((type) =>
    type.name.toLowerCase().includes(examTypeSearch.toLowerCase()),
  );

  const filteredBranches = branches.filter((branch) =>
    branch.name.toLowerCase().includes(branchSearch.toLowerCase()),
  );

  const exportToCSV = () => {
    const headers = [
      "Ad Soyad",
      "Telefon",
      "E-poçt",
      "İmtahan Növü",
      "Filial",
      "Ödəniş",
      "Status",
      "Tarix",
    ];
    const csvData = registrations.map((r) => [
      r.fullName,
      r.phone,
      r.email || "",
      r.examType,
      r.location,
      paymentMethodConfig[r.paymentMethod || "whatsapp"].label,
      statusConfig[r.status].label,
      new Date(r.createdAt).toLocaleDateString("az-AZ"),
    ]);

    const csv = [headers, ...csvData].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `qeydiyyatlar_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const openCheckImageModal = (reg: Registration) => {
    setSelectedRegistration(reg);
    setShowCheckImageModal(true);
  };

  const closeCheckImageModal = () => {
    setShowCheckImageModal(false);
    setSelectedRegistration(null);
  };

  const confirmPayment = async (id: string) => {
    await updateStatus(id, "confirmed");
    closeCheckImageModal();
  };

  const openImagePreview = (imageUrl: string) => {
    setPreviewImageUrl(imageUrl);
    setShowImagePreview(true);
  };

  const closeImagePreview = () => {
    setShowImagePreview(false);
    setPreviewImageUrl("");
  };

  const isLoading =
    sessionStatus === "loading" ||
    (loading && activeTab === "registrations") ||
    (loadingExamTypes && activeTab === "examTypes") ||
    (loadingBranches && activeTab === "branches");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-brand-red mx-auto mb-4" />
          <p className="text-gray-600">Yüklənir...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-gray-600 hover:text-gray-900">
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-red/10 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-brand-red" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">
                  Qeydiyyatlar
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {session?.user?.image && (
                <img
                  src={session.user.image}
                  alt={session.user.name || ""}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="text-sm text-gray-600 hover:text-red-600"
              >
                Çıxış
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab("registrations")}
            className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              activeTab === "registrations"
                ? "bg-brand-red text-white shadow-lg shadow-brand-red/20"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Qeydiyyatlar
          </button>
          <button
            onClick={() => setActiveTab("examTypes")}
            className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              activeTab === "examTypes"
                ? "bg-brand-red text-white shadow-lg shadow-brand-red/20"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            <Tag className="w-4 h-4" />
            İmtahan Növləri
          </button>
          <button
            onClick={() => setActiveTab("branches")}
            className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              activeTab === "branches"
                ? "bg-brand-red text-white shadow-lg shadow-brand-red/20"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            <Building className="w-4 h-4" />
            Filiallar
          </button>
        </div>

        {/* Registrations Tab */}
        {activeTab === "registrations" && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.total}
                    </p>
                    <p className="text-xs text-gray-500">Cəmi</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-amber-600">
                      {stats.pending}
                    </p>
                    <p className="text-xs text-gray-500">Gözləyir</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {stats.confirmed}
                    </p>
                    <p className="text-xs text-gray-500">Təsdiqləndi</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <XCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-600">
                      {stats.cancelled}
                    </p>
                    <p className="text-xs text-gray-500">Ləğv edildi</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">
                      {stats.completed}
                    </p>
                    <p className="text-xs text-gray-500">Tamamlandı</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Ad, telefon və ya e-poçt axtar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setPagination((prev) => ({ ...prev, page: 1 }));
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                  >
                    <option value="all">Bütün statuslar</option>
                    <option value="pending">Gözləyir</option>
                    <option value="confirmed">Təsdiqləndi</option>
                    <option value="cancelled">Ləğv edildi</option>
                    <option value="completed">Tamamlandı</option>
                  </select>
                  <select
                    value={examTypeFilter}
                    onChange={(e) => {
                      setExamTypeFilter(e.target.value);
                      setPagination((prev) => ({ ...prev, page: 1 }));
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                  >
                    <option value="all">Bütün imtahanlar</option>
                    {examTypes
                      .filter((t) => t.isActive)
                      .map((t) => (
                        <option key={t._id} value={t.name}>
                          {t.name}
                        </option>
                      ))}
                  </select>
                  <select
                    value={locationFilter}
                    onChange={(e) => {
                      setLocationFilter(e.target.value);
                      setPagination((prev) => ({ ...prev, page: 1 }));
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                  >
                    <option value="all">Bütün filiallar</option>
                    {branches
                      .filter((b) => b.isActive)
                      .map((b) => (
                        <option key={b._id} value={b.name}>
                          {b.name}
                        </option>
                      ))}
                  </select>
                  <button
                    onClick={fetchRegistrations}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                    title="Yenilə"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={exportToCSV}
                    className="px-4 py-2 bg-brand-red text-white rounded-lg hover:bg-brand-red-dark flex items-center gap-2"
                    title="CSV endir"
                  >
                    <Download className="w-4 h-4" />
                    CSV
                  </button>
                </div>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th
                        className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort("fullName")}
                      >
                        <div className="flex items-center gap-2">
                          Qeydiyyatçı
                          {sortBy === "fullName" &&
                            (sortOrder === "asc" ? (
                              <SortAsc className="w-4 h-4" />
                            ) : (
                              <SortDesc className="w-4 h-4" />
                            ))}
                        </div>
                      </th>
                      <th
                        className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort("examType")}
                      >
                        <div className="flex items-center gap-2">
                          İmtahan
                          {sortBy === "examType" &&
                            (sortOrder === "asc" ? (
                              <SortAsc className="w-4 h-4" />
                            ) : (
                              <SortDesc className="w-4 h-4" />
                            ))}
                        </div>
                      </th>
                      <th
                        className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort("location")}
                      >
                        <div className="flex items-center gap-2">
                          Filial
                          {sortBy === "location" &&
                            (sortOrder === "asc" ? (
                              <SortAsc className="w-4 h-4" />
                            ) : (
                              <SortDesc className="w-4 h-4" />
                            ))}
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        Ödəniş
                      </th>
                      <th
                        className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort("status")}
                      >
                        <div className="flex items-center gap-2">
                          Status
                          {sortBy === "status" &&
                            (sortOrder === "asc" ? (
                              <SortAsc className="w-4 h-4" />
                            ) : (
                              <SortDesc className="w-4 h-4" />
                            ))}
                        </div>
                      </th>
                      <th
                        className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort("createdAt")}
                      >
                        <div className="flex items-center gap-2">
                          Tarix
                          {sortBy === "createdAt" &&
                            (sortOrder === "asc" ? (
                              <SortAsc className="w-4 h-4" />
                            ) : (
                              <SortDesc className="w-4 h-4" />
                            ))}
                        </div>
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                        Əməliyyatlar
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {loading ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-12 text-center">
                          <RefreshCw className="w-8 h-8 animate-spin text-brand-red mx-auto mb-2" />
                          <p className="text-gray-500">Yüklənir...</p>
                        </td>
                      </tr>
                    ) : registrations.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-4 py-12 text-center text-gray-500"
                        >
                          <Filter className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                          <p>Qeydiyyat tapılmadı</p>
                        </td>
                      </tr>
                    ) : (
                      registrations.map((reg) => {
                        const StatusIcon = statusConfig[reg.status].icon;
                        const PaymentIcon =
                          paymentMethodConfig[reg.paymentMethod || "whatsapp"]
                            .icon;
                        const whatsappLink = `https://wa.me/${reg.phone.replace(/[^0-9]/g, "")}`;
                        return (
                          <tr
                            key={reg._id}
                            className="hover:bg-gray-50 transition-colors cursor-pointer"
                            onClick={() =>
                              reg.paymentMethod == "check"
                                ? openCheckImageModal(reg)
                                : {}
                            }
                          >
                            <td className="px-4 py-4">
                              <div>
                                <p className="font-medium text-gray-900">
                                  {reg.fullName}
                                </p>
                                <div className="flex items-center gap-3 mt-1">
                                  <span className="flex items-center gap-1 text-sm text-gray-500">
                                    <Phone className="w-3 h-3" />
                                    {reg.phone}
                                  </span>
                                  {reg.email && (
                                    <span className="flex items-center gap-1 text-sm text-gray-500">
                                      <Mail className="w-3 h-3" />
                                      {reg.email}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-700">
                                  {reg.examType}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-700">
                                  {reg.location}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-2">
                                {reg.paymentMethod === "whatsapp" ? (
                                  <a
                                    href={whatsappLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${paymentMethodConfig.whatsapp.color} hover:opacity-80 transition-opacity`}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <MessageCircle className="w-3 h-3" />
                                    WhatsApp
                                  </a>
                                ) : (
                                  <span
                                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${paymentMethodConfig.check.color}`}
                                  >
                                    <FileText className="w-3 h-3" />
                                    Çək
                                  </span>
                                )}
                                {reg.checkImages &&
                                  reg.checkImages.length > 0 && (
                                    <div className="flex items-center gap-1 ml-2">
                                      <ImageIcon className="w-4 h-4 text-blue-500" />
                                      <span className="text-xs text-gray-500">
                                        {reg.checkImages.length} şəkil
                                      </span>
                                    </div>
                                  )}
                              </div>
                              {reg.checkImages &&
                                reg.checkImages.length > 0 && (
                                  <div className="flex gap-1 mt-2">
                                    {reg.checkImages
                                      .slice(0, 3)
                                      .map((img, idx) => (
                                        <img
                                          key={idx}
                                          src={img}
                                          alt={`Çək ${idx + 1}`}
                                          className="w-8 h-8 object-cover rounded border border-gray-200 cursor-pointer hover:opacity-75"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            window.open(img, "_blank");
                                          }}
                                        />
                                      ))}
                                  </div>
                                )}
                            </td>
                            <td className="px-4 py-4">
                              <select
                                value={reg.status}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  updateStatus(
                                    reg._id,
                                    e.target.value as
                                      | "pending"
                                      | "confirmed"
                                      | "cancelled",
                                  );
                                }}
                                disabled={updatingId === reg._id}
                                className={`px-3 py-1 rounded-full text-xs font-medium border ${statusConfig[reg.status].color} cursor-pointer hover:opacity-80 disabled:opacity-50 transition-opacity`}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <option value="pending">Gözləyir</option>
                                <option value="confirmed">Təsdiqləndi</option>
                                <option value="cancelled">Ləğv edildi</option>
                              </select>
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-500">
                              {new Date(reg.createdAt).toLocaleDateString(
                                "az-AZ",
                              )}
                              <span className="text-xs ml-1">
                                {new Date(reg.createdAt).toLocaleTimeString(
                                  "az-AZ",
                                  { hour: "2-digit", minute: "2-digit" },
                                )}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                {reg.checkImages &&
                                  reg.checkImages.length > 0 && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        openCheckImageModal(reg);
                                      }}
                                      className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                      title="Çək şəkillərinə bax"
                                    >
                                      <Eye className="w-4 h-4" />
                                    </button>
                                  )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteRegistration(reg._id);
                                  }}
                                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Sil"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {!loading && registrations.length > 0 && (
                <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    {(pagination.page - 1) * pagination.limit + 1}-
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.total,
                    )}{" "}
                    qeydiyyat göstərilir / {pagination.total} cəmi
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={prevPage}
                      disabled={pagination.page === 1}
                      className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 text-sm font-medium text-gray-700">
                      Səhifə {pagination.page} / {pagination.totalPages}
                    </span>
                    <button
                      onClick={nextPage}
                      disabled={!pagination.hasMore}
                      className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Exam Types Tab */}
        {activeTab === "examTypes" && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <Tag className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {examTypes.length}
                    </p>
                    <p className="text-xs text-gray-500">Cəmi</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {examTypes.filter((t) => t.isActive).length}
                    </p>
                    <p className="text-xs text-gray-500">Aktiv</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <XCircle className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-600">
                      {examTypes.filter((t) => !t.isActive).length}
                    </p>
                    <p className="text-xs text-gray-500">Qeyri-aktiv</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Search & Add */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm flex items-center justify-between">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="İmtahan növü axtar..."
                  value={examTypeSearch}
                  onChange={(e) => setExamTypeSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                />
              </div>
              <button
                onClick={() => {
                  setEditingExamType(null);
                  setExamTypeForm({
                    name: "",
                    description: "",
                    price: 0,
                    isActive: true,
                  });
                  setShowExamTypeModal(true);
                }}
                className="ml-4 flex items-center gap-2 px-4 py-2 bg-brand-red text-white rounded-lg hover:bg-brand-red-dark transition-colors"
              >
                <Plus className="w-4 h-4" />
                Yeni İmtahan Növü
              </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        Adı
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        Ödəniş (AZN)
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        Təsvir
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        Yaradılıb
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                        Əməliyyatlar
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredExamTypes.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-4 py-12 text-center text-gray-500"
                        >
                          <Tag className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                          <p>İmtahan növü tapılmadı</p>
                        </td>
                      </tr>
                    ) : (
                      filteredExamTypes.map((type) => (
                        <tr key={type._id} className="hover:bg-gray-50">
                          <td className="px-4 py-4">
                            <span className="font-medium text-gray-900">
                              {type.name}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            {type.price ? (
                              <span className="font-semibold text-green-600">
                                {type.price} AZN
                              </span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500 max-w-xs truncate">
                            {type.description || "-"}
                          </td>
                          <td className="px-4 py-4">
                            <button
                              onClick={() =>
                                handleToggleExamTypeActive(
                                  type._id,
                                  type.isActive,
                                )
                              }
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                type.isActive
                                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}
                            >
                              {type.isActive ? (
                                <>
                                  <CheckCircle className="w-3 h-3" />
                                  Aktiv
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-3 h-3" />
                                  Qeyri-aktiv
                                </>
                              )}
                            </button>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500">
                            {new Date(type.createdAt).toLocaleDateString(
                              "az-AZ",
                            )}
                          </td>
                          <td className="px-4 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleEditExamType(type)}
                                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                title="Redaktə et"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteExamType(type._id)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Sil"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Branches Tab */}
        {activeTab === "branches" && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <Building className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {branches.length}
                    </p>
                    <p className="text-xs text-gray-500">Cəmi</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {branches.filter((b) => b.isActive).length}
                    </p>
                    <p className="text-xs text-gray-500">Aktiv</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <XCircle className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-600">
                      {branches.filter((b) => !b.isActive).length}
                    </p>
                    <p className="text-xs text-gray-500">Qeyri-aktiv</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Search & Add */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm flex items-center justify-between">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Filial axtar..."
                  value={branchSearch}
                  onChange={(e) => setBranchSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                />
              </div>
              <button
                onClick={() => {
                  setEditingBranch(null);
                  setBranchForm({
                    name: "",
                    address: "",
                    phone: "",
                    isActive: true,
                  });
                  setShowBranchModal(true);
                }}
                className="ml-4 flex items-center gap-2 px-4 py-2 bg-brand-red text-white rounded-lg hover:bg-brand-red-dark transition-colors"
              >
                <Plus className="w-4 h-4" />
                Yeni Filial
              </button>
            </div>

            {/* Error message */}
            {error && activeTab === "branches" && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        Adı
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        Ünvan
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        Telefon
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        Yaradılıb
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                        Əməliyyatlar
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredBranches.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-4 py-12 text-center text-gray-500"
                        >
                          <Building className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                          <p>Filial tapılmadı</p>
                        </td>
                      </tr>
                    ) : (
                      filteredBranches.map((branch) => (
                        <tr key={branch._id} className="hover:bg-gray-50">
                          <td className="px-4 py-4">
                            <span className="font-medium text-gray-900">
                              {branch.name}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500 max-w-xs truncate">
                            {branch.address || "-"}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500">
                            {branch.phone || "-"}
                          </td>
                          <td className="px-4 py-4">
                            <button
                              onClick={() =>
                                handleToggleBranchActive(
                                  branch._id,
                                  branch.isActive,
                                )
                              }
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                branch.isActive
                                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}
                            >
                              {branch.isActive ? (
                                <>
                                  <CheckCircle className="w-3 h-3" />
                                  Aktiv
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-3 h-3" />
                                  Qeyri-aktiv
                                </>
                              )}
                            </button>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500">
                            {new Date(branch.createdAt).toLocaleDateString(
                              "az-AZ",
                            )}
                          </td>
                          <td className="px-4 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleEditBranch(branch)}
                                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                title="Redaktə et"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteBranch(branch._id)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Sil"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Exam Type Modal */}
      {showExamTypeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">
                {editingExamType ? "Redaktə Et" : "Yeni İmtahan Növü"}
              </h3>
              <button
                onClick={() => setShowExamTypeModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleExamTypeSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adı *
                </label>
                <input
                  type="text"
                  value={examTypeForm.name}
                  onChange={(e) =>
                    setExamTypeForm({ ...examTypeForm, name: e.target.value })
                  }
                  placeholder="Məs: 9-cu sinif attestat"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ödəniş (AZN) - Bir dəfəlik
                </label>
                <input
                  type="number"
                  value={examTypeForm.price}
                  onChange={(e) =>
                    setExamTypeForm({
                      ...examTypeForm,
                      price: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Bu, imtahan üçün bir dəfəlik ödəniş məbləğidir
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Təsvir
                </label>
                <textarea
                  value={examTypeForm.description}
                  onChange={(e) =>
                    setExamTypeForm({
                      ...examTypeForm,
                      description: e.target.value,
                    })
                  }
                  placeholder="Qısa təsvir..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent resize-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={examTypeForm.isActive}
                  onChange={(e) =>
                    setExamTypeForm({
                      ...examTypeForm,
                      isActive: e.target.checked,
                    })
                  }
                  className="w-4 h-4 text-brand-red border-gray-300 rounded focus:ring-brand-red"
                />
                <label htmlFor="isActive" className="text-sm text-gray-700">
                  Aktiv (qeydiyyat formasında göstəriləcək)
                </label>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowExamTypeModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Ləğv et
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-brand-red text-white rounded-lg hover:bg-brand-red-dark transition-colors"
                >
                  {editingExamType ? "Yenilə" : "Əlavə et"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Branch Modal */}
      {showBranchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">
                {editingBranch ? "Redaktə Et" : "Yeni Filial"}
              </h3>
              <button
                onClick={() => setShowBranchModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleBranchSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filial adı *
                </label>
                <input
                  type="text"
                  value={branchForm.name}
                  onChange={(e) =>
                    setBranchForm({ ...branchForm, name: e.target.value })
                  }
                  placeholder="Məs: Nərimanov filialı"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ünvan
                </label>
                <input
                  type="text"
                  value={branchForm.address}
                  onChange={(e) =>
                    setBranchForm({ ...branchForm, address: e.target.value })
                  }
                  placeholder="Ünvan daxil edin..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefon
                </label>
                <input
                  type="tel"
                  value={branchForm.phone}
                  onChange={(e) =>
                    setBranchForm({ ...branchForm, phone: e.target.value })
                  }
                  placeholder="+994 50 123 45 67"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="branchIsActive"
                  checked={branchForm.isActive}
                  onChange={(e) =>
                    setBranchForm({ ...branchForm, isActive: e.target.checked })
                  }
                  className="w-4 h-4 text-brand-red border-gray-300 rounded focus:ring-brand-red"
                />
                <label
                  htmlFor="branchIsActive"
                  className="text-sm text-gray-700"
                >
                  Aktiv (qeydiyyat formasında göstəriləcək)
                </label>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowBranchModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Ləğv et
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-brand-red text-white rounded-lg hover:bg-brand-red-dark transition-colors"
                >
                  {editingBranch ? "Yenilə" : "Əlavə et"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Check Image Modal */}
      {showCheckImageModal && selectedRegistration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">
                    Çək Təsdiqi
                  </h3>
                </div>
              </div>
              <button
                onClick={closeCheckImageModal}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3 overflow-y-auto flex-1">
              {/* Telefon nömrəsi */}
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 font-medium">
                      Telefon nömrəsi
                    </p>
                    <a
                      href={`tel:${selectedRegistration.phone}`}
                      className="text-sm font-semibold text-blue-600 hover:underline truncate block"
                    >
                      {selectedRegistration.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Çək şəkli */}
              <div>
                <div
                  className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50 cursor-pointer group"
                  onClick={() =>
                    openImagePreview(selectedRegistration.checkImages![0])
                  }
                >
                  <img
                    src={selectedRegistration.checkImages![0]}
                    alt="Çək"
                    className="w-full h-48 object-cover group-hover:opacity-90 transition-opacity"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                      <ZoomIn className="w-5 h-5 text-gray-700" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Select */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Status
                </label>
                <div className="relative">
                  <select
                    value={selectedRegistration.status}
                    onChange={(e) => {
                      const newStatus = e.target.value as
                        | "pending"
                        | "confirmed"
                        | "cancelled";
                      updateStatus(selectedRegistration._id, newStatus);
                      setRegistrations((prev) =>
                        prev.map((r) =>
                          r._id === selectedRegistration._id
                            ? { ...r, status: newStatus }
                            : r,
                        ),
                      );
                      setSelectedRegistration({
                        ...selectedRegistration,
                        status: newStatus,
                      });
                    }}
                    disabled={updatingId === selectedRegistration._id}
                    className="w-full px-3 py-2.5 pr-8 text-sm font-medium border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed appearance-none cursor-pointer"
                  >
                    <option value="pending">Gözləyir</option>
                    <option value="confirmed">Təsdiqləndi</option>
                    <option value="cancelled">Ləğv edildi</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
              <button
                onClick={closeCheckImageModal}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Bağla
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {showImagePreview && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-sm"
          onClick={closeImagePreview}
        >
          <button
            onClick={closeImagePreview}
            className="absolute top-4 right-4 p-3 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={previewImageUrl}
            alt="Böyüdülmüş çək"
            className="max-w-full max-h-full w-auto h-auto object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
