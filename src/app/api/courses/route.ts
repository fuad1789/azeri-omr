import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Course from '@/models/Course';

// GET - Bütün kursları əldə et
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const isAdmin = searchParams.get('admin') === 'true';
    const limit = searchParams.get('limit');
    const activeOnly = searchParams.get('active') === 'true';

    // Admin deyilsə, yalnız aktiv kursları göstər
    let query: any = {};
    if (!isAdmin) {
      query.isActive = true;
    }
    if (activeOnly && !isAdmin) {
      query.isActive = true;
    }

    let coursesQuery = Course.find(query).sort({ displayOrder: 1, createdAt: -1 });
    
    // Limit əlavə et
    if (limit) {
      coursesQuery = coursesQuery.limit(parseInt(limit));
    }

    const courses = await coursesQuery;

    return NextResponse.json({
      success: true,
      data: courses,
    });
  } catch (error) {
    console.error('Kurslar alınmadı:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Kurslar alınarkən xəta baş verdi',
      },
      { status: 500 }
    );
  }
}

// POST - Yeni kurs əlavə et
export async function POST(request: NextRequest) {
  try {
    // Admin yoxlaması
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

    const newCourse = await Course.create(body);

    return NextResponse.json({
      success: true,
      data: newCourse,
    });
  } catch (error) {
    console.error('Kurs əlavə edilmədi:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Kurs əlavə edilərkən xəta baş verdi',
      },
      { status: 500 }
    );
  }
}

// PUT - Kursu yenilə
export async function PUT(request: NextRequest) {
  try {
    // Admin yoxlaması
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
          error: 'Kurs ID-si tələb olunur',
        },
        { status: 400 }
      );
    }

    const updatedCourse = await Course.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedCourse) {
      return NextResponse.json(
        {
          success: false,
          error: 'Kurs tapılmadı',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedCourse,
    });
  } catch (error) {
    console.error('Kurs yenilənmədi:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Kurs yenilənərkən xəta baş verdi',
      },
      { status: 500 }
    );
  }
}

// DELETE - Kursu sil
export async function DELETE(request: NextRequest) {
  try {
    // Admin yoxlaması
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
          error: 'Kurs ID-si tələb olunur',
        },
        { status: 400 }
      );
    }

    const deletedCourse = await Course.findByIdAndDelete(id);

    if (!deletedCourse) {
      return NextResponse.json(
        {
          success: false,
          error: 'Kurs tapılmadı',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Kurs uğurla silindi',
    });
  } catch (error) {
    console.error('Kurs silinmədi:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Kurs silinərkən xəta baş verdi',
      },
      { status: 500 }
    );
  }
}