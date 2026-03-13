import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import News from '@/models/News';

// GET - Bütün xəbərləri əldə et
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const isAdmin = searchParams.get('admin') === 'true';

    const query = isAdmin ? {} : { isActive: true };

    const news = await News.find(query).sort({ displayOrder: 1, date: -1 });

    return NextResponse.json({
      success: true,
      data: news,
    });
  } catch (error) {
    console.error('Xəbərlər alınmadı:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Xəbərlər alınarkən xəta baş verdi',
      },
      { status: 500 }
    );
  }
}

// POST - Yeni xəbər əlavə et
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: 'İcazə yoxdur',
        },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await request.json();

    const newNews = await News.create(body);

    return NextResponse.json({
      success: true,
      data: newNews,
    });
  } catch (error) {
    console.error('Xəbər əlavə edilmədi:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Xəbər əlavə edilərkən xəta baş verdi',
      },
      { status: 500 }
    );
  }
}

// PUT - Xəbəri yenilə
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: 'İcazə yoxdur',
        },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Xəbər ID-si tələb olunur',
        },
        { status: 400 }
      );
    }

    const updatedNews = await News.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedNews) {
      return NextResponse.json(
        {
          success: false,
          error: 'Xəbər tapılmadı',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedNews,
    });
  } catch (error) {
    console.error('Xəbər yenilənmədi:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Xəbər yenilənərkən xəta baş verdi',
      },
      { status: 500 }
    );
  }
}

// DELETE - Xəbəri sil
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: 'İcazə yoxdur',
        },
        { status: 401 }
      );
    }

    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Xəbər ID-si tələb olunur',
        },
        { status: 400 }
      );
    }

    const deletedNews = await News.findByIdAndDelete(id);

    if (!deletedNews) {
      return NextResponse.json(
        {
          success: false,
          error: 'Xəbər tapılmadı',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Xəbər uğurla silindi',
    });
  } catch (error) {
    console.error('Xəbər silinmədi:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Xəbər silinərkən xəta baş verdi',
      },
      { status: 500 }
    );
  }
}