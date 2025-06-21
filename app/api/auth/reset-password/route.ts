import { NextResponse } from 'next/server';
import pool from '@/server/config/database';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    // Find valid reset token
    const resetResult = await pool.query(
      `SELECT user_id 
       FROM password_resets 
       WHERE token = $1 
       AND expires_at > NOW()
       AND used = false`,
      [token]
    );

    if (resetResult.rows.length === 0) {
      return NextResponse.json(
        { message: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    const userId = resetResult.rows[0].user_id;

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user's password
    await pool.query(
      'UPDATE users SET password = $1 WHERE id = $2',
      [hashedPassword, userId]
    );

    // Mark reset token as used
    await pool.query(
      'UPDATE password_resets SET used = true WHERE token = $1',
      [token]
    );

    return NextResponse.json({
      message: 'Password reset successful',
    });
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { message: 'Failed to reset password' },
      { status: 500 }
    );
  }
} 