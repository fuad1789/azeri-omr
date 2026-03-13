import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { ExamRegistration } from '@/models/ExamRegistration';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// GET - Bütün qeydiyyatları gətir (Admin üçün) - Pagination dəstəyi ilə
export async function GET(request: NextRequest) {
  try {
    // Admin yoxlaması
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'İcazə yoxdur' },
        { status: 401 }
      );
    }

    await connectDB();

    // Query parametrləri
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const examType = searchParams.get('examType');
    const location = searchParams.get('location');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Filter qurmaq
    const filter: any = {};
    if (status && status !== 'all') filter.status = status;
    if (examType && examType !== 'all') filter.examType = examType;
    if (location && location !== 'all') filter.location = location;
    
    // Axtarış filteri
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Sort qurmaq
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Pagination hesablamaq
    const skip = (page - 1) * limit;
    const total = await ExamRegistration.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    const registrations = await ExamRegistration.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      success: true,
      data: registrations,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasMore: page < totalPages
      }
    });
  } catch (error) {
    console.error('GET /api/exam-registrations error:', error);
    return NextResponse.json(
      { success: false, error: 'Server xətası' },
      { status: 500 }
    );
  }
}

// POST - Yeni qeydiyyat yarat
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // FormData ilə işləyirik (şəkillər üçün)
    const formData = await request.formData();
    
    const fullName = formData.get('fullName') as string;
    const phone = formData.get('phone') as string;
    const email = formData.get('email') as string | null;
    const examType = formData.get('examType') as string;
    const location = formData.get('location') as string;
    const message = formData.get('message') as string | null;
    const paymentMethod = formData.get('paymentMethod') as 'whatsapp' | 'check' | null;
    
    // Validasiya
    if (!fullName || !phone || !examType || !location) {
      return NextResponse.json(
        { success: false, error: 'Bütün tələb olunan sahələri doldurun' },
        { status: 400 }
      );
    }

    const checkImages: string[] = [];
    
    // Əgər çək ilə ödəniş seçilibsə, şəkili yadda et
    if (paymentMethod === 'check') {
      const checkImageFile = formData.get('checkImages') as File;
      
      if (!checkImageFile || checkImageFile.size === 0) {
        return NextResponse.json(
          { success: false, error: 'Çək şəkli yükləməlisiniz' },
          { status: 400 }
        );
      }

      // Şəkili yadda etmək üçün qovluq yarat
      const uploadDir = join(process.cwd(), 'public', 'uploads', 'check-images');
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }

      const bytes = await checkImageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Unikal ad yarat
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 15);
      const fileName = `${timestamp}_${randomStr}_${checkImageFile.name.replace(/\s+/g, '_')}`;
      const filePath = join(uploadDir, fileName);
      
      // Şəkili yadda et
      await writeFile(filePath, buffer);
      
      // Şəkil yolunu saxla (public yol)
      checkImages.push(`/uploads/check-images/${fileName}`);
    }

    const registration = await ExamRegistration.create({
      fullName,
      phone,
      email,
      examType,
      location,
      message,
      status: 'pending',
      paymentMethod: paymentMethod || 'whatsapp',
      checkImages,
    });

    return NextResponse.json({
      success: true,
      data: registration,
    });
  } catch (error) {
    console.error('POST /api/exam-registrations error:', error);
    return NextResponse.json(
      { success: false, error: 'Server xətası' },
      { status: 500 }
    );
  }
}

// PATCH - Qeydiyyat statusunu yenilə
export async function PATCH(request: NextRequest) {
  try {
    // Admin yoxlaması
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'İcazə yoxdur' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: 'ID və status tələb olunur' },
        { status: 400 }
      );
    }

    if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Keçərli status deyil' },
        { status: 400 }
      );
    }

    await connectDB();

    const updated = await ExamRegistration.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Qeydiyyat tapılmadı' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error('PATCH /api/exam-registrations error:', error);
    return NextResponse.json(
      { success: false, error: 'Server xətası' },
      { status: 500 }
    );
  }
}

// DELETE - Qeydiyyatı sil
export async function DELETE(request: NextRequest) {
  try {
    // Admin yoxlaması
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'İcazə yoxdur' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID tələb olunur' },
        { status: 400 }
      );
    }

    await connectDB();

    const deleted = await ExamRegistration.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Qeydiyyat tapılmadı' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Qeydiyyat silindi',
    });
  } catch (error) {
    console.error('DELETE /api/exam-registrations error:', error);
    return NextResponse.json(
      { success: false, error: 'Server xətası' },
      { status: 500 }
    );
  }
}