import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import ExamTopic from '@/models/ExamTopic';

// GET - Bütün imtahan mövzularını əldə et
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const isAdmin = searchParams.get('admin') === 'true';

    const query = isAdmin ? {} : { isActive: true };

    const topics = await ExamTopic.find(query).sort({ category: 1, displayOrder: 1 });

    return NextResponse.json({
      success: true,
      data: topics,
    });
  } catch (error) {
    console.error('İmtahan mövzuları alınmadı:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'İmtahan mövzuları alınarkən xəta baş verdi',
      },
      { status: 500 }
    );
  }
}

// POST - Yeni mövzu əlavə et
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'İcazə yoxdur' },
        { status: 401 }
      );
    }

    await connectDB();
    const body = await request.json();
    const newTopic = await ExamTopic.create(body);

    return NextResponse.json({ success: true, data: newTopic });
  } catch (error) {
    console.error('Mövzu əlavə edilmədi:', error);
    return NextResponse.json(
      { success: false, error: 'Mövzu əlavə edilərkən xəta baş verdi' },
      { status: 500 }
    );
  }
}

// PUT - Mövzunu yenilə
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'İcazə yoxdur' },
        { status: 401 }
      );
    }

    await connectDB();
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Mövzu ID-si tələb olunur' },
        { status: 400 }
      );
    }

    const updatedTopic = await ExamTopic.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedTopic) {
      return NextResponse.json(
        { success: false, error: 'Mövzu tapılmadı' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedTopic });
  } catch (error) {
    console.error('Mövzu yenilənmədi:', error);
    return NextResponse.json(
      { success: false, error: 'Mövzu yenilənərkən xəta baş verdi' },
      { status: 500 }
    );
  }
}

// DELETE - Mövzunu sil
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'İcazə yoxdur' },
        { status: 401 }
      );
    }

    await connectDB();
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Mövzu ID-si tələb olunur' },
        { status: 400 }
      );
    }

    const deletedTopic = await ExamTopic.findByIdAndDelete(id);

    if (!deletedTopic) {
      return NextResponse.json(
        { success: false, error: 'Mövzu tapılmadı' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Mövzu uğurla silindi' });
  } catch (error) {
    console.error('Mövzu silinmədi:', error);
    return NextResponse.json(
      { success: false, error: 'Mövzu silinərkən xəta baş verdi' },
      { status: 500 }
    );
  }
}