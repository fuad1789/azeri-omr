import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import SuccessStory from '@/models/SuccessStory';

// GET - Bütün uğur hekayələrini əldə et
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const isAdmin = searchParams.get('admin') === 'true';

    const query = isAdmin ? {} : { isActive: true };

    const successStories = await SuccessStory.find(query).sort({ displayOrder: 1, year: -1, score: -1 });

    return NextResponse.json({
      success: true,
      data: successStories,
    });
  } catch (error) {
    console.error('Uğur hekayələri alınmadı:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Uğur hekayələri alınarkən xəta baş verdi',
      },
      { status: 500 }
    );
  }
}

// POST - Yeni uğur hekayəsi əlavə et
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

    const newSuccessStory = await SuccessStory.create(body);

    return NextResponse.json({
      success: true,
      data: newSuccessStory,
    });
  } catch (error) {
    console.error('Uğur hekayəsi əlavə edilmədi:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Uğur hekayəsi əlavə edilərkən xəta baş verdi',
      },
      { status: 500 }
    );
  }
}

// PUT - Uğur hekayəsini yenilə
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
          error: 'Uğur hekayəsi ID-si tələb olunur',
        },
        { status: 400 }
      );
    }

    const updatedSuccessStory = await SuccessStory.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedSuccessStory) {
      return NextResponse.json(
        {
          success: false,
          error: 'Uğur hekayəsi tapılmadı',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedSuccessStory,
    });
  } catch (error) {
    console.error('Uğur hekayəsi yenilənmədi:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Uğur hekayəsi yenilənərkən xəta baş verdi',
      },
      { status: 500 }
    );
  }
}

// DELETE - Uğur hekayəsini sil
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
          error: 'Uğur hekayəsi ID-si tələb olunur',
        },
        { status: 400 }
      );
    }

    const deletedSuccessStory = await SuccessStory.findByIdAndDelete(id);

    if (!deletedSuccessStory) {
      return NextResponse.json(
        {
          success: false,
          error: 'Uğur hekayəsi tapılmadı',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Uğur hekayəsi uğurla silindi',
    });
  } catch (error) {
    console.error('Uğur hekayəsi silinmədi:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Uğur hekayəsi silinərkən xəta baş verdi',
      },
      { status: 500 }
    );
  }
}