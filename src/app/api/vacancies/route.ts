import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Vacancy from '@/models/Vacancy';

// GET - Bütün vakansiyaları əldə et
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const isAdmin = searchParams.get('admin') === 'true';

    const query = isAdmin ? {} : { isActive: true };

    const vacancies = await Vacancy.find(query).sort({ displayOrder: 1, createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: vacancies,
    });
  } catch (error) {
    console.error('Vakansiyalar alınmadı:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Vakansiyalar alınarkən xəta baş verdi',
      },
      { status: 500 }
    );
  }
}

// POST - Yeni vakansiya əlavə et
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

    const newVacancy = await Vacancy.create(body);

    return NextResponse.json({
      success: true,
      data: newVacancy,
    });
  } catch (error) {
    console.error('Vakansiya əlavə edilmədi:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Vakansiya əlavə edilərkən xəta baş verdi',
      },
      { status: 500 }
    );
  }
}

// PUT - Vakansiyanı yenilə
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
          error: 'Vakansiya ID-si tələb olunur',
        },
        { status: 400 }
      );
    }

    const updatedVacancy = await Vacancy.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedVacancy) {
      return NextResponse.json(
        {
          success: false,
          error: 'Vakansiya tapılmadı',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedVacancy,
    });
  } catch (error) {
    console.error('Vakansiya yenilənmədi:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Vakansiya yenilənərkən xəta baş verdi',
      },
      { status: 500 }
    );
  }
}

// DELETE - Vakansiyanı sil
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
          error: 'Vakansiya ID-si tələb olunur',
        },
        { status: 400 }
      );
    }

    const deletedVacancy = await Vacancy.findByIdAndDelete(id);

    if (!deletedVacancy) {
      return NextResponse.json(
        {
          success: false,
          error: 'Vakansiya tapılmadı',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Vakansiya uğurla silindi',
    });
  } catch (error) {
    console.error('Vakansiya silinmədi:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Vakansiya silinərkən xəta baş verdi',
      },
      { status: 500 }
    );
  }
}