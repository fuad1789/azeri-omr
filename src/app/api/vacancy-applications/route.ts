import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import VacancyApplication from '@/models/VacancyApplication';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get('status');
    
    let query: any = {};
    if (status) {
      query.status = status;
    }
    
    const applications = await VacancyApplication.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      data: JSON.parse(JSON.stringify(applications)),
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { success: false, error: 'Müraciətlər alınmadı' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    const body = await req.json();
    
    const {
      vacancyId,
      name,
      surname,
      specialty,
      department,
      branch,
      birthDate,
      phone,
      email,
      cvUrl,
    } = body;
    
    const application = await VacancyApplication.create({
      vacancyId,
      name,
      surname,
      specialty,
      department,
      branch,
      birthDate,
      phone,
      email,
      cvUrl: cvUrl || '',
    });
    
    return NextResponse.json({
      success: true,
      data: JSON.parse(JSON.stringify(application)),
    });
  } catch (error) {
    console.error('Error creating application:', error);
    return NextResponse.json(
      { success: false, error: 'Müraciət yaradılmadı' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID tələb olunur' },
        { status: 400 }
      );
    }
    
    const body = await req.json();
    
    const application = await VacancyApplication.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );
    
    if (!application) {
      return NextResponse.json(
        { success: false, error: 'Müraciət tapılmadı' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: JSON.parse(JSON.stringify(application)),
    });
  } catch (error) {
    console.error('Error updating application:', error);
    return NextResponse.json(
      { success: false, error: 'Müraciət yenilənmədi' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID tələb olunur' },
        { status: 400 }
      );
    }
    
    const application = await VacancyApplication.findByIdAndDelete(id);
    
    if (!application) {
      return NextResponse.json(
        { success: false, error: 'Müraciət tapılmadı' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Müraciət silindi',
    });
  } catch (error) {
    console.error('Error deleting application:', error);
    return NextResponse.json(
      { success: false, error: 'Müraciət silinmədi' },
      { status: 500 }
    );
  }
}