import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { rateLimit } from '@/middleware/rateLimiter';

// Global rate limiter - Very lenient to allow high-speed agent work
// Multiple agents can work from same office IP without issues
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 1000, // 1000 requests per 15 minutes per IP
  message: 'Too many requests. Please slow down or contact support if you need higher limits.'
});

// Server-side Supabase client with service role key
function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

export async function GET(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = await limiter(request);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('company_id');

    if (!companyId) {
      return NextResponse.json({ error: 'Company ID is required' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    const { data: company, error } = await supabase
      .from('companies')
      .select('id, name, bio, industry, image_url')
      .eq('id', companyId)
      .single();

    if (error) {
      console.error('Error fetching company:', error);
      return NextResponse.json({ error: 'Failed to fetch company' }, { status: 500 });
    }

    return NextResponse.json({ company });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = await limiter(request);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const supabase = getSupabaseAdmin();
    const formData = await request.formData();
    const companyId = formData.get('company_id') as string;
    const name = formData.get('name') as string;
    const bio = formData.get('bio') as string;
    const industry = formData.get('industry') as string;
    const logo = formData.get('logo') as File | null;

    if (!companyId) {
      return NextResponse.json({ error: 'Company ID is required' }, { status: 400 });
    }

    let imageUrl: string | null = null;

    // Upload logo to Supabase Storage if provided
    if (logo && logo.size > 0) {
      const fileExt = logo.name.split('.').pop();
      const fileName = `${companyId}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Convert File to ArrayBuffer then to Buffer
      const arrayBuffer = await logo.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('company-logos')
        .upload(filePath, buffer, {
          contentType: logo.type,
          upsert: true,
        });

      if (uploadError) {
        console.error('Error uploading logo:', uploadError);
        return NextResponse.json({ error: 'Failed to upload logo' }, { status: 500 });
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('company-logos')
        .getPublicUrl(filePath);

      imageUrl = publicUrl;
    }

    // Update company in database
    const updateData: any = {
      name,
      bio,
      industry,
      updated_at: new Date().toISOString(),
    };

    if (imageUrl) {
      updateData.image_url = imageUrl;
    }

    const { data: company, error: updateError } = await supabase
      .from('companies')
      .update(updateData)
      .eq('id', companyId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating company:', updateError);
      return NextResponse.json({ error: 'Failed to update company' }, { status: 500 });
    }

    return NextResponse.json({ company, message: 'Company profile updated successfully' });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Mark this route as dynamic to prevent static optimization
export const dynamic = 'force-dynamic';
