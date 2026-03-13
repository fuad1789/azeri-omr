import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Branch from '@/models/Branch';

export const dynamic = 'force-dynamic';

// GET /api/branches - Get all active branches (public) or all (admin)
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const adminMode = searchParams.get('admin') === 'true';

    // For public use (registration form) - only active branches
    if (!adminMode) {
      const branches = await Branch.find({ isActive: true })
        .sort({ displayOrder: 1, name: 1 });
      
      return NextResponse.json({ success: true, data: branches });
    }

    // For admin - check authentication
    const authSession = await getServerSession(authOptions);
    if (!authSession) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const branches = await Branch.find({}).sort({ displayOrder: 1, name: 1 });
    return NextResponse.json({ success: true, data: branches });

  } catch (err: any) {
    console.error('[API /branches GET]', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Server xətası' },
      { status: 500 }
    );
  }
}

// POST /api/branches - Create new branch (admin only)
export async function POST(req: NextRequest) {
  try {
    const authSession = await getServerSession(authOptions);
    if (!authSession) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await req.json();
    const { name, address, phone, email, mapUrl, isActive, displayOrder } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, error: 'Filial adı vacibdir' },
        { status: 400 }
      );
    }

    // Check if already exists
    const existing = await Branch.findOne({ 
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } 
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Bu filial artıq mövcuddur' },
        { status: 400 }
      );
    }

    const branch = await Branch.create({
      name: name.trim(),
      address: address || '',
      phone: phone || '',
      email: email || '',
      mapUrl: mapUrl || '',
      isActive: isActive !== undefined ? isActive : true,
      displayOrder: displayOrder || 0,
    });

    return NextResponse.json({ success: true, data: branch }, { status: 201 });

  } catch (err: any) {
    console.error('[API /branches POST]', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Server xətası' },
      { status: 500 }
    );
  }
}

// PUT /api/branches?id=xxx - Update branch (admin only)
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
    const { name, address, phone, email, mapUrl, isActive, displayOrder } = body;

    const updateData: Record<string, any> = {};
    if (name) updateData.name = name.trim();
    if (address !== undefined) updateData.address = address;
    if (phone !== undefined) updateData.phone = phone;
    if (email !== undefined) updateData.email = email;
    if (mapUrl !== undefined) updateData.mapUrl = mapUrl;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (displayOrder !== undefined) updateData.displayOrder = displayOrder;

    const updated = await Branch.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Filial tapılmadı' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });

  } catch (err: any) {
    console.error('[API /branches PUT]', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Server xətası' },
      { status: 500 }
    );
  }
}

// DELETE /api/branches?id=xxx - Delete branch (admin only)
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

    const deleted = await Branch.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Filial tapılmadı' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Filial silindi' });

  } catch (err: any) {
    console.error('[API /branches DELETE]', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Server xətası' },
      { status: 500 }
    );
  }
}