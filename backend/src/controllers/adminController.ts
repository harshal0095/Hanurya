import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private
export const getStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const totalUsers = await prisma.user.count();
    const totalProducts = await prisma.product.count();
    const totalOrders = await prisma.order.count();
    const pendingPaymentReviews = await prisma.order.count({ where: { status: 'PAYMENT_REVIEW' } });

    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, email: true, createdAt: true, role: true }
    });

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      pendingPaymentReviews,
      recentUsers
    });
  } catch (error) {
    next(error);
  }
};
