import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import ExamType from '@/models/ExamType';

export const dynamic = 'force-dynamic';

// GET /api/exam-types - Get all active exam types (public) or all (admin)
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const adminMode = searchParams.get('admin') === 'true';

    // For public use (registration form) - only active exam types
    if (!adminMode) {
      const examTypes = await ExamType.find({ isActive: true })
        .sort({ displayOrder: 1, name: 1 });
      
      return NextResponse.json({ success: true, data: examTypes });
    }

    // For admin - check authentication
    const authSession = await getServerSession(authOptions);
    if (!authSession) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const examTypes = await ExamType.find({}).sort({ displayOrder: 1, name: 1 });
    return NextResponse.json({ success: true, data: examTypes });

  } catch (err: any) {
    console.error('[API /exam-types GET]', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Server xətası' },
      { status: 500 }
    );
  }
}

// POST /api/exam-types - Create new exam type (admin only)
export async function POST(req: NextRequest) {
  try {
    const authSession = await getServerSession(authOptions);
    if (!authSession) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await req.json();
    const { name, description, price, priceDescription, isActive, displayOrder } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, error: 'İmtahan növü adı vacibdir' },
        { status: 400 }
      );
    }

    // Check if already exists
    const existing = await ExamType.findOne({ 
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } 
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Bu imtahan növü artıq mövcuddur' },
        { status: 400 }
      );
    }

    const examType = await ExamType.create({
      name: name.trim(),
      description: description || '',
      price: price !== undefined ? price : 0,
      priceDescription: priceDescription || '',
      isActive: isActive !== undefined ? isActive : true,
      displayOrder: displayOrder || 0,
    });

    return NextResponse.json({ success: true, data: examType }, { status: 201 });

  } catch (err: any) {
    console.error('[API /exam-types POST]', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Server xətası' },
      { status: 500 }
    );
  }
}

// PUT /api/exam-types?id=xxx - Update exam type (admin only)
export async function PUT(req: NextRequest) {
  try {
    const authSession = await getServerSession(authOptions);
    if (!authSession) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID tələb olunur' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { name, description, price, priceDescription, isActive, displayOrder } = body;

    const updateData: Record<string, any> = {};
    if (name) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (priceDescription !== undefined) updateData.priceDescription = priceDescription;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (displayOrder !== undefined) updateData.displayOrder = displayOrder;

    const updated = await ExamType.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'İmtahan növü tapılmadı' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });

  } catch (err: any) {
    console.error('[API /exam-types PUT]', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Server xətası' },
      { status: 500 }
    );
  }
}

// DELETE /api/exam-types?id=xxx - Delete exam type (admin only)
export async function DELETE(req: NextRequest) {
  try {
    const authSession = await getServerSession(authOptions);
    if (!authSession) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID tələb olunur' },
        { status: 400 }
      );
    }

    const deleted = await ExamType.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'İmtahan növü tapılmadı' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'İmtahan növü silindi' });

  } catch (err: any) {
    console.error('[API /exam-types DELETE]', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Server xətası' },
      { status: 500 }
    );
  }
}